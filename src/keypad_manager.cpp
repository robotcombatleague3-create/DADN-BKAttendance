#include "keypad_manager.h"
#include "servo_manager.h"

char keys[KEYPAD_ROWS][KEYPAD_COLS] = {
  {'1','2','3'},
  {'4','5','6'},
  {'7','8','9'}
};

Keypad keypad = Keypad(makeKeymap(keys), (byte*)rowPins, (byte*)colPins, KEYPAD_ROWS, KEYPAD_COLS);

void keypadTask(void *pvParameters) {
    String inputBuffer = "";
    int wrongCount = 0;
    unsigned long lastActivity = 0;
    bool isEnteringPwd = false;

    while (1) {
        char key = keypad.getKey();

        if (key) {
            lastActivity = millis();
            
            if (!isEnteringPwd) {
                if (key == '1') { // Nhấn 1 để bắt đầu nhập mật khẩu
                    isEnteringPwd = true;
                    inputBuffer = "";
                    DisplayMessage msg = {CMD_SHOW_PASSWORD_UI};
                    xQueueSend(displayQueue, &msg, portMAX_DELAY);
                }
            } else {
                // Đang trong chế độ nhập mật khẩu
                if (inputBuffer.length() < 8) {
                    inputBuffer += key;
                    DisplayMessage msg = {CMD_UPDATE_PWD_DOTS};
                    msg.pwd_len = inputBuffer.length();
                    xQueueSend(displayQueue, &msg, portMAX_DELAY);
                }

                if (inputBuffer.length() == String(ACCESS_PASSWORD).length()) {
                    if (inputBuffer == ACCESS_PASSWORD) {
                        // Đúng mật khẩu
                        unlock_gate();
                        DisplayMessage msg = {CMD_SHOW_MSG_TEMP};
                        strncpy(msg.name, "MAT KHAU DUNG!", 31);
                        xQueueSend(displayQueue, &msg, portMAX_DELAY);
                        wrongCount = 0;
                        isEnteringPwd = false;
                    } else {
                        // Sai mật khẩu
                        wrongCount++;
                        DisplayMessage msg = {CMD_SHOW_MSG_TEMP};
                        if (wrongCount >= 3) {
                            strncpy(msg.name, "SAI QUA 3 LAN!", 31);
                            wrongCount = 0; // Reset đếm sai
                        } else {
                            strncpy(msg.name, "SAI MAT KHAU!", 31);
                        }
                        xQueueSend(displayQueue, &msg, portMAX_DELAY);
                        isEnteringPwd = false;
                    }
                }
            }
        }

        // Kiểm tra timeout 5s
        if (isEnteringPwd && (millis() - lastActivity > PWD_TIMEOUT)) {
            isEnteringPwd = false;
            DisplayMessage msg = {CMD_SHOW_MSG_TEMP};
            strncpy(msg.name, "HET THOI GIAN!", 31);
            xQueueSend(displayQueue, &msg, portMAX_DELAY);
        }

        vTaskDelay(pdMS_TO_TICKS(50));
    }
}