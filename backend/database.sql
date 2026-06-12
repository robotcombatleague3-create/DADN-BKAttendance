-- SETUP: XÓA THỦ TỤC VÀ BẢNG CŨ NẾU ĐÃ TỒN TẠI
SET NAMES utf8mb4;
DROP PROCEDURE IF EXISTS sp_delete_lecturer;
DROP PROCEDURE IF EXISTS sp_update_lecturer;
DROP PROCEDURE IF EXISTS sp_add_lecturer;
DROP PROCEDURE IF EXISTS sp_delete_student;
DROP PROCEDURE IF EXISTS sp_update_student;
DROP PROCEDURE IF EXISTS sp_add_student;
DROP PROCEDURE IF EXISTS sp_lecturer_delete;
DROP PROCEDURE IF EXISTS sp_lecturer_update;
DROP PROCEDURE IF EXISTS sp_lecturer_insert;
DROP PROCEDURE IF EXISTS sp_student_delete;
DROP PROCEDURE IF EXISTS sp_student_update;
DROP PROCEDURE IF EXISTS sp_student_insert;
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

-- PHẦN 1.5: STORED PROCEDURES - THÊM / SỬA / XÓA SINH VIÊN & GIẢNG VIÊN
DELIMITER $$

CREATE PROCEDURE sp_add_student(
    IN p_student_code VARCHAR(20),
    IN p_name VARCHAR(100),
    IN p_rfid_uid VARCHAR(50),
    IN p_class_id INT
)
BEGIN
    DECLARE v_student_id INT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    IF p_student_code IS NULL OR TRIM(p_student_code) = '' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Mã sinh viên không được để trống';
    END IF;

    IF p_name IS NULL OR TRIM(p_name) = '' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Tên sinh viên không được để trống';
    END IF;

    IF EXISTS (SELECT 1 FROM students WHERE student_code = p_student_code) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Mã sinh viên đã tồn tại';
    END IF;

    START TRANSACTION;

    INSERT INTO students (student_code, name)
    VALUES (TRIM(p_student_code), TRIM(p_name));
    SET v_student_id = LAST_INSERT_ID();

    IF p_rfid_uid IS NOT NULL AND TRIM(p_rfid_uid) != '' THEN
        IF EXISTS (SELECT 1 FROM rfid_cards WHERE rfid_uid = UPPER(TRIM(p_rfid_uid))) THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Mã RFID đã được sử dụng';
        END IF;
        INSERT INTO rfid_cards (rfid_uid, student_id)
        VALUES (UPPER(TRIM(p_rfid_uid)), v_student_id);
    END IF;

    IF p_class_id IS NOT NULL THEN
        IF NOT EXISTS (SELECT 1 FROM classes WHERE class_id = p_class_id) THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lớp học không tồn tại';
        END IF;
        INSERT IGNORE INTO class_students (class_id, student_id)
        VALUES (p_class_id, v_student_id);
    END IF;

    COMMIT;
    SELECT v_student_id AS student_id;
END$$

CREATE PROCEDURE sp_update_student(
    IN p_student_id INT,
    IN p_student_code VARCHAR(20),
    IN p_name VARCHAR(100),
    IN p_rfid_uid VARCHAR(50)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    IF NOT EXISTS (SELECT 1 FROM students WHERE student_id = p_student_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Không tìm thấy sinh viên';
    END IF;

    START TRANSACTION;

    IF p_student_code IS NOT NULL AND TRIM(p_student_code) != '' THEN
        IF EXISTS (
            SELECT 1 FROM students
            WHERE student_code = TRIM(p_student_code) AND student_id != p_student_id
        ) THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Mã sinh viên đã tồn tại';
        END IF;
        UPDATE students SET student_code = TRIM(p_student_code) WHERE student_id = p_student_id;
    END IF;

    IF p_name IS NOT NULL AND TRIM(p_name) != '' THEN
        UPDATE students SET name = TRIM(p_name) WHERE student_id = p_student_id;
    END IF;

    IF p_rfid_uid IS NOT NULL THEN
        IF TRIM(p_rfid_uid) = '' THEN
            DELETE FROM rfid_cards WHERE student_id = p_student_id;
        ELSE
            IF EXISTS (
                SELECT 1 FROM rfid_cards
                WHERE rfid_uid = UPPER(TRIM(p_rfid_uid)) AND student_id != p_student_id
            ) THEN
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Mã RFID đã được sử dụng';
            END IF;
            DELETE FROM rfid_cards WHERE student_id = p_student_id;
            INSERT INTO rfid_cards (rfid_uid, student_id)
            VALUES (UPPER(TRIM(p_rfid_uid)), p_student_id)
            ON DUPLICATE KEY UPDATE student_id = p_student_id;
        END IF;
    END IF;

    COMMIT;
END$$

CREATE PROCEDURE sp_delete_student(
    IN p_student_id INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    IF NOT EXISTS (SELECT 1 FROM students WHERE student_id = p_student_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Không tìm thấy sinh viên';
    END IF;

    START TRANSACTION;
    DELETE FROM rfid_cards WHERE student_id = p_student_id;
    DELETE FROM students WHERE student_id = p_student_id;
    COMMIT;
END$$

CREATE PROCEDURE sp_add_lecturer(
    IN p_name VARCHAR(100),
    IN p_email VARCHAR(100),
    IN p_password VARCHAR(255),
    IN p_department VARCHAR(100),
    IN p_specialization VARCHAR(100),
    IN p_rfid_uid VARCHAR(50)
)
BEGIN
    DECLARE v_user_id INT;
    DECLARE v_lecturer_id INT;
    DECLARE v_password VARCHAR(255);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    IF p_name IS NULL OR TRIM(p_name) = '' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Tên giảng viên không được để trống';
    END IF;

    IF p_email IS NULL OR TRIM(p_email) = '' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Email không được để trống';
    END IF;

    IF EXISTS (SELECT 1 FROM users WHERE email = TRIM(p_email)) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Email đã tồn tại';
    END IF;

    SET v_password = IFNULL(NULLIF(TRIM(p_password), ''), '123456');

    START TRANSACTION;

    INSERT INTO users (name, email, password, role)
    VALUES (TRIM(p_name), TRIM(p_email), v_password, 'lecturer');
    SET v_user_id = LAST_INSERT_ID();

    INSERT INTO lecturers (user_id, department, specialization)
    VALUES (v_user_id, NULLIF(TRIM(p_department), ''), NULLIF(TRIM(p_specialization), ''));
    SET v_lecturer_id = LAST_INSERT_ID();

    IF p_rfid_uid IS NOT NULL AND TRIM(p_rfid_uid) != '' THEN
        IF EXISTS (SELECT 1 FROM rfid_cards WHERE rfid_uid = UPPER(TRIM(p_rfid_uid))) THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Mã RFID đã được sử dụng';
        END IF;
        INSERT INTO rfid_cards (rfid_uid, user_id)
        VALUES (UPPER(TRIM(p_rfid_uid)), v_user_id);
    END IF;

    COMMIT;
    SELECT v_user_id AS user_id, v_lecturer_id AS lecturer_id;
END$$

CREATE PROCEDURE sp_update_lecturer(
    IN p_user_id INT,
    IN p_name VARCHAR(100),
    IN p_email VARCHAR(100),
    IN p_department VARCHAR(100),
    IN p_specialization VARCHAR(100),
    IN p_rfid_uid VARCHAR(50)
)
BEGIN
    DECLARE v_lecturer_id INT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    SELECT lecturer_id INTO v_lecturer_id
    FROM lecturers WHERE user_id = p_user_id;

    IF v_lecturer_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Không tìm thấy giảng viên';
    END IF;

    START TRANSACTION;

    IF p_name IS NOT NULL AND TRIM(p_name) != '' THEN
        UPDATE users SET name = TRIM(p_name) WHERE user_id = p_user_id;
    END IF;

    IF p_email IS NOT NULL AND TRIM(p_email) != '' THEN
        IF EXISTS (
            SELECT 1 FROM users
            WHERE email = TRIM(p_email) AND user_id != p_user_id
        ) THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Email đã tồn tại';
        END IF;
        UPDATE users SET email = TRIM(p_email) WHERE user_id = p_user_id;
    END IF;

    IF p_department IS NOT NULL OR p_specialization IS NOT NULL THEN
        UPDATE lecturers
        SET
            department = IF(p_department IS NOT NULL, NULLIF(TRIM(p_department), ''), department),
            specialization = IF(p_specialization IS NOT NULL, NULLIF(TRIM(p_specialization), ''), specialization)
        WHERE lecturer_id = v_lecturer_id;
    END IF;

    IF p_rfid_uid IS NOT NULL THEN
        IF TRIM(p_rfid_uid) = '' THEN
            DELETE FROM rfid_cards WHERE user_id = p_user_id;
        ELSE
            IF EXISTS (
                SELECT 1 FROM rfid_cards
                WHERE rfid_uid = UPPER(TRIM(p_rfid_uid)) AND user_id != p_user_id
            ) THEN
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Mã RFID đã được sử dụng';
            END IF;
            DELETE FROM rfid_cards WHERE user_id = p_user_id;
            INSERT INTO rfid_cards (rfid_uid, user_id)
            VALUES (UPPER(TRIM(p_rfid_uid)), p_user_id)
            ON DUPLICATE KEY UPDATE user_id = p_user_id;
        END IF;
    END IF;

    COMMIT;
END$$

CREATE PROCEDURE sp_delete_lecturer(
    IN p_lecturer_id INT
)
BEGIN
    DECLARE v_user_id INT;
    DECLARE v_class_count INT DEFAULT 0;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    SELECT user_id INTO v_user_id
    FROM lecturers WHERE lecturer_id = p_lecturer_id;

    IF v_user_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Không tìm thấy giảng viên';
    END IF;

    SELECT COUNT(*) INTO v_class_count
    FROM classes WHERE lecturer_id = p_lecturer_id;

    IF v_class_count > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Không thể xóa: giảng viên đang phụ trách lớp học';
    END IF;

    START TRANSACTION;
    DELETE FROM rfid_cards WHERE user_id = v_user_id;
    DELETE FROM users WHERE user_id = v_user_id;
    COMMIT;
END$$

DELIMITER ;

-- PHẦN 2: DML - CHÈN DỮ LIỆU MẪU (DUMMY DATA)
INSERT INTO users (name, email, password, role) VALUES 
('Phan T', 'admin@hcmut.edu.vn', '123456', 'admin'),
('Trần Thị A', 'gv@hcmut.edu.vn', '123456', 'lecturer');

INSERT INTO lecturers (user_id, department, specialization) VALUES 
(2, 'Khoa học Máy tính', 'Hệ thống thông tin');

-- CHÈN ĐÚNG 50 SINH VIÊN
INSERT INTO students (student_code, name) VALUES 
('2301001', 'Nguyễn Văn A'), ('2301002', 'Nguyễn Văn AB'), ('2301003', 'Lê Thị A'),
('2301004', 'Trần Bảo B'), ('2301005', 'Phạm Quỳnh C'), ('2310000', 'Võ Thị Xuân Thủy'),
('2310001', 'Thi Minh Thức'), ('2310002', 'Huy Thịnh'), ('2310003', 'Trần Quang Vinh'),
('2310010', 'Bùi Văn Tiến'), ('2310011', 'Đinh Tuấn Anh'), ('2310012', 'Vũ Đức Mạnh'),
('2310013', 'Hoàng Thu Trang'), ('2310014', 'Phan Khắc Hiếu'), ('2310015', 'Lý Hải Nam'),
('2310016', 'Đỗ Minh Trí'), ('2310017', 'Ngô Thanh Hà'), ('2310018', 'Đào Trung Kiên'),
('2310019', 'Trịnh Xuân Thanh'), ('2310020', 'Lâm Tấn Phát'), ('2310021', 'Vương Đình Huệ'),
('2310022', 'Dương Hoàng Yến'), ('2310023', 'Hồ Tấn Tài'), ('2310024', 'Mạc Đăng Khoa'),
('2310025', 'Chu Bỉnh Nguyên'), ('2310026', 'Tạ Bích Loan'), ('2310027', 'Quách Tỉnh'),
('2310028', 'Kiều Phong'), ('2310029', 'Đoàn Dự'), ('2310030', 'Hư Trúc'),
('2310031', 'Sinh Viên 31'), ('2310032', 'Sinh Viên 32'), ('2310033', 'Sinh Viên 33'),
('2310034', 'Sinh Viên 34'), ('2310035', 'Sinh Viên 35'), ('2310036', 'Sinh Viên 36'),
('2310037', 'Sinh Viên 37'), ('2310038', 'Sinh Viên 38'), ('2310039', 'Sinh Viên 39'),
('2310040', 'Sinh Viên 40'), ('2310041', 'Sinh Viên 41'), ('2310042', 'Sinh Viên 42'),
('2310043', 'Sinh Viên 43'), ('2310044', 'Sinh Viên 44'), ('2310045', 'Sinh Viên 45'),
('2310046', 'Sinh Viên 46'), ('2310047', 'Sinh Viên 47'), ('2310048', 'Sinh Viên 48'),
('2310049', 'Sinh Viên 49'), ('2310050', 'Sinh Viên 50');

-- CHÈN 50 THẺ RFID CHO TƯƠNG ỨNG 50 SINH VIÊN
INSERT INTO rfid_cards (rfid_uid, user_id, student_id) VALUES 
('A3B4C5D6', NULL, 1), ('B4C5D6E7', NULL, 2), ('C5D6E7F8', NULL, 3),
('D6E7F8G9', NULL, 4), ('E7F8G9H0', NULL, 5), ('EA68F834', NULL, 6),
('3297ABC2', NULL, 7), ('82AB379F', NULL, 8), ('B52A1012', NULL, 9),
('F1A2B3C4', NULL, 10), ('1A2B3C4D', NULL, 11), ('2B3C4D5E', NULL, 12),
('3C4D5E6F', NULL, 13), ('4D5E6F7A', NULL, 14), ('5E6F7A8B', NULL, 15),
('6F7A8B9C', NULL, 16), ('7A8B9C0D', NULL, 17), ('8B9C0D1E', NULL, 18),
('9C0D1E2F', NULL, 19), ('0D1E2F3A', NULL, 20), ('1E2F3A4B', NULL, 21),
('2F3A4B5C', NULL, 22), ('3A4B5C6D', NULL, 23), ('4B5C6D7E', NULL, 24),
('5C6D7E8F', NULL, 25), ('6D7E8F9A', NULL, 26), ('7E8F9A0B', NULL, 27),
('8F9A0B1C', NULL, 28), ('9A0B1C2D', NULL, 29), ('A0B1C2D3', NULL, 30),
('C1D2E3F4', NULL, 31), ('D2E3F4G5', NULL, 32), ('E3F4G5H6', NULL, 33),
('F4G5H6I7', NULL, 34), ('G5H6I7J8', NULL, 35), ('H6I7J8K9', NULL, 36),
('I7J8K9L0', NULL, 37), ('J8K9L0M1', NULL, 38), ('K9L0M1N2', NULL, 39),
('L0M1N2O3', NULL, 40), ('M1N2O3P4', NULL, 41), ('N2O3P4Q5', NULL, 42),
('O3P4Q5R6', NULL, 43), ('P4Q5R6S7', NULL, 44), ('Q5R6S7T8', NULL, 45),
('R6S7T8U9', NULL, 46), ('S7T8U9V0', NULL, 47), ('T8U9V0W1', NULL, 48),
('U9V0W1X2', NULL, 49), ('V0W1X2Y3', NULL, 50);

-- CHÈN 5 LỚP HỌC (Thuộc GV: Trần Thị A)
INSERT INTO classes (class_name, lecturer_id) VALUES 
('Nguyên lý ngôn ngữ lập trình L01 | H6-301', 1),
('Cơ sở dữ liệu L02 | H1-201', 1),
('Kiến trúc máy tính L03 | H2-101', 1),
('Hệ điều hành L04 | H3-301', 1),
('Công nghệ phần mềm L05 | H6-402', 1);

-- CHÈN MỖI LỚP 20 SINH VIÊN (Tổng 100 records)
INSERT INTO class_students (class_id, student_id) VALUES 
-- Lớp 1 (SV 1 đến 20)
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8), (1, 9), (1, 10),
(1, 11), (1, 12), (1, 13), (1, 14), (1, 15), (1, 16), (1, 17), (1, 18), (1, 19), (1, 20),
-- Lớp 2 (SV 21 đến 40)
(2, 21), (2, 22), (2, 23), (2, 24), (2, 25), (2, 26), (2, 27), (2, 28), (2, 29), (2, 30),
(2, 31), (2, 32), (2, 33), (2, 34), (2, 35), (2, 36), (2, 37), (2, 38), (2, 39), (2, 40),
-- Lớp 3 (SV 41 đến 50 và 1 đến 10)
(3, 41), (3, 42), (3, 43), (3, 44), (3, 45), (3, 46), (3, 47), (3, 48), (3, 49), (3, 50),
(3, 1), (3, 2), (3, 3), (3, 4), (3, 5), (3, 6), (3, 7), (3, 8), (3, 9), (3, 10),
-- Lớp 4 (SV 11 đến 30)
(4, 11), (4, 12), (4, 13), (4, 14), (4, 15), (4, 16), (4, 17), (4, 18), (4, 19), (4, 20),
(4, 21), (4, 22), (4, 23), (4, 24), (4, 25), (4, 26), (4, 27), (4, 28), (4, 29), (4, 30),
-- Lớp 5 (SV 31 đến 50)
(5, 31), (5, 32), (5, 33), (5, 34), (5, 35), (5, 36), (5, 37), (5, 38), (5, 39), (5, 40),
(5, 41), (5, 42), (5, 43), (5, 44), (5, 45), (5, 46), (5, 47), (5, 48), (5, 49), (5, 50);

-- CHÈN 10 BUỔI HỌC (SESSIONS)
INSERT INTO sessions (class_id, session_date, start_time, end_time, late_threshold) VALUES 
(1, DATE_SUB(CURDATE(), INTERVAL 7 DAY), '07:00:00', '11:00:00', '07:30:00'),
(1, CURDATE(), '07:00:00', '11:00:00', '07:30:00'),
(2, DATE_SUB(CURDATE(), INTERVAL 3 DAY), '13:00:00', '17:00:00', '13:30:00'),
(2, CURDATE(), '13:00:00', '17:00:00', '13:30:00'),
(3, DATE_SUB(CURDATE(), INTERVAL 5 DAY), '07:00:00', '11:00:00', '07:30:00'),
(3, DATE_SUB(CURDATE(), INTERVAL 1 DAY), '07:00:00', '11:00:00', '07:30:00'),
(4, DATE_SUB(CURDATE(), INTERVAL 4 DAY), '13:00:00', '17:00:00', '13:30:00'),
(4, CURDATE(), '13:00:00', '17:00:00', '13:30:00'),
(5, DATE_SUB(CURDATE(), INTERVAL 6 DAY), '09:00:00', '11:50:00', '09:30:00'),
(5, CURDATE(), '09:00:00', '11:50:00', '09:30:00');

-- CHÈN DỮ LIỆU ĐIỂM DANH MẪU
-- Session 1 (Lớp 1 - Tuần trước)
INSERT INTO attendance_logs (session_id, student_id, checkin_time, status) VALUES 
(1, 1, CONCAT(DATE_SUB(CURDATE(), INTERVAL 7 DAY), ' 06:50:00'), 'Present'),
(1, 2, CONCAT(DATE_SUB(CURDATE(), INTERVAL 7 DAY), ' 07:15:00'), 'Present'),
(1, 3, CONCAT(DATE_SUB(CURDATE(), INTERVAL 7 DAY), ' 07:45:00'), 'Late'),
(1, 4, NULL, 'Absent'),
(1, 6, CONCAT(DATE_SUB(CURDATE(), INTERVAL 7 DAY), ' 06:55:00'), 'Present'),
(1, 8, CONCAT(DATE_SUB(CURDATE(), INTERVAL 7 DAY), ' 07:35:00'), 'Late');

-- Session 2 (Lớp 1 - Hôm nay)
INSERT INTO attendance_logs (session_id, student_id, checkin_time, status) VALUES 
(2, 1, CONCAT(CURDATE(), ' 06:55:00'), 'Present'),
(2, 2, CONCAT(CURDATE(), ' 07:05:00'), 'Present'),
(2, 4, CONCAT(CURDATE(), ' 07:40:00'), 'Late'),
(2, 5, NULL, 'Absent'),
(2, 7, CONCAT(CURDATE(), ' 06:50:00'), 'Present'),
(2, 9, CONCAT(CURDATE(), ' 07:10:00'), 'Present');

-- Session 3 (Lớp 2 - 3 ngày trước)
INSERT INTO attendance_logs (session_id, student_id, checkin_time, status) VALUES 
(3, 11, CONCAT(DATE_SUB(CURDATE(), INTERVAL 3 DAY), ' 12:45:00'), 'Present'),
(3, 12, CONCAT(DATE_SUB(CURDATE(), INTERVAL 3 DAY), ' 13:45:00'), 'Late'),
(3, 13, CONCAT(DATE_SUB(CURDATE(), INTERVAL 3 DAY), ' 12:55:00'), 'Present'),
(3, 14, NULL, 'Absent');

-- Session 7 (Lớp 4 - 4 ngày trước)
INSERT INTO attendance_logs (session_id, student_id, checkin_time, status) VALUES 
(7, 1, CONCAT(DATE_SUB(CURDATE(), INTERVAL 4 DAY), ' 12:50:00'), 'Present'),
(7, 3, CONCAT(DATE_SUB(CURDATE(), INTERVAL 4 DAY), ' 13:40:00'), 'Late'),
(7, 5, NULL, 'Absent'),
(7, 7, CONCAT(DATE_SUB(CURDATE(), INTERVAL 4 DAY), ' 12:45:00'), 'Present');

-- Session 10 (Lớp 5 - Hôm nay)
INSERT INTO attendance_logs (session_id, student_id, checkin_time, status) VALUES 
(10, 2, CONCAT(CURDATE(), ' 08:50:00'), 'Present'),
(10, 4, CONCAT(CURDATE(), ' 09:40:00'), 'Late'),
(10, 6, NULL, 'Absent'),
(10, 8, CONCAT(CURDATE(), ' 08:45:00'), 'Present'),
(10, 10, CONCAT(CURDATE(), ' 08:55:00'), 'Present');