#include "rfid_manager.h"
#include "user_db.h"
#include "servo_manager.h"

MFRC522 mfrc522(SS_PIN, RST_PIN);

int checkAttendanceStatus() {
    xSemaphoreTake(settingsMutex, portMAX_DELAY);
    int dlH = shared_deadlineH, dlM = shared_deadlineM, eH = shared_endH, eM = shared_endM;
    bool hasDL = shared_hasDeadline, hasEnd = shared_hasEndTime;
    int sess = shared_currentSession;
    xSemaphoreGive(settingsMutex);

    if (!hasDL) return 0;
    struct tm timeinfo;
    if (!getLocalTime(&timeinfo, 10)) return 0;

    int currentMins = timeinfo.tm_hour * 60 + timeinfo.tm_min;
    int deadlineMins = dlH * 60 + dlM;
    
    int endMins;
    if (hasEnd) {
        endMins = eH * 60 + eM;
    } else {
        endMins = 9999;
    }

    if (sess == 2) {
        if (hasEnd) {
            if (currentMins + 30 < endMins) return 5; 
            if (currentMins >= endMins + 30) return 4;
        }
        return 0;
    }
    if (hasEnd && currentMins >= endMins) return 4;
    int diff = currentMins - deadlineMins;
    if (diff <= 0) return 0;
    else if (diff <= 15) return 1;
    else return 2;
}

void rfidTask(void *pvParameters) {
    SPI.begin();
    mfrc522.PCD_Init();

    while (1) {
        if (mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial()) {
            uint32_t cardID = 0;
            for (byte i = 0; i < mfrc522.uid.size; i++) cardID = (cardID << 8) | mfrc522.uid.uidByte[i];
            
            int foundIdx = findUserIndex(cardID); 
            int status = checkAttendanceStatus();
            
            xSemaphoreTake(settingsMutex, portMAX_DELAY);
            int sess = shared_currentSession;
            xSemaphoreGive(settingsMutex);

            MqttPayload mqttPayload;
            mqttPayload.uidHash = cardID;

            DisplayMessage uiPayload;
            uiPayload.cmd = CMD_SHOW_ATTENDANCE;
            uiPayload.session = sess;

            if (foundIdx != -1) {
                char mssv[10]; sprintf(mssv, "231%04d", database[foundIdx].idIndex);
                
                // Đóng gói cho UI
                uiPayload.granted = true;
                strncpy(uiPayload.mssv, mssv, 15);
                strncpy(uiPayload.name, database[foundIdx].name, 31);
                uiPayload.status = status;

                if (status == 0 || status == 1) {
                    unlock_gate();
                }
                
                // Đóng gói cho MQTT
                mqttPayload.idIndex = database[foundIdx].idIndex;
                strncpy(mqttPayload.name, database[foundIdx].name, 31);
                const char* sMap[] = {"DUNG_GIO", "DI_MUON", "VANG", "", "HET_GIO", "RA_SOM"};
                strncpy(mqttPayload.status, sMap[status], 15);
            } else {
                // Thẻ lạ
                uiPayload.granted = false;
                sprintf(uiPayload.mssv, "%lX", (unsigned long)cardID);
                strncpy(uiPayload.name, "Unknown", 31);
                uiPayload.status = 3;

                mqttPayload.idIndex = -1; 
                strncpy(mqttPayload.name, "Unknown", 31); 
                strncpy(mqttPayload.status, "THE_LA", 15);
            }

            // Đẩy vào Queue: MQTT đi đường mạng, Display đi đường UI, tách biệt nhau hoàn toàn
            xQueueSend(mqttTxQueue, &mqttPayload, pdMS_TO_TICKS(100));
            xQueueSend(displayQueue, &uiPayload, pdMS_TO_TICKS(100));

            mfrc522.PICC_HaltA(); 
            mfrc522.PCD_StopCrypto1();

            // Tránh quẹt thẻ liên tiếp quá nhanh
            vTaskDelay(pdMS_TO_TICKS(1500));
        }
        
        vTaskDelay(pdMS_TO_TICKS(20)); // Delay nhẹ để tránh chiếm CPU quá mức khi không có thẻ nào được quét
    }
}