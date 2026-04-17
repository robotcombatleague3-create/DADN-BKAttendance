-- SETUP: XÓA BẢNG CŨ NẾU ĐÃ TỒN TẠI
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS attendance_logs;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS class_students;
DROP TABLE IF EXISTS classes;
DROP TABLE IF EXISTS rfid_cards;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS lecturers;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- PHẦN 1: DDL - TẠO CẤU TRÚC BẢNG (SCHEMA)
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'lecturer') NOT NULL
);

CREATE TABLE lecturers (
    lecturer_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    department VARCHAR(100),
    specialization VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    student_code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE rfid_cards (
    card_id INT AUTO_INCREMENT PRIMARY KEY,
    rfid_uid VARCHAR(50) UNIQUE NOT NULL,
    user_id INT NULL,
    student_id INT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE SET NULL
);

CREATE TABLE classes (
    class_id INT AUTO_INCREMENT PRIMARY KEY,
    class_name VARCHAR(255) NOT NULL,
    lecturer_id INT NOT NULL,
    FOREIGN KEY (lecturer_id) REFERENCES lecturers(lecturer_id) ON DELETE CASCADE
);

CREATE TABLE class_students (
    class_id INT,
    student_id INT,
    PRIMARY KEY (class_id, student_id),
    FOREIGN KEY (class_id) REFERENCES classes(class_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);

CREATE TABLE sessions (
    session_id INT AUTO_INCREMENT PRIMARY KEY,
    class_id INT NOT NULL,
    session_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    late_threshold TIME NOT NULL,
    FOREIGN KEY (class_id) REFERENCES classes(class_id) ON DELETE CASCADE
);

CREATE TABLE attendance_logs (
    session_id INT,
    student_id INT,
    checkin_time DATETIME NULL,
    status ENUM('Present', 'Absent', 'Late') NOT NULL,
    PRIMARY KEY (session_id, student_id),
    FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);

-- PHẦN 2: DML - CHÈN DỮ LIỆU MẪU (DUMMY DATA)
INSERT INTO users (name, email, password, role) VALUES 
('Phan T', 'admin@hcmut.edu.vn', '123456', 'admin'),
('Trần Thị A', 'gv@hcmut.edu.vn', '123456', 'lecturer');

INSERT INTO lecturers (user_id, department, specialization) VALUES 
(2, 'Khoa học Máy tính', 'Hệ thống thông tin');

INSERT INTO students (student_code, name) VALUES 
('2301001', 'Nguyễn Văn A'),
('2301002', 'Nguyễn Văn AB'),
('2301003', 'Lê Thị A'),
('2301004', 'Trần Bảo B'),
('2301005', 'Phạm Quỳnh C');

INSERT INTO rfid_cards (rfid_uid, user_id, student_id) VALUES 
('A3B4C5D6', NULL, 1),
('B4C5D6E7', NULL, 2),
('C5D6E7F8', NULL, 3),
('D6E7F8G9', NULL, 4),
('E7F8G9H0', NULL, 5);

-- Giả định lecturer_id cho Trần Thị A là 1 sau lệnh insert ở bước 2
INSERT INTO classes (class_name, lecturer_id) VALUES 
('Nguyên lý ngôn ngữ lập trình L01 | H6-301', 1),
('Cơ sở dữ liệu L02 | H1-201', 1);

INSERT INTO class_students (class_id, student_id) VALUES 
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5),
(2, 1), (2, 3), (2, 5);

-- Tạo session cho quá khứ và hôm nay
INSERT INTO sessions (class_id, session_date, start_time, end_time, late_threshold) VALUES 
(1, DATE_SUB(CURDATE(), INTERVAL 7 DAY), '07:00:00', '11:00:00', '07:30:00'),
(1, CURDATE(), '07:00:00', '11:00:00', '07:30:00'),
(2, DATE_SUB(CURDATE(), INTERVAL 3 DAY), '13:00:00', '17:00:00', '13:30:00');

-- Dữ liệu điểm danh mẫu
INSERT INTO attendance_logs (session_id, student_id, checkin_time, status) VALUES 
(1, 1, CONCAT(DATE_SUB(CURDATE(), INTERVAL 7 DAY), ' 06:50:00'), 'Present'),
(1, 2, CONCAT(DATE_SUB(CURDATE(), INTERVAL 7 DAY), ' 07:15:00'), 'Present'),
(1, 3, CONCAT(DATE_SUB(CURDATE(), INTERVAL 7 DAY), ' 07:45:00'), 'Late'),
(1, 4, NULL, 'Absent'),
(1, 5, NULL, 'Absent');

INSERT INTO attendance_logs (session_id, student_id, checkin_time, status) VALUES 
(3, 1, CONCAT(DATE_SUB(CURDATE(), INTERVAL 3 DAY), ' 13:45:00'), 'Late'),
(3, 3, CONCAT(DATE_SUB(CURDATE(), INTERVAL 3 DAY), ' 12:45:00'), 'Present'),
(3, 5, CONCAT(DATE_SUB(CURDATE(), INTERVAL 3 DAY), ' 13:10:00'), 'Present');
