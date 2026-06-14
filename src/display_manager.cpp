#include "display_manager.h"
#include <LiquidCrystal_I2C.h>
#include "shared_data.h"

LiquidCrystal_I2C lcd(LCD_ADDRESS, LCD_COLS, LCD_ROWS);

UIState currentUIState = UI_IDLE;
unsigned long uiTimer = 0;
int beepCounter = 0;
int targetBeeps = 0;

void setup_display_hardware() {
    vTaskDelay(pdMS_TO_TICKS(500));
    lcd.init();
    lcd.backlight();
    pinMode(LED_R, OUTPUT); pinMode(LED_G, OUTPUT); 
    pinMode(LED_B, OUTPUT); pinMode(BUZZER, OUTPUT);
    digitalWrite(LED_R, LOW); digitalWrite(LED_G, LOW); 
    digitalWrite(LED_B, LOW); digitalWrite(BUZZER, LOW);
}

// Hàm này giờ CHỈ xử lý Còi và Đèn LED, không in đè lên LCD nữa
void triggerVisualFeedback(bool granted, int status) {
    beepCounter = 0; 
    uiTimer = millis(); 
    digitalWrite(BUZZER, HIGH); 

    if (granted) {
        if (status == 0) { // 0: Đúng giờ (STATUS_ON_TIME)
            digitalWrite(LED_G, HIGH); 
            currentUIState = UI_GRANTED_BEEP_ON;
        } 
        else if (status == 1 || status == 2) { // 1: Đi trễ, 2: Vắng
            digitalWrite(LED_R, HIGH); 
            targetBeeps = 1;
            currentUIState = UI_DENIED_BEEP_ON;
        } 
        else if (status == 3 || status == 4) { // Các lỗi thời gian (Chưa tới, Hết giờ)
            digitalWrite(LED_R, HIGH); 
            targetBeeps = 3;
            currentUIState = UI_DENIED_BEEP_ON;
        } 
        else {
            digitalWrite(LED_R, HIGH); 
            targetBeeps = 1;
            currentUIState = UI_DENIED_BEEP_ON;
        }
    } else {
        digitalWrite(LED_R, HIGH); 
        targetBeeps = 3;
        currentUIState = UI_DENIED_BEEP_ON;
    }
}
void handle_ui_state_machine() {
    unsigned long now = millis();

    switch (currentUIState) {
        case UI_GRANTED_BEEP_ON:
            if (now - uiTimer >= 150) { 
                digitalWrite(BUZZER, LOW); 
                currentUIState = UI_GRANTED_BEEP_OFF; 
                uiTimer = now; }
            break;
        case UI_GRANTED_BEEP_OFF:
            if (now - uiTimer >= 850) { 
                digitalWrite(LED_G, LOW); 
                currentUIState = UI_COOLDOWN; 
                uiTimer = now; }
            break;
        case UI_DENIED_BEEP_ON:
            if (now - uiTimer >= 150) { 
                digitalWrite(BUZZER, LOW); 
                currentUIState = UI_DENIED_BEEP_OFF; 
                uiTimer = now; }
            break;
        case UI_DENIED_BEEP_OFF:
            if (now - uiTimer >= 100) {
                if (++beepCounter < targetBeeps) { 
                    digitalWrite(BUZZER, HIGH); 
                    currentUIState = UI_DENIED_BEEP_ON; 
                }
                else { 
                    digitalWrite(LED_R, LOW); 
                    currentUIState = UI_COOLDOWN; 
                }
                uiTimer = now;
            }
            break;
        case UI_COOLDOWN:
            if (now - uiTimer >= 3000) { 
                lcd.clear(); 
                currentUIState = UI_IDLE; 
            }
            break;
        default: break;
    }
}

void displayTask(void *pvParameters) {
    setup_display_hardware();
    lcd.clear();

    DisplayMessage msg;
    bool isPasswordMode = false;
    struct tm timeinfo;
    char timeStr[16];
    char periodStr[25];

    while (1) {
        handle_ui_state_machine();

        if (xQueueReceive(displayQueue, &msg, pdMS_TO_TICKS(50)) == pdPASS) {
            if (msg.cmd == CMD_SHOW_ATTENDANCE) {
                isPasswordMode = false;
                lcd.clear();
                
                if (msg.granted) {
                    lcd.setCursor(0, 0); lcd.print(msg.name);
                    lcd.setCursor(0, 1);
                    switch(msg.status) {
                        case 0: lcd.print("Trang thai: DUNG GIO"); break;
                        case 1: lcd.print("Trang thai: DI TRE"); break;
                        case 2: lcd.print("Trang thai: VANG"); break;
                        case 3: lcd.print("Loi: CHUA TOI GIO"); break;
                        case 4: lcd.print("Loi: CA HOC DA HET"); break;
                        default: lcd.print("Trang thai: KHONG RO"); break;
                    }
                    lcd.setCursor(0, 2); lcd.print("MSSV: "); lcd.print(msg.mssv);
                } else {
                    lcd.setCursor(0, 0); lcd.print("ID: "); lcd.print(msg.mssv);
                    lcd.setCursor(0, 2); lcd.print("THE KHONG HOP LE");
                }
                triggerVisualFeedback(msg.granted, msg.status); 
            } 
            else if (msg.cmd == CMD_SHOW_MSG_TEMP) {
                isPasswordMode = false;
                lcd.clear();
                lcd.setCursor(0, 1); lcd.print(msg.tempMsg); // Dùng biến tempMsg mới
                
                if (String(msg.tempMsg) == "MAT KHAU DUNG!") {
                    triggerVisualFeedback(true, 0);
                } else {
                    triggerVisualFeedback(false, 1);
                }
            }
        } 
        else {
            // CHẾ ĐỘ NỀN (IDLE): Chỉ vẽ lại màn hình khi rảnh và không nhập Pass
            if (currentUIState == UI_IDLE && !isPasswordMode) {
                static unsigned long lastTimeUpdate = 0;
                
                // Cập nhật mỗi giây 1 lần để tránh giật màn hình
                if (millis() - lastTimeUpdate >= 1000) {
                    lastTimeUpdate = millis();
                    if (getLocalTime(&timeinfo)) {
                        sprintf(timeStr, "Time: %02d:%02d:%02d", timeinfo.tm_hour, timeinfo.tm_min, timeinfo.tm_sec);
                        lcd.setCursor(0, 0); lcd.print(timeStr);
                        
                        lcd.setCursor(0, 1);
                        if (hasActiveQuery) {
                            char shortClassName[21];
                            strncpy(shortClassName, currentClassName, 20);
                            shortClassName[20] = '\0';
                            lcd.print(shortClassName);
                            
                            sprintf(periodStr, "Ca: %02d:%02d - %02d:%02d", 
                                    currentClassStartH, currentClassStartM, 
                                    currentClassEndH, currentClassEndM);
                            lcd.setCursor(0, 2); lcd.print(periodStr);
                        } else {
                            lcd.print("KHONG CO LOP HOC    ");
                            lcd.setCursor(0, 2); lcd.print("Moi quet the...     ");
                        }
                        lcd.setCursor(0, 3); lcd.print("HE THONG DIEM DANH  ");
                    }
                }
            }
        }
    }
}