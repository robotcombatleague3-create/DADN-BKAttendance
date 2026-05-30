#include <Arduino.h>
#include "shared_data.h"
#include "network_manager.h"
#include "rfid_manager.h"
#include "sensor_manager.h"
#include "servo_manager.h"
#include "keypad_manager.h" 
#include "display_manager.h"

QueueHandle_t mqttTxQueue;
QueueHandle_t displayQueue; // Định nghĩa queue màn hình
SemaphoreHandle_t settingsMutex;

// Khởi tạo biến toàn cục
int shared_deadlineH = 0;
int shared_deadlineM = 0;
int shared_endH = 0;
int shared_endM = 0;
bool shared_hasDeadline = false;
bool shared_hasEndTime = false;
int shared_currentSession = 1;
char shared_serverMessage[32] = "";

bool flag_uiUpdateDeadline = false;
bool flag_uiUpdateSession = false;
bool flag_uiUpdateMsg = false;

float shared_temp = 0.0;
float shared_hum = 0.0;
bool shared_fireAlert = false;

void setup() {
    Serial.begin(115200);
    setup_servo(); 
    unlock_gate();

    mqttTxQueue = xQueueCreate(10, sizeof(MqttPayload));
    displayQueue = xQueueCreate(5, sizeof(DisplayMessage)); // Queue chứa 5 lệnh hiển thị
    settingsMutex = xSemaphoreCreateMutex();

    if (mqttTxQueue == NULL || displayQueue == NULL || settingsMutex == NULL) {
        Serial.println("Lỗi khởi tạo RTOS!");
        return;
    }

    // Core 0: Mạng (WiFi, MQTT, NTP)
    xTaskCreatePinnedToCore(networkTask, "Network", 8192, NULL, 1, NULL, 0);
    
    // Core 1: Hiển thị (LCD, LED, Buzzer) -> Ưu tiên cao hơn để UI mượt
    xTaskCreatePinnedToCore(displayTask, "Display", 4096, NULL, 2, NULL, 1);

    // Core 1: Phần cứng RFID
    xTaskCreatePinnedToCore(rfidTask, "RFID", 8192, NULL, 1, NULL, 1);

    // Core 1: Cảm biến và Servo
    xTaskCreatePinnedToCore(sensorTask, "Sensor", 16384, NULL, 1, NULL, 0);
    xTaskCreatePinnedToCore(servoTask, "Servo", 2048, NULL, 1, NULL, 1);
    xTaskCreatePinnedToCore(keypadTask, "Keypad", 4096, NULL, 1, NULL, 1);
}

void loop() {
    vTaskDelete(NULL); 
}