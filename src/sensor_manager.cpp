#include "sensor_manager.h"
#include "dht_anomaly_model.h" // Chứa mảng Hex của bạn

#include <TensorFlowLite_ESP32.h>

// Các thư viện chuẩn của TensorFlow Lite Micro
#include "tensorflow/lite/micro/all_ops_resolver.h"
#include "tensorflow/lite/micro/micro_error_reporter.h"
#include "tensorflow/lite/micro/micro_interpreter.h"
#include "tensorflow/lite/schema/schema_generated.h"

DHT dht(DHTPIN, DHTTYPE);

// ==========================================
// CÁC BIẾN TOÀN CỤC CHO TINYML
// ==========================================
namespace {
    tflite::ErrorReporter* error_reporter = nullptr;
    const tflite::Model* model = nullptr;
    tflite::MicroInterpreter* interpreter = nullptr;
    TfLiteTensor* input = nullptr;
    TfLiteTensor* output = nullptr;
    
    // Cấp phát vùng nhớ cho quá trình tính toán của AI (Tensor Arena)
    // Nếu ESP32 bị crash/reset khi chạy, hãy tăng số này lên (ví dụ: 8 * 1024)
    constexpr int kTensorArenaSize = 4 * 1024; 
    uint8_t tensor_arena[kTensorArenaSize];
}

// ==========================================
// HÀM KHỞI TẠO MÔ HÌNH AI
// ==========================================
void setupTinyML() {
    static tflite::MicroErrorReporter micro_error_reporter;
    error_reporter = &micro_error_reporter;

    // Load model từ mảng byte
    model = tflite::GetModel(dht_anomaly_model_tflite);
    if (model->version() != TFLITE_SCHEMA_VERSION) {
        Serial.println("Lỗi: Phiên bản TFLite Schema không khớp!");
        return;
    }

    // Đăng ký các toán tử mạng nơ-ron (Ops)
    static tflite::AllOpsResolver resolver;
    
    // Khởi tạo bộ nội suy (Interpreter)
    static tflite::MicroInterpreter static_interpreter(
        model, resolver, tensor_arena, kTensorArenaSize, error_reporter);
    interpreter = &static_interpreter;

    // Cấp phát bộ nhớ cho các Tensor (Đầu vào/Đầu ra)
    TfLiteStatus allocate_status = interpreter->AllocateTensors();
    if (allocate_status != kTfLiteOk) {
        Serial.println("Lỗi: Không thể cấp phát bộ nhớ Tensors!");
        return;
    }

    // Gán con trỏ tới Tensor đầu vào và đầu ra
    input = interpreter->input(0);
    output = interpreter->output(0);
    
    Serial.println("TinyML Model đã khởi tạo thành công!");
}

// ==========================================
// TASK ĐỌC CẢM BIẾN VÀ CHẠY AI
// ==========================================
void sensorTask(void *pvParameters) {
    dht.begin();
    
    // Chỉ khởi tạo AI một lần duy nhất khi Task bắt đầu
    setupTinyML(); 
    
    while (1) {
        // DHT22 cần khoảng 2 giây giữa các lần đọc
        vTaskDelay(pdMS_TO_TICKS(2000)); 
        
        float h = dht.readHumidity();
        float t = dht.readTemperature();

        // Bỏ qua nếu lỗi đọc cảm biến
        if (isnan(h) || isnan(t)) {
            Serial.println("Loi doc cam bien DHT22!");
            continue;
        }

        // 1. Nạp dữ liệu vào Tensor đầu vào của mô hình
        // Giả định mô hình của bạn được train với 2 input: [Nhiệt độ, Độ ẩm]
        input->data.f[0] = t; 
        input->data.f[1] = h; 

        // 2. Chạy thuật toán nội suy (Inference)
        TfLiteStatus invoke_status = interpreter->Invoke();
        
        bool isFire = false;
        
        if (invoke_status == kTfLiteOk) {
            // 3. Lấy kết quả từ Tensor đầu ra
            // Giả định đầu ra là 1 nơ-ron trả về giá trị xác suất (0.0 đến 1.0)
            float anomaly_score = output->data.f[0];
            
            Serial.printf("Nhiệt độ: %.1fC - Độ ẩm: %.1f%% -> Xác suất cháy: %.1f%%\n", t, h, anomaly_score * 100);
            
            // Nếu xác suất báo cháy lớn hơn 80% (0.80)
            if (anomaly_score > 0.80) {
                isFire = true;
            }
        } else {
            Serial.println("Lỗi: TinyML Invoke thất bại!");
        }

        // 4. Cập nhật biến toàn cục một cách an toàn
        xSemaphoreTake(settingsMutex, portMAX_DELAY);
        shared_temp = t;
        shared_hum = h;
        shared_fireAlert = isFire;
        xSemaphoreGive(settingsMutex);

        // 5. Gửi cảnh báo MQTT nếu phát hiện cháy
        if (isFire) {
            Serial.println(">> CẢNH BÁO CHÁY (TinyML) <<");
            MqttPayload alertPayload;
            alertPayload.idIndex = 999; 
            strncpy(alertPayload.name, "FIRE_ALARM", 31);
            strncpy(alertPayload.status, "DANGER", 15);
            xQueueSend(mqttTxQueue, &alertPayload, pdMS_TO_TICKS(100)); // Dùng 100ms thay vì portMAX_DELAY để tránh kẹt
        }
    }
}

// #include "sensor_manager.h"

// DHT dht(DHTPIN, DHTTYPE);


// bool predictFireRisk(float temp, float hum) {
//     // Logic tạm thời khi chưa gắn Model: Nhiệt độ > 60 hoặc (Nhiệt độ > 50 & Độ ẩm < 20%)
//     if (temp > 60.0 || (temp > 50.0 && hum < 20.0)) {
//         return true; 
//     }
//     return false;
// }

// void sensorTask(void *pvParameters) {
//     dht.begin();
    
//     while (1) {
//         // DHT22 cần khoảng 2 giây giữa các lần đọc
//         vTaskDelay(pdMS_TO_TICKS(2000)); 
        
//         float h = dht.readHumidity();
//         float t = dht.readTemperature();

//         // Bỏ qua nếu lỗi đọc cảm biến
//         if (isnan(h) || isnan(t)) {
//             Serial.println("Loi doc cam bien DHT22!");
//             continue;
//         }

//         // Chạy model dự đoán
//         bool isFire = predictFireRisk(t, h);

//         // Cập nhật biến toàn cục một cách an toàn
//         xSemaphoreTake(settingsMutex, portMAX_DELAY);
//         shared_temp = t;
//         shared_hum = h;
//         shared_fireAlert = isFire;
//         xSemaphoreGive(settingsMutex);

//         if (isFire) {
//             Serial.printf("CẢNH BÁO CHÁY! Nhiệt độ: %.1fC - Độ ẩm: %.1f%%\n", t, h);
//             // Gửi cảnh báo lên Queue để MQTT gửi đi (Tùy chọn)
//             MqttPayload alertPayload;
//             alertPayload.idIndex = 999; // ID đặc biệt cho hệ thống
//             strncpy(alertPayload.name, "FIRE_ALARM", 31);
//             strncpy(alertPayload.status, "DANGER", 15);
//             xQueueSend(mqttTxQueue, &alertPayload, pdMS_TO_TICKS(10));
//         }
//     }
// }