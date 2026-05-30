#ifndef SHARED_DATA_H
#define SHARED_DATA_H

#include <Arduino.h>
#include <freertos/FreeRTOS.h>
#include <freertos/queue.h>
#include <freertos/semphr.h>

// Enum cho trạng thái điểm danh
enum AttendanceStatus {
    STATUS_ON_TIME = 0,    // Đúng giờ
    STATUS_LATE = 1,       // Đi muộn (trong vòng 15p)
    STATUS_ABSENT = 2,     // Vắng (>15p)
    STATUS_INVALID = 3,    // Thẻ không hợp lệ
    STATUS_TIME_OUT = 4,   // Đã hết giờ
    STATUS_EARLY_LEAVE = 5 // Ra sớm (cho Ca 2)
};

enum DisplayCmd {
    CMD_SHOW_WELCOME,
    CMD_SHOW_ATTENDANCE,
    CMD_SHOW_PASSWORD_UI, // Hiện màn hình "Nhap mat khau:"
    CMD_UPDATE_PWD_DOTS,   // Cập nhật số lượng dấu *
    CMD_SHOW_MSG_TEMP // Hiện thông báo tạm thời (như "Sai mật khẩu!")
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
    int pwd_len;
};

extern QueueHandle_t mqttTxQueue;
extern QueueHandle_t displayQueue;
extern SemaphoreHandle_t settingsMutex;

// --- DỮ LIỆU DÙNG CHUNG (Cần Mutex để truy cập an toàn) ---
extern int shared_deadlineH;
extern int shared_deadlineM;
extern bool shared_hasDeadline;
extern int shared_currentSession;
extern char shared_serverMessage[32];

// --- CỜ BÁO HIỆU (Network báo cho RFID biết để cập nhật LCD) ---
extern bool flag_uiUpdateDeadline;
extern bool flag_uiUpdateSession;
extern bool flag_uiUpdateMsg;
extern int shared_endH;
extern int shared_endM;
extern bool shared_hasEndTime;

// --- DỮ LIỆU CẢNH BÁO CHÁY ---
extern float shared_temp;
extern float shared_hum;
extern bool shared_fireAlert;

#endif