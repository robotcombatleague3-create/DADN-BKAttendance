#include "display_manager.h"

LiquidCrystal_I2C lcd(LCD_ADDRESS, LCD_COLS, LCD_ROWS);

UIState currentUIState = UI_IDLE;
unsigned long uiTimer = 0;
int beepCounter = 0;
int targetBeeps = 0;

void setup_display_hardware() {
    lcd.init();
    lcd.backlight();
    pinMode(LED_R, OUTPUT); pinMode(LED_G, OUTPUT); 
    pinMode(LED_B, OUTPUT); pinMode(BUZZER, OUTPUT);
    digitalWrite(LED_R, LOW); digitalWrite(LED_G, LOW); 
    digitalWrite(LED_B, LOW); digitalWrite(BUZZER, LOW);
}

void showWelcome() {
    xSemaphoreTake(settingsMutex, portMAX_DELAY);
    lcd.clear();
    bool hasStart = shared_hasDeadline;
    int sH = shared_deadlineH, sM = shared_deadlineM;
    bool hasEnd = shared_hasEndTime;
    int eH = shared_endH, eM = shared_endM;
    String msg = String(shared_serverMessage);
    
    lcd.setCursor(0, 0); 
    if (hasStart) {
        char buf[20]; sprintf(buf, "Bat dau:  %02d:%02d", sH, sM);
        lcd.print(buf);
    } else lcd.print("Bat dau:  --:--");

    lcd.setCursor(0, 2); 
    if (hasEnd) {
        char buf[20]; sprintf(buf, "Ket thuc: %02d:%02d", eH, eM);
        lcd.print(buf);
    } else lcd.print("Ket thuc: --:--");
    
    lcd.setCursor(0, 3);
    if (msg != "") lcd.print(">> " + msg.substring(0, 17));
    xSemaphoreGive(settingsMutex);
}

void updateTimeDisplay() {
    static unsigned long lastUpdate = 0;
    if (millis() - lastUpdate >= 1000) {
        lastUpdate = millis();
        struct tm timeinfo;
        if (!getLocalTime(&timeinfo, 10)) return; 
        char timeBuff[20];
        strftime(timeBuff, sizeof(timeBuff), "  %H:%M:%S  ", &timeinfo);
        lcd.setCursor(4, 1); lcd.print(timeBuff); 
    }
}

void triggerVisualFeedback(bool granted, String mssv, String name, int status, int session) {
    beepCounter = 0; 
    uiTimer = millis(); 
    digitalWrite(BUZZER, HIGH);

    lcd.clear();
    if (granted) {
        lcd.setCursor(0, 0); lcd.print(name.substring(0, 20));
        lcd.setCursor(0, 1); lcd.print("MSSV: " + mssv);
        lcd.setCursor(0, 2); lcd.print("Ca diem danh: " + String(session));
        lcd.setCursor(0, 3);
        
        if (status == 4) {
            lcd.print("KQ: DA HET GIO!");
            digitalWrite(LED_R, HIGH); targetBeeps = 3;
            currentUIState = UI_DENIED_BEEP_ON;
        } else if (status == 5) {
            lcd.print("KQ: RA SOM!");
            digitalWrite(LED_R, HIGH); targetBeeps = 2;
            currentUIState = UI_DENIED_BEEP_ON;
        } else if (status == 0) {
            lcd.print("KQ: DUNG GIO");
            digitalWrite(LED_G, HIGH); 
            currentUIState = UI_GRANTED_BEEP_ON;
        } else {
            lcd.print(status == 1 ? "KQ: DI MUON" : "KQ: VANG (>15p)");
            digitalWrite(LED_R, HIGH); targetBeeps = (status == 1 ? 1 : 5);
            currentUIState = UI_DENIED_BEEP_ON;
        }
    } else {
        lcd.setCursor(0, 0); lcd.print("ID: " + mssv);
        lcd.setCursor(0, 2); lcd.print("THE KHONG HOP LE");
        digitalWrite(LED_R, HIGH); targetBeeps = 3;
        currentUIState = UI_DENIED_BEEP_ON;
    }
}

void handle_ui_state_machine() {
    unsigned long now = millis();
    xSemaphoreTake(settingsMutex, portMAX_DELAY);
    bool isFire = shared_fireAlert;
    xSemaphoreGive(settingsMutex);

    if (isFire) {
        static unsigned long lastFireToggle = 0;
        static bool fireAlarmState = false;
        if (now - lastFireToggle >= 300) {
            lastFireToggle = now;
            fireAlarmState = !fireAlarmState;
            digitalWrite(LED_R, fireAlarmState ? HIGH : LOW);
            digitalWrite(BUZZER, fireAlarmState ? HIGH : LOW);
            digitalWrite(LED_G, LOW); digitalWrite(LED_B, LOW);
        }
        currentUIState = UI_IDLE; 
        return; 
    }

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
            if (now - uiTimer >= 4000) { 
                showWelcome(); 
                currentUIState = UI_IDLE; 
            }
            break;
        default: break;
    }
}

void checkNetworkFlags() {
    xSemaphoreTake(settingsMutex, portMAX_DELAY);
    if (flag_uiUpdateDeadline || flag_uiUpdateSession || flag_uiUpdateMsg) {
        flag_uiUpdateDeadline = flag_uiUpdateSession = flag_uiUpdateMsg = false;
        xSemaphoreGive(settingsMutex);
        if (currentUIState == UI_IDLE) showWelcome();
        return;
    }
    xSemaphoreGive(settingsMutex);
}

void displayTask(void *pvParameters) {
    setup_display_hardware();
    showWelcome();
    
    DisplayMessage msg;
    bool isPasswordMode = false; // Cờ chặn cập nhật màn hình khi đang nhập mật khẩu

    while (1) {
        handle_ui_state_machine();

        if (xQueueReceive(displayQueue, &msg, 0) == pdPASS) {
            // Nhận lệnh từ RFID hoặc Keypad
            if (msg.cmd == CMD_SHOW_ATTENDANCE) {
                isPasswordMode = false;
                triggerVisualFeedback(msg.granted, String(msg.mssv), String(msg.name), msg.status, msg.session);
            } 
            else if (msg.cmd == CMD_SHOW_WELCOME) {
                isPasswordMode = false;
                showWelcome();
                currentUIState = UI_IDLE;
            }
            else if (msg.cmd == CMD_SHOW_PASSWORD_UI) {
                isPasswordMode = true;
                lcd.clear();
                lcd.setCursor(0, 0); lcd.print("--- CHE DO PWD ---");
                lcd.setCursor(0, 2); lcd.print("Nhap mat khau:");
            }
            else if (msg.cmd == CMD_UPDATE_PWD_DOTS) {
                isPasswordMode = true;
                lcd.setCursor(0, 3);
                String dots = "";
                for(int i = 0; i < msg.pwd_len; i++) dots += "*";
                lcd.print(dots);
            }
            else if (msg.cmd == CMD_SHOW_MSG_TEMP) {
                isPasswordMode = false;
                lcd.clear();
                lcd.setCursor(0, 1); lcd.print(msg.name);
 
                int ledPin;
                if (String(msg.name) == "MAT KHAU DUNG!") {
                    ledPin = LED_G;
                } else {
                    ledPin = LED_R;
                }
                digitalWrite(ledPin, HIGH);
                vTaskDelay(pdMS_TO_TICKS(2000));
                digitalWrite(ledPin, LOW);
                
                showWelcome();
                currentUIState = UI_IDLE;
            }
        } else {
            // Cập nhật đồng hồ và trạng thái mạng chỉ khi rảnh rỗi và KHÔNG ở chế độ mật khẩu
            if (currentUIState == UI_IDLE && !isPasswordMode) {
                updateTimeDisplay();
                checkNetworkFlags(); 
            }
        }
        
        vTaskDelay(pdMS_TO_TICKS(20)); // Nhường CPU
    }
}