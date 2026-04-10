# DADN-BKAttendance
Đồ án đa ngành HK252 - Hệ thống điểm danh 

# Hệ thống Điểm danh Sinh viên bằng thẻ RFID (Web App)

Dự án này gồm 2 phần độc lập:
- `frontend/`: Giao diện Web (HTML/CSS/JS + Vite)
- `backend/`: Server Node.js/Express phục vụ REST API và WebSocket để kết nối dữ liệu time-real.

## Cấu trúc thư mục

```
/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── css/
│   │   ├── js/
│   │   └── views/
│   ├── index.html
│   ├── students.html
│   ├── history.html
│   └── package.json
├── package.json
└── README.md
```

## Yêu cầu cài đặt
- Cài Node.js mới nhất (>= 18.x)

## Hướng dẫn khởi chạy

### Cài đặt thư viện
Tại thư mục gốc, hãy chạy:
```bash
npm run install:all
```

### Chạy hệ thống
```bash
npm start
```

Điều này sẽ chạy cùng lúc Backend server (Mặc định Port 3000) và Frontend Vite (Mặc định Port 5173). 

Mở trình duyệt tại địa chỉ `http://localhost:5173` để xem ứng dụng.
