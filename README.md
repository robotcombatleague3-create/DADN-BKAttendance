# DADN-BKAttendance
Đồ án đa ngành HK252 - Hệ thống điểm danh sinh viên bằng thẻ RFID (Web App)

## Giới thiệu
BKAttendance là hệ thống quản lý điểm danh hiện đại, sử dụng công nghệ thẻ RFID kết hợp với giao diện Web tập trung. Dự án được xây dựng với kiến trúc Client-Server, đảm bảo tính real-time và bảo mật theo vai trò người dùng.

## Công nghệ sử dụng
- **Frontend:** React 19, React Router 7, Bootstrap 5 (Styling), Lucide-react (Icons), Recharts (Biểu đồ).
- **Backend:** Node.js, Express, Socket.io (Real-time data).
- **Architecture:** Master-Detail Pattern, Role-based Access Control (RBAC).

## Cấu trúc thư mục (Cập nhật)
```
/
├── backend/                # Node.js Server
│   ├── src/                # Controllers, Models, Routes, Services
│   └── server.js           # Entry point
├── frontend/               # React Application
│   ├── public/             # Assets (Logo, Images)
│   ├── src/
│   │   ├── components/     # UI Components dùng chung
│   │   ├── layouts/        # MainLayout (Topbar navigation)
│   │   ├── pages/          # Auth, Attendance, Profile pages
│   │   ├── css/            # Global styles (Bootstrap + Custom CSS)
│   │   └── App.jsx         # Routing & State management
│   └── package.json
└── README.md
```

## Tài khoản thử nghiệm (Test Accounts)
Hệ thống hiện tại sử dụng dữ liệu giả lập để kiểm thử giao diện & luồng nghiệp vụ:

| Vai trò | Email | Mật khẩu |
| :--- | :--- | :--- |
| **Giảng viên** | `gv@hcmut.edu.vn` | `123456` |
| **Quản trị viên** | `admin@hcmut.edu.vn` | `123456` |

## Quy trình khởi chạy

### 1. Cài đặt thư viện
Tại thư mục gốc, hãy chạy lệnh sau để cài đặt cho cả Frontend và Backend:
```bash
npm run install:all
```

### 2. Chạy hệ thống
```bash
npm start
```
- **Frontend:** `http://localhost:5173` (Vite dev server)
- **Backend:** `http://localhost:3000`

## Các tính năng nổi bật đã hoàn thiện
- [x] **Giao diện Bootstrap 5:** Đồng bộ, hiện đại và hỗ trợ tốt cho di động.
- [x] **Hệ thống Phân quyền:** Tách biệt hoàn toàn luồng nghiệp vụ cho Admin và Giảng viên.
- [x] **Tìm kiếm & Lọc:** Hỗ trợ lọc danh sách sinh viên, giảng viên và lớp học trực tiếp trên Browser.
- [x] **Giả lập RFID:** Tính năng quét thẻ ảo tích hợp trong các Modal chỉnh sửa thông tin.
- [x] **Biểu đồ thống kê:** Trực quan hóa dữ liệu điểm danh bằng Recharts.
