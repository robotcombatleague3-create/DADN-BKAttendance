#ifndef SHARED_DATA_H
#define SHARED_DATA_H

#include <Arduino.h>
#include <freertos/FreeRTOS.h>
#include <freertos/queue.h>
#include <freertos/semphr.h>

// Enum cho trạng thái điểm danh
enum AttendanceStatus {
    STATUS_ON_TIME = 0,    // Đúng giờ
    STATUS_LATE = 1,       // Đi muộn 
    STATUS_ABSENT = 2,     // Vắng 
    STATUS_INVALID = 3,    // Thẻ không hợp lệ
    STATUS_TIME_OUT = 4,   // Đã hết giờ
};

enum DisplayCmd {
    CMD_SHOW_WELCOME,
    CMD_SHOW_ATTENDANCE,
    CMD_SHOW_MSG_TEMP 
};

// Struct gửi từ RFID sang Network qua Queue
struct MqttPayload {
    uint32_t uidHash;
    int idIndex;
    char name[32];
    char status[16];
};

// Struct gửi từ RFID sang UI qua Queue
struct DisplayMessage {
    DisplayCmd cmd;
    uint32_t uidHash;
    bool granted;
    char mssv[16];
    char name[32];
    int status;
    int session;
    char tempMsg[32];
};

extern QueueHandle_t mqttTxQueue;
extern QueueHandle_t displayQueue;
extern SemaphoreHandle_t settingsMutex;

// --- DỮ LIỆU DÙNG CHUNG (Cần Mutex để truy cập an toàn) ---
extern int shared_currentSession;
extern char shared_serverMessage[32];

// --- CỜ BÁO HIỆU (Network báo cho RFID biết để cập nhật LCD) ---
extern bool flag_uiUpdateMsg;
extern bool shared_hasEndTime;

// --- DỮ LIỆU LỚP HỌC HIỆN TẠI (Dùng cho màn hình điểm danh) ---
extern char currentClassName[64];
extern int currentClassStartH, currentClassStartM;
extern int currentClassEndH, currentClassEndM;
extern bool hasActiveQuery;

#endif