#include "network_manager.h"

const char* ssid = "Mon & Bom";
const char* password = "10122000";
const char* mqtt_topic_pub = "test/vinh/mqtt/send"; 
const char* mqtt_topic_sub = "test/vinh/mqtt/recv"; 

WiFiClient espClient;
PubSubClient client(espClient);

void setup_wifi_and_time() {
    vTaskDelay(pdMS_TO_TICKS(10));
    Serial.println("\nConnecting to WiFi...");
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) { 
        vTaskDelay(pdMS_TO_TICKS(500)); 
        Serial.print("."); 
    }
    Serial.println("\nWiFi connected.");
    
    configTime(GMT_OFFSET_SEC, DAYLIGHT_OFFSET_SEC, NTP_SERVER);
}

void mqtt_callback(char* topic, byte* payload, unsigned int length) {
    String message = "";
    for (int i = 0; i < length; i++) message += (char)payload[i];
    Serial.println("\n[MQTT NHAN]: " + message);
    
    xSemaphoreTake(settingsMutex, portMAX_DELAY);
    
    if (message.startsWith("DEADLINE:")) {
        shared_deadlineH = message.substring(9, 11).toInt();
        shared_deadlineM = message.substring(12, 14).toInt();
        shared_hasDeadline = true;
        flag_uiUpdateDeadline = true; 
    } 
    else if (message.startsWith("ENDTIME:")) {
        shared_endH = message.substring(8, 10).toInt();
        shared_endM = message.substring(11, 13).toInt();
        shared_hasEndTime = true;
        flag_uiUpdateDeadline = true; // Xài chung cờ để báo màn hình update
    }
    // -------------------------------------------
    else if (message.startsWith("SESSION:")) {
        shared_currentSession = message.substring(8).toInt();
        flag_uiUpdateSession = true;
    }
    else {
        strncpy(shared_serverMessage, message.c_str(), sizeof(shared_serverMessage) - 1);
        shared_serverMessage[sizeof(shared_serverMessage) - 1] = '\0';
        flag_uiUpdateMsg = true;
    }
    
    xSemaphoreGive(settingsMutex);
}

void mqtt_reconnect() {
    while (!client.connected()) {
        Serial.print("Attempting MQTT connection...");
        String clientId = "ESP32-Attendance-" + String(random(0xffff), HEX);
        if (client.connect(clientId.c_str())) {
            Serial.println("connected");
            client.subscribe(mqtt_topic_sub); 
        } else {
            Serial.print("failed, rc="); Serial.print(client.state());
            vTaskDelay(pdMS_TO_TICKS(5000));
        }
    }
}

void networkTask(void *pvParameters) {
    setup_wifi_and_time();
    client.setServer(MQTT_BROKER, MQTT_PORT);
    client.setCallback(mqtt_callback);

    MqttPayload payload;

    while (1) {
        if (!client.connected()) {
            mqtt_reconnect();
        }
        client.loop(); 

        // Rút dữ liệu từ Queue ra gửi (chờ tối đa 50ms để không kẹt MQTT Loop)
        if (xQueueReceive(mqttTxQueue, &payload, pdMS_TO_TICKS(50)) == pdPASS) {
            String statusStr(payload.status);
            String nameStr(payload.name);
            
            xSemaphoreTake(settingsMutex, portMAX_DELAY);
            int session = shared_currentSession;
            xSemaphoreGive(settingsMutex);

            String json = "uidHash: " + String(payload.uidHash, HEX) + 
                          ", idIndex: " + String(payload.idIndex) + 
                          ", name: " + nameStr + 
                          ", status: " + statusStr + 
                          ", session: " + String(session);
            
            client.publish(mqtt_topic_pub, json.c_str());
            Serial.println("Sent: " + json);
        }
    }
}