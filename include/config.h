#ifndef CONFIG_H
#define CONFIG_H

//===================== LED RGB ====================
#define LED_R     13  //R GND(dai nhat) G B
#define LED_G     14
#define LED_B     12

//===================== BUZZER ====================
#define BUZZER    2

//===================== SERVO ====================
#define SERVO_PIN 27           // vàng, đỏ là VCC và đen là GND
#define GATE_CLOSED_ANGLE 0    
#define GATE_OPEN_ANGLE 90
#define GATE_OPEN_DURATION 3000 // Mở cửa trong 3 giây (3000ms)

//===================== DHT22 ====================
#define DHTPIN 15
#define DHTTYPE DHT22

//===================== LCD I2C ====================
#define LCD_SDA_PIN 21   // I2C SDA cho LCD
#define LCD_SCL_PIN 22   // I2C SCL cho LCD
#define LCD_ADDRESS 0x27 // Địa chỉ I2C của LCD (có thể là 0x27 hoặc 0x3F)
#define LCD_COLS 20      // Số cột của LCD
#define LCD_ROWS 4       // Số hàng của LCD

//===================== RFID ====================
#define SS_PIN    5 // SDA
#define RST_PIN   4
// SCK(MFRC522): D18
// MOSI(MFRC522): D23   
// MISO(MFRC522): D19

//===================== NTP ====================
#define NTP_SERVER "pool.ntp.org"
#define GMT_OFFSET_SEC 7 * 3600 // GMT+7
#define DAYLIGHT_OFFSET_SEC 0

//===================== MQTT ====================
#define MQTT_BROKER "broker.hivemq.com"
#define MQTT_PORT 1883

//===================== KEYPAD ====================
#define KEYPAD_ROWS 3
#define KEYPAD_COLS 3
// Các chân bạn yêu cầu: 16 (RX2), 17 (TX2), 25, 26, 32, 33
const byte rowPins[KEYPAD_ROWS] = {26, 17, 16}; 
const byte colPins[KEYPAD_COLS] = {32, 33, 25}; 

#define ACCESS_PASSWORD "1234" // Mật khẩu mẫu
#define PWD_TIMEOUT 5000       // 5 giây timeout

#endif // CONFIG_H