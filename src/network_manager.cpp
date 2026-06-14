#include "network_manager.h"
#include "user_db.h"
#include <ArduinoJson.h>

const char* ssid = "Bao Ngoc 4";
const char* password = "@BaoNgoc4";
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
    
    if (message.startsWith("SYNC_DB:")) {
        String jsonStr = message.substring(8);
        JsonDocument doc;
        DeserializationError error = deserializeJson(doc, jsonStr);
        
        if (!error) {
            JsonArray arr = doc.as<JsonArray>();
            int newTotal = 0;
            
            for (JsonObject v : arr) {
                if (newTotal >= MAX_USERS) break;
                
                // 1. UID và Index
                String uidHex = v["u"].as<String>();
                database[newTotal].uidHash = strtoul(uidHex.c_str(), NULL, 16);
                database[newTotal].idIndex = v["i"].as<int>();
                
                // 2. Tên sinh viên
                strncpy(database[newTotal].name, v["n"].as<const char*>(), 31);
                database[newTotal].name[31] = '\0';

                // 3. Tên lớp học (trường "c")
                strncpy(database[newTotal].className, v["c"].as<const char*>(), 63);
                database[newTotal].className[63] = '\0';

                // --- BẮT ĐẦU XỬ LÝ THỜI GIAN MỚI ---
                int h = 0, m = 0, s = 0;
                
                // 4. Giờ bắt đầu (trường "st")
                const char* stStr = v["st"].as<const char*>();
                if (sscanf(stStr, "%d:%d:%d", &h, &m, &s) == 3) {
                    database[newTotal].startH = h;
                    database[newTotal].startM = m;
                }

                // 5. Giờ kết thúc (trường "et")
                const char* etStr = v["et"].as<const char*>();
                if (sscanf(etStr, "%d:%d:%d", &h, &m, &s) == 3) {
                    database[newTotal].endH = h;
                    database[newTotal].endM = m;
                }

                // 6. Giờ cho phép trễ (trường "lt")
                const char* ltStr = v["lt"].as<const char*>();
                if (sscanf(ltStr, "%d:%d:%d", &h, &m, &s) == 3) {
                    database[newTotal].lateH = h;
                    database[newTotal].lateM = m;
                }
                // --- KẾT THÚC XỬ LÝ THỜI GIAN ---

                newTotal++;
                
                vTaskDelay(pdMS_TO_TICKS(1)); 
            }
            
            totalCards = newTotal;
            Serial.printf("Dong bo thanh cong %d sinh vien vao RAM!\n", totalCards);
            
        } else {
            Serial.print("Loi parse JSON: ");
            Serial.println(error.c_str());
        }
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

void checkAndUpdateActiveSession() {
    struct tm timeinfo;
    if (!getLocalTime(&timeinfo)) return;
    
    // Đổi thời gian hiện tại ra phút tính từ 00:00
    int currentMins = timeinfo.tm_hour * 60 + timeinfo.tm_min;
    bool found = false;
    
    xSemaphoreTake(settingsMutex, portMAX_DELAY);
    for (int i = 0; i < totalCards; i++) {
        int startMins = database[i].startH * 60 + database[i].startM;
        int endMins = database[i].endH * 60 + database[i].endM;
        // Nếu thời gian hiện tại nằm trong khoảng [Trước giờ học 5p] đến [Giờ kết thúc]
        if (currentMins >= (startMins - 5) && currentMins <= endMins) {
            strncpy(currentClassName, database[i].className, 63);
            currentClassName[63] = '\0';
            currentClassStartH = database[i].startH;
            currentClassStartM = database[i].startM;
            currentClassEndH = database[i].endH;
            currentClassEndM = database[i].endM;
            found = true;
            break; 
        }
    }
    hasActiveQuery = found;
    xSemaphoreGive(settingsMutex);
}

void networkTask(void *pvParameters) {
    setup_wifi_and_time();
    client.setBufferSize(16384);
    client.setServer(MQTT_BROKER, MQTT_PORT);
    client.setCallback(mqtt_callback);

    MqttPayload payload;
    unsigned long lastCheckTime = 0;

    while (1) {
        if (!client.connected()) {
            mqtt_reconnect();
        }
        client.loop(); 
        if (millis() - lastCheckTime > 5000) {
            checkAndUpdateActiveSession();
            lastCheckTime = millis();
        }

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