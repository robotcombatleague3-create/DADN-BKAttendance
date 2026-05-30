#include "servo_manager.h"
#include "shared_data.h"

Servo gateServo;

// TỪ KHÓA 'volatile' CỰC KỲ QUAN TRỌNG ĐỂ RTOS KHÔNG BỊ "MÙ" BIẾN
volatile bool isGateOpen = false;
volatile unsigned long gateTimer = 0;

void setup_servo() {
    ESP32PWM::allocateTimer(0);
    ESP32PWM::allocateTimer(1);
    ESP32PWM::allocateTimer(2);
    ESP32PWM::allocateTimer(3);
    
    gateServo.setPeriodHertz(50);
    gateServo.attach(SERVO_PIN, 500, 2400); 
    
    // Ghi góc 0 lúc khởi động
    gateServo.write(GATE_CLOSED_ANGLE);
}

void unlock_gate() {
    // Ghi góc mở cửa
    gateServo.write(GATE_OPEN_ANGLE);
    
    // Cập nhật biến trạng thái
    isGateOpen = true;
    gateTimer = millis();
    Serial.println("Cửa đã mở!");
}

void servoTask(void *pvParameters) {
    setup_servo();
    
    while (1) {
        xSemaphoreTake(settingsMutex, portMAX_DELAY);
        bool fireDetected = shared_fireAlert;
        xSemaphoreGive(settingsMutex);

        if (fireDetected) {
            if (!isGateOpen) {
                gateServo.write(GATE_OPEN_ANGLE);
                isGateOpen = true;
            }
        } else {
            // KIỂM TRA ĐÓNG CỬA
            if (isGateOpen) {
                unsigned long timeElapsed = millis() - gateTimer;
                
                // NẾU HẾT GIỜ MỞ CỬA
                if (timeElapsed >= GATE_OPEN_DURATION) {
                    gateServo.write(GATE_CLOSED_ANGLE);
                    isGateOpen = false;
                }
            }
        }
        
        if (isGateOpen) {
            gateServo.write(GATE_OPEN_ANGLE);
        } else {
            gateServo.write(GATE_CLOSED_ANGLE);
        }

        vTaskDelay(pdMS_TO_TICKS(50)); 
    }
}