#include "rfid_manager.h"
#include "user_db.h"
#include "servo_manager.h"
#include "shared_data.h"

MFRC522 mfrc522(SS_PIN, RST_PIN);

// Truyền index của sinh viên vào để lấy đúng lịch học của người đó
int checkAttendanceStatus(int userIdx) {
    if (userIdx < 0) return 3; 

    struct tm timeinfo;
    if (!getLocalTime(&timeinfo, 10)) return 3; // Lỗi WiFi/Thời gian

    int currentMins = timeinfo.tm_hour * 60 + timeinfo.tm_min;
    
    // Lấy mốc thời gian của riêng sinh viên đó
    int startMins = database[userIdx].startH * 60 + database[userIdx].startM;
    int lateMins = database[userIdx].lateH * 60 + database[userIdx].lateM;
    int endMins = database[userIdx].endH * 60 + database[userIdx].endM;

    // --- LOGIC ĐIỂM DANH THEO LỚP ---
    if (currentMins < startMins - 5) {
        return 3; // Quẹt quá sớm (chưa tới ngưỡng -5 phút)
    } 
    else if (currentMins >= startMins - 5 && currentMins <= startMins) {
        return 0; // Đúng giờ
    } 
    else if (currentMins > lateMins && currentMins <= endMins) {
        return 2; // Vắng (đi muộn nhưng vẫn trong giờ học)
    } 
    else if (currentMins > startMins && currentMins <= lateMins) {
        return 1; // Đi muộn nhưng vẫn được tính điểm danh
    }
    else {
        return 4; // Ca học đã kết thúc
    }
}

void rfidTask(void *pvParameters) {
    SPI.begin();
    mfrc522.PCD_Init();

    while (1) {
        if (mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial()) {
            uint32_t cardID = 0;
            for (byte i = 0; i < mfrc522.uid.size; i++) cardID = (cardID << 8) | mfrc522.uid.uidByte[i];
            
            int foundIdx = findUserIndex(cardID); 
            
            xSemaphoreTake(settingsMutex, portMAX_DELAY);
            int sess = shared_currentSession;
            xSemaphoreGive(settingsMutex);

            MqttPayload mqttPayload;
            mqttPayload.uidHash = cardID;

            DisplayMessage uiPayload;
            uiPayload.cmd = CMD_SHOW_ATTENDANCE;
            uiPayload.session = sess;

            if (foundIdx != -1) {
                int status = checkAttendanceStatus(foundIdx);
                
                char mssv[10]; sprintf(mssv, "231%04d", database[foundIdx].idIndex);
                
                uiPayload.granted = true; 
                strncpy(uiPayload.mssv, mssv, 15);
                strncpy(uiPayload.name, database[foundIdx].name, 31);
                uiPayload.status = status;

                if (status == 0 || status == 1) {
                    unlock_gate();
                }
                
                mqttPayload.idIndex = database[foundIdx].idIndex;
                strncpy(mqttPayload.name, database[foundIdx].name, 31);
                
                // Ánh xạ trạng thái gửi lên Web qua MQTT
                const char* sMap[] = {"DUNG_GIO", "DI_MUON", "VANG", "CHUA_TOI", "HET_GIO"};
                if (status >= 0 && status <= 4) {
                    strncpy(mqttPayload.status, sMap[status], 15);
                }
            } else {
                // THẺ LẠ
                uiPayload.granted = false;
                sprintf(uiPayload.mssv, "%lX", (unsigned long)cardID);
                strncpy(uiPayload.name, "Unknown", 31);
                uiPayload.status = 7; 

                mqttPayload.idIndex = -1; 
                strncpy(mqttPayload.name, "Unknown", 31); 
                strncpy(mqttPayload.status, "THE_LA", 15);
            }

            xQueueSend(mqttTxQueue, &mqttPayload, pdMS_TO_TICKS(100));
            xQueueSend(displayQueue, &uiPayload, pdMS_TO_TICKS(100));

            mfrc522.PICC_HaltA(); 
            mfrc522.PCD_StopCrypto1();

            vTaskDelay(pdMS_TO_TICKS(1500));
        }
        
        vTaskDelay(pdMS_TO_TICKS(20)); 
    }
}