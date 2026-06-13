#include <Arduino.h>
#include "shared_data.h"
#include "network_manager.h"
#include "rfid_manager.h"
#include "servo_manager.h"
#include "display_manager.h"

QueueHandle_t mqttTxQueue;
QueueHandle_t displayQueue;
SemaphoreHandle_t settingsMutex;

// Khởi tạo biến toàn cục
int shared_currentSession = 1;
char shared_serverMessage[32] = "";

bool flag_uiUpdateMsg = false;

char currentClassName[64] = "";
int currentClassStartH = 0, currentClassStartM = 0;
int currentClassEndH = 0, currentClassEndM = 0;
bool hasActiveQuery = false;

void setup() {
    Serial.begin(115200);
    setup_servo(); 
    unlock_gate();

    mqttTxQueue = xQueueCreate(50, sizeof(MqttPayload));
    displayQueue = xQueueCreate(5, sizeof(DisplayMessage)); 
    settingsMutex = xSemaphoreCreateMutex();

    if (mqttTxQueue == NULL || displayQueue == NULL || settingsMutex == NULL) {
        Serial.println("Lỗi khởi tạo RTOS!");
        return;
    }

    // Core 0: Mạng (WiFi, MQTT)
    xTaskCreatePinnedToCore(networkTask, "Network", 20480, NULL, 1, NULL, 0);
    
    // Core 1: Hiển thị (LCD, LED, Buzzer)
    xTaskCreatePinnedToCore(displayTask, "Display", 4096, NULL, 2, NULL, 1);

    // Core 1: Phần cứng RFID
    xTaskCreatePinnedToCore(rfidTask, "RFID", 8192, NULL, 1, NULL, 1);

    // Core 1: Servo
    xTaskCreatePinnedToCore(servoTask, "Servo", 2048, NULL, 1, NULL, 1);
}

void loop() {
    vTaskDelete(NULL); 
}