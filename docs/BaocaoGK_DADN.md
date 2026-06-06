ĐẠI HỌC QUỐC GIA THÀNH PHỐHỒCHÍ MINH TRƯỜNG ĐẠI HỌC BÁCH KHOA **KHOA KHOA HỌC VÀ KĨ THUẬT MÁY TÍNH THỰC TẬP ĐỒÁN MÔN HỌC ĐA NGÀNH (CO3109)** _**“Hệthống điểm danh sinh viên bằng thẻ”**_ **GVHD** : Hoàng Lê Hải Thanh **Nhóm** : TTTV **Lớp** : L04 **Sinh viên thực hiện** : Phan Huy Thịnh 2313305 Thi Minh Thức 2313406 Võ ThịXuân Thuỷ 2313372 Trần Quang Vinh 2313932 Tp. HồChí Minh, ngày 28 tháng 3 năm 2026 ~~o~~ 

`- Trường Đại học Bách Khoa ĐHQG-TP.HCM Khoa Khoa học và Kĩ thuật Máy tính` 

## **Mục lục** 

|**1**|**TỔNG QUAN DỰÁN VÀ **|**TỔNG QUAN DỰÁN VÀ **|**PHẠM VI MVP**||**6**|
|---|---|---|---|---|---|
||1.1|Tóm tắt đềtài . . . . . .|. . . . . . . . . . . . . . . . .|. . . . . . .|6|
||1.2|Phạm vi MVP (Minimum|Viable Product) . . . . . . .|. . . . . . .|6|
||1.3|Tổchức nhóm & Công cụquản lý . . . . . . . . . . . .||. . . . . . .|8|
|**2**|**ĐẶC TẢYÊU CẦU - SRS**||||**9**|
||2.1|Functional Requirements (Yêu cầu chức năng) . . . . .||. . . . . . .|9|
||2.2|Non-functional Requirements (Yêu cầu phi chức năng)||. . . . . . .|11|
||2.3|Danh sách các Use Case|. . . . . . . . . . . . . . . . .|. . . . . . .|12|
||2.4|Use Case Diagram<br>. . .|. . . . . . . . . . . . . . . . .|. . . . . . .|13|
||2.5|Các ràng buộc và giảđịnh (Constraints & Assumptions)||. . . . . .|18|
|**3**|**THIẾT KẾKIẾN TRÚC VÀ DỮLIỆU**||||**19**|
||3.1|Architecture Document (Tài liệu kiến trúc) . . . . . . .||. . . . . . .|19|
||3.2|Deployment Diagram . .|. . . . . . . . . . . . . . . . .|. . . . . . .|23|
||3.3|Component Diagram . .|. . . . . . . . . . . . . . . . .|. . . . . . .|23|
||3.4|Thiết kếdữliệu . . . . .|. . . . . . . . . . . . . . . . .|. . . . . . .|24|
||3.5|Lựa chọn công nghệ. . .|. . . . . . . . . . . . . . . . .|. . . . . . .|25|
|**4**|**THIẾT KẾCHI TIẾT VÀ **||**MÔ HÌNH HÓA**||**25**|
||4.1|Sequence Diagram<br>. . .|. . . . . . . . . . . . . . . . .|. . . . . . .|25|
||4.2|API Specification (Đặc tảAPI) . . . . . . . . . . . . .||. . . . . . .|34|
||4.3|Thiết kếWireframe UI .|. . . . . . . . . . . . . . . . .|. . . . . . .|43|



1 

||cm|Trường Đại học Bách Khoa - ĐHQG-TP.HCM||
|---|---|---|---|
|<3||Khoa Khoa học và Kĩ thuật Máy tính||
||4.4|Áp dụng mẫu thiết kế(Design Patterns) . . . . . . . . . . . . . . .|52|
|**5**|**TIẾN ĐỘVÀ KẾT QUẢDEMO GIỮA KỲ**||**57**|
||5.1|Trạng thái hiện tại của dựán<br>. . . . . . . . . . . . . . . . . . . . .|57|
||5.2|Kết quảDemo . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .|57|
||5.3|Đánh giá rủi ro . . . . . . . . . . . . . . . . . . . . . . . . . . . . .|58|



2 

`- Trường Đại học Bách Khoa ĐHQG-TP.HCM Khoa Khoa học và Kĩ thuật Máy tính` 

## **Danh sách hình ảnh** 

|1|Use Case Diagram - Hệthống điểm danh bằng thẻRFID . . . . . .|Use Case Diagram - Hệthống điểm danh bằng thẻRFID . . . . . .|13|
|---|---|---|---|
|2|Use Case Diagram - Quản lý thông tin người dùng thẻ(Giảng viên|||
||và Sinh viên)<br>. . . . . . . . . . . . . . . . . . . . . . .|. . . . . . .|14|
|3|Use Case Diagram - Quản lý sinh viên<br>. . . . . . . . .|. . . . . . .|14|
|4|Use Case Diagram - Quản lý thẻsinh viên và giảng viên|. . . . . .|15|
|5|Use Case Diagram - Điểm danh bằng thẻ. . . . . . . .|. . . . . . .|15|
|6|Use Case Diagram - Tra cứu lịch sửđiểm danh . . . . .|. . . . . . .|17|
|7|Use Case Diagram - Thống kê . . . . . . . . . . . . . .|. . . . . . .|17|
|8|Sơ đồtriển khai hệthống (Deployment Diagram)<br>. . .|. . . . . . .|23|
|9|Sơ đồthành phần (Component Diagram) . . . . . . . .|. . . . . . .|23|
|10|Sơ đồthực thểmối quan hệ(ERD) . . . . . . . . . . .|. . . . . . .|24|
|11|Sequence Diagram - Đăng nhập . . . . . . . . . . . . .|. . . . . . .|25|
|12|Sequence Diagram - Quản lý thông tin người dùng thẻ|. . . . . . .|26|
|13|Sequence Diagram - Quản lý thẻ. . . . . . . . . . . . .|. . . . . . .|27|
|14|Sequence Diagram - Quản lý sinh viên<br>. . . . . . . . .|. . . . . . .|28|
|15|Sequence Diagram - Điểm danh bằng thẻRFID . . . .|. . . . . . .|29|
|16|Sequence Diagram - Hiển thịdanh sách điểm danh trực|tuyến . . .|30|
|17|Sequence Diagram - Tra cứu lịch sửđiểm danh . . . . .|. . . . . . .|31|
|18|Sequence Diagram - Xem biểu đồthống kê . . . . . . .|. . . . . . .|32|
|19|Sequence Diagram - Xem sốliệu tổng quan . . . . . . .|. . . . . . .|33|
|20|Sequence Diagram - Xuất file báo cáo . . . . . . . . . .|. . . . . . .|34|
|21|Trạng thái chờquét . . . . . . . . . . . . . . . . . . . .|. . . . . . .|43|



3 

`- Trường Đại học Bách Khoa ĐHQG-TP.HCM Khoa Khoa học và Kĩ thuật Máy tính` 

|22|Thông báo điểm danh thành công . . . . . . . . . . . . . . . . . . .|43|
|---|---|---|
|23|Thông báo lỗi thẻhoặc thẻchưa đăng ký . . . . . . . . . . . . . . .|44|
|24|Màn hình chào mừng . . . . . . . . . . . . . . . . . . . . . . . . . .|44|
|25|Lựa chọn vai trò . . . . . . . . . . . . . . . . . . . . . . . . . . . . .|45|
|26|Form đăng nhập . . . . . . . . . . . . . . . . . . . . . . . . . . . . .|45|
|27|Giao diện trang chủDashboard cho Admin . . . . . . . . . . . . . .|46|
|28|Danh sách các lớp học hiện có trên hệthống . . . . . . . . . . . . .|46|
|29|Chi tiết danh sách điểm danh theo từng lớp học . . . . . . . . . . .|47|
|30|Biểu đồthống kê tỷlệchuyên cần giữa các lớp . . . . . . . . . . . .|47|
|31|Danh sách tổng hợp sinh viên . . . . . . . . . . . . . . . . . . . . .|48|
|32|Xem chi tiết hồsơ và lịch sửđiểm danh của sinh viên . . . . . . . .|48|
|33|Chỉnh sửa thông tin sinh viên và cập nhật mã thẻRFID<br>. . . . . .|49|
|34|Trang chủDashboard cho Giảng viên . . . . . . . . . . . . . . . . .|49|
|35|Danh sách các lớp học giảng viên đang phụtrách<br>. . . . . . . . . .|50|
|36|Chi tiết danh sách điểm danh thời gian thực của lớp học . . . . . .|50|
|37|Biểu đồthống kê tỷlệsinh viên chuyên cần<br>. . . . . . . . . . . . .|51|
|38|Xem lịch sửgiảng dạy và thông tin cá nhân của Giảng viên . . . . .|51|
|39|Danh sách sinh viên trong các lớp phụtrách . . . . . . . . . . . . .|52|
|40|Xem chi tiết lịch sửđiểm danh của một sinh viên cụthể<br>. . . . . .|52|



4 

`- Trường Đại học Bách Khoa ĐHQG-TP.HCM Khoa Khoa học và Kĩ thuật Máy tính` 

## **Danh sách bảng** 

|1|Bảng|phân công nhiệm vụthành viên . . . . . . . . . . . . . . . . .|9|
|---|---|---|---|
|2|Bảng|đặc tảUse-case Scenario quan trọng: Điểm danh bằng RFID .|16|



5 

`- Trường Đại học Bách Khoa ĐHQG-TP.HCM Khoa Khoa học và Kĩ thuật Máy tính` 

## **1 TỔNG VÀ VI MVP QUAN DỰÁN PHẠM** 

## **1.1 Tóm tắt đềtài** 

- **Tên đềtài:** Hệthống điểm danh sinh viên bằng thẻRFID. 

- **Thành phần phần cứng:** Vi điều khiển (Arduino / ESP32), Module đọc thẻRFID, ThẻRFID. 

- **Thành phần phần mềm:** Ứng dụng Web quản lý sinh viên và Hệthống Cơ sởdữliệu (Database). 

## **1.2 Phạm vi MVP (Minimum Viable Product)** 

Luồng hoạt động cốt lõi cần đạt được đểdemo: Sinh viên quét thẻRFID -> Thiết bịgửi UID lên Server -> Server lưu thời gian điểm danh -> Giao diện Web hiển thịtrực tiếp danh sách sinh viên đã điểm danh thành công. 

## **1.2.1 Danh sách các chức năng dựkiến** 

Đểđảm bảo tính khảthi cho phiên bản MVP, hệthống sẽtập trung hoàn thiện 5 nhóm chức năng chính sau: 

## **Chức năng 1: Quản lý sinh viên (Admin)** 

- Cho phép Admin thêm mới, chỉnh sửa thông tin và xóa sinh viên. 

- Gán mã UID của thẻRFID cho từng hồsơ sinh viên tương ứng. 

## **Dữliệu mẫu:** 

|**MSSV**|**Họvà Tên**|**RFID UID**|
|---|---|---|
|2312345|Nguyễn Văn A|A3F912D4|



6 

`- Trường Đại học Bách Khoa ĐHQG-TP.HCM Khoa Khoa học và Kĩ thuật Máy tính` 

## **Chức năng 2: Điểm danh bằng RFID** 

- Sinh viên thực hiện thao tác quét thẻtại thiết bịphần cứng. 

- Mạch Arduino/ESP32 đọc mã UID và gửi dữliệu lên Server thông qua API. 

- Server kiểm tra tính hợp lệcủa UID, lưu lại mốc thời gian và cập nhật trạng thái. 

**Dữliệu mẫu lưu trữ:** 

**==> picture [197 x 35] intentionally omitted <==**

## **Chức năng 3: Hiển thịdanh sách điểm danh trực tuyến** 

- Giao diện Web tựđộng cập nhật và hiển thịdanh sách các sinh viên đã thực hiện điểm danh, kèm theo thời gian và trạng thái cụthể. 

**Ví dụgiao diện bảng:** 

|**MSSV**<br>~~———~~|**Tên**<br>~~———~~|**Thời gian**<br>~~———~~|**Trạng thái**<br>~~———~~|
|---|---|---|---|
|2312345<br>~~———~~|Nguyễn Văn A<br>~~———~~|08:03<br>~~———~~|Present<br>~~———~~|
|2312346<br>~~———~~|Trần B<br>~~———~~|-<br>~~———~~|Absent<br>~~———~~|



## **Chức năng 4: Tra cứu lịch sửđiểm danh** 

- Hỗtrợngười dùng xem lại lịch sửđiểm danh trong quá khứ. 

- Cung cấp bộlọc theo ngày tháng và theo lớp học. 

## **Chức năng 5: Thống kê cơ bản (Tính năng mởrộng - Optional)** 

- Hiển thịbiểu đồhoặc sốliệu tổng quan vềsốlượng sinh viên có mặt/vắng mặt trong một buổi học. 

7 

`- Trường Đại học Bách Khoa ĐHQG-TP.HCM Khoa Khoa học và Kĩ thuật Máy tính` 

## **1.2.2 Ánh xạsơ bộvào các module** 

Đểđáp ứng các tiêu chí đánh giá của môn học, các chức năng và kiến trúc của hệ thống trên được thiết kếđểánh xạsơ bộvào các module như sau: 

- **Module 1 - Nhận và hiển thịdữliệu từthiết bị:** Được giải quyết qua **Chức năng 2** (ESP32 đọc mã thẻgửi lên Server) và **Chức năng 3** (Web nhận dữliệu từServer và hiển thịdanh sách). 

- **Module 2 - Kiểm tra dữliệu vượt ngưỡng:** Tích hợp trong logic xửlý điểm danh. Hệthống kiểm tra thời gian quét thẻso với giờvào lớp, nếu vượt quá _ngưỡng thời gian cho phép_ (ví dụ: trễ15 phút), trạng thái sẽtựđộng đổi từ"Có mặt"sang "Đi trễ". Đồng thời xửlý _ngưỡng tần suất_ đểchống spam thẻliên tục. 

- **Module 3 - Điều khiển thiết bị:** Xửlý ởbước cuối của **Chức năng 2** . Khi Web/Server ghi nhận thẻhợp lệ, nó sẽgửi ngược lệnh (Control Command) vềESP32 đểkích hoạt còi Buzzer kêu bíp hoặc làm sáng đèn LED. 

- **Module 4 - Ghi nhận hoạt động:** Hiện thực hóa thông qua **Chức năng 4** . Mọi hoạt động quét thẻđều được lưu log (MSSV, Thời gian, Trạng thái) vào Database MySQL đểphục vụviệc tra cứu lịch sử. 

- **Module 5 - Hiện thực Design Pattern:** 

   - Áp dụng **MVC (Model-View-Controller)** cho cấu trúc tổng thểcủa Web Application và API Server. 

   - Áp dụng **Observer Pattern** cho cơ chếWebSockets/MQTT đểWeb tựđộng cập nhật dữliệu Real-time khi có sinh viên quét thẻmà không cần tải lại trang. 

## **1.3 Tổchức nhóm & Công cụquản lý** 

**Kênh quản lý công việc và tiến độ:** GitHub Projects. 

8 

`- Trường Đại học Bách Khoa ĐHQG-TP.HCM Khoa Khoa học và Kĩ thuật Máy tính` 

## **Bảng phân công vai trò và nhiệm vụ:** 

|**Họvà Tên**|**Vai trò chính**|**Trách nhiệm cụthể**|
|---|---|---|
|Phan Huy Thịnh|Project Manager|Quản lý tiến độ.|
|Thi Minh Thức|||
|Trần Quang Vinh|Hardware<br>/<br>IoT<br>Engineer|Đấu nối mạch ESP32/RFID, lập<br>trình Firmwaregửi/nhận dữliệu.|
|Võ ThịXuân Thuỷ|||



Bảng 1: Bảng phân công nhiệm vụthành viên 

## **2 TẢYÊU CẦU SRS ĐẶC** 

## **2.1 Functional Requirements (Yêu cầu chức năng)** 

## **Admin:** 

- Admin có thểtạo mới, chỉnh sửa và xóa thông tin sinh viên và giảng viên. 

- Admin có thểgán mã UID của thẻRFID cho từng hồsơ sinh viên và giảng viên. 

- Hệthống phải kiểm tra tính hợp lệcủa UID thẻRFID và thông báo lỗi nếu mã UID đã được sửdụng cho người khác. 

- Admin có thểquản lý và phân quyền cho giảng viên, chỉđịnh quyền quản lý sinh viên của họtrong các lớp học. 

- Admin có thểquản lý thông tin thẻRFID của sinh viên và giảng viên (gán, thay đổi, xóa thẻRFID). 

- Admin có thểtheo dõi và tra cứu lịch sửđiểm danh của cảgiảng viên và sinh viên trong các buổi học. 

9 

`- Trường Đại học Bách Khoa ĐHQG-TP.HCM Khoa Khoa học và Kĩ thuật Máy tính` 

- Admin có thểxuất báo cáo điểm danh của sinh viên trong lớp học (định dạng Excel hoặc CSV). 

- Admin có thểlọc dữliệu điểm danh theo ngày, tháng và lớp học. 

- Admin có thểxem biểu đồthống kê vềsựcó mặt và vắng mặt của sinh viên và giảng viên trong các buổi học. 

## **Giảng viên:** 

- Giảng viên có thểquản lý hồsơ cá nhân (tên, bộmôn, email) và thông tin thẻRFID của mình. 

- Giảng viên có thểxem danh sách sinh viên đã điểm danh trong lớp của mình, bao gồm MSSV, tên, thời gian điểm danh và trạng thái (Có mặt/Vắng mặt). 

- Giảng viên có thểtheo dõi và tra cứu lịch sửđiểm danh của các buổi học trước. 

- Giảng viên có thểxuất báo cáo điểm danh của sinh viên trong lớp học (định dạng Excel hoặc CSV). 

- Giảng viên có thểlọc dữliệu điểm danh theo ngày, tháng và lớp học. 

- Giảng viên có thểxem biểu đồthống kê vềsựcó mặt và vắng mặt của sinh viên trong các buổi học. 

## **Sinh viên:** 

- Sinh viên phải có khảnăng quét thẻRFID đểđiểm danh. 

- Hệthống phải lưu lại thời gian điểm danh và trạng thái (Có mặt/Vắng mặt) của sinh viên. 

## **Hệthống Web:** 

10 

`- Trường Đại học Bách Khoa ĐHQG-TP.HCM Khoa Khoa học và Kĩ thuật Máy tính` 

- Giao diện Web phải tựđộng cập nhật và hiển thịdanh sách sinh viên đã điểm danh, kèm theo thời gian và trạng thái cụthể. 

- Giao diện Web cung cấp bộlọc cho phép người dùng tra cứu lịch sửđiểm danh theo ngày tháng và lớp học. 

- Hệthống phải cung cấp biểu đồhoặc sốliệu tổng quan vềsốlượng sinh viên có mặt và vắng mặt trong một buổi học. 

## **Hệthống chung:** 

- Hệthống phải hỗtrợviệc xửlý các yêu cầu từphần cứng (ESP32) và gửi dữliệu UID lên server thông qua API. 

- Hệthống phải lưu trữdữliệu điểm danh của sinh viên (MSSV, thời gian, trạng thái) và có khảnăng xuất báo cáo dưới định dạng Excel hoặc CSV. 

## **2.2 Non-functional Requirements (Yêu cầu phi chức năng)** 

- **Hiệu năng:** Thời gian từlúc sinh viên quét thẻđến khi hệthống cập nhật trạng thái lên giao diện Web (Real-time) không được vượt quá 2 giây để tránh ùn tắc ởcửa lớp. 

- **Tính khảdụng:** Giao diện Web phải hoạt động mượt mà (Responsive) trên cảmàn hình máy tính (Laptop/PC) và thiết bịdi động (Tablet/Smartphone). 

- **Bảo mật:** Các tính năng Quản lý người dùng và Thống kê phải được bảo vệbởi cơ chếxác thực. Chỉtài khoản có Role là Admin hoặc Giảng viên đã đăng nhập thành công mới được phép gọi API lấy dữliệu. Mật khẩu lưu trong DB phải được mã hóa (Hash). 

- **Khảnăng chịu lỗi:** Nếu phần cứng mất kết nối mạng, khi có mạng lại, ESP32 phải có khảnăng tựđộng kết nối lại với Server mà không cần reset thủcông. 

11 

`- Trường Đại học Bách Khoa ĐHQG-TP.HCM Khoa Khoa học và Kĩ thuật Máy tính` 

- **Khảnăng phục hồi:** Backup DB hàng ngày, và restore test tối thiểu 1 lần/tháng đểđảm bảo dữliệu không bịmất trong trường hợp có sựcốhệ thống. 

- **Thời gian lưu trữ:** Lưu lịch sửđiểm danh ít nhất 1 năm, với khảnăng tuỳ chỉnh thời gian lưu trữnếu cần thiết. 

- **Khảnăng mởrộng:** Hệthống phải có khảnăng mởrộng đểhỗtrợsốlượng sinh viên và giảng viên tăng trưởng theo thời gian. 

- **Tính ổn định:** Hệthống phải đảm bảo độổn định cao và có thểvận hành liên tục trong môi trường thực tếmà không xảy ra sựcốgián đoạn. 

## **2.3 Danh sách các Use Case** 

1. Quản lý thông tin sinh viên và giảng viên (Quyền: Admin). 

2. Quản lý thẻsinh viên và giảng viên (Quyền: Admin). 

3. Quản lý sinh viên (Quyền: Giảng viên). 

4. Điểm danh bằng RFID (Use-case quan trọng nhất - Cốt lõi của hệthống). 

5. Hiển thịdanh sách điểm danh trực tuyến. 

6. Tra cứu lịch sửđiểm danh. 

7. Thống kê cơ bản. 

12 

`- Trường Đại học Bách Khoa ĐHQG-TP.HCM` 

`Khoa Khoa học và Kĩ thuật Máy tính` 

## **2.4 Use Case Diagram** 

Hình 1: Use Case Diagram - Hệthống điểm danh bằng thẻRFID 

13 

`- Trường Đại học Bách Khoa ĐHQG-TP.HCM Khoa Khoa học và Kĩ thuật Máy tính` 

Hình 2: Use Case Diagram - Quản lý thông tin người dùng thẻ(Giảng viên và Sinh viên) 

Hình 3: Use Case Diagram - Quản lý sinh viên 

14 

`- Trường Đại học Bách Khoa ĐHQG-TP.HCM Khoa Khoa học và Kĩ thuật Máy tính` 

Hình 4: Use Case Diagram - Quản lý thẻsinh viên và giảng viên 

Hình 5: Use Case Diagram - Điểm danh bằng thẻ 

15 

`- Trường Đại học Bách Khoa ĐHQG-TP.HCM Khoa Khoa học và Kĩ thuật Máy tính` 

|**Thành phần**|**Nội dung chi tiết**|
|---|---|
|**Tên Use-case**|Điểm danh bằng RFID|
|**Tác nhân (Actor)**|Người dùng (Sinh viên, Giảng viên), Máy đọc RFID, Cơ<br>sởdữliệu|
|**Mô tả**|Ghi nhận sựhiện diện của người dùng trong lớp học dựa<br>trên công nghệthẻRFID.|
|**Điều kiện tiên quyết**|ThẻRFID của người dùng đã được đăng ký trong hệ<br>thống. Máyđọc RFID đanghoạt độngvà có kết nối mạng.|
|**Luồng sựkiện chính**|1. Người dùng đưa thẻRFID lại gần máy đọc.<br>2. Máy đọc RFID trích xuất mã UID từthẻ.<br>3. Hệthống gửi mã UID lên Server đểkiểm tra trong cơ<br>sởdữliệu.<br>4. Hệthống xác nhận ID hợp lệvà tính toán trạng thái<br>(Có mặt/Muộn).<br>5. Thiết bịphát tín hiệu phản hồi (đèn xanh và còi bíp).|
|**Hậu điều kiện**|Dữliệu được lưu vào bảng lịch sửvà Dashboard trực tuyến<br>được cập nhật.|
|**Luồng thay thế**|• _Ghi nhận đi muộn:_ Nếu thời gian quét thẻtrễhơn giờ<br>bắt đầu lớp, hệthống vẫn ghi nhận nhưng đánh dấu<br>trạng thái "Muộn".<br>• _Chếđộngoại tuyến:_ Nếu mất kết nối, thiết bịlưu dữ<br>liệu cục bộvà đồng bộsau khi có mạng lại.|
|**Ngoại lệ**|• _Thẻkhông hợp lệ:_ Hệthống báo đèn đỏ, còi kêu kéo dài<br>và không ghi nhận dữliệu.<br>• _Quét trùng (Duplicate):_ Hệthống thông báo "Đã điểm<br>danh"và không tạo bản ghi mới.|



Bảng 2: Bảng đặc tảUse-case Scenario quan trọng: Điểm danh bằng RFID 

16 

`- Trường Đại học Bách Khoa ĐHQG-TP.HCM Khoa Khoa học và Kĩ thuật Máy tính` 

Hình 6: Use Case Diagram - Tra cứu lịch sửđiểm danh 

Hình 7: Use Case Diagram - Thống kê 

17 

`- Trường Đại học Bách Khoa ĐHQG-TP.HCM Khoa Khoa học và Kĩ thuật Máy tính` 

## **2.5 Các ràng buộc và giả định (Constraints & Assumptions)** 

## **2.5.1 Ràng buộc của hệthống (Constraints)** 

- **Ràng buộc nghiệp vụ:** Hệthống bắt buộc phải thểhiện năng lực thiết kếphần mềm có cấu trúc, phân tách lớp rõ ràng và áp dụng Design Pattern thay vì code chắp vá. 

- **Ràng buộc vận hành:** Đây phải là hệthống MVP kết hợp phần cứng và phần mềm có khảnăng demo theo module. Thiết bịđọc thẻ(ESP32) bắt buộc phải có kết nối mạng Internet đểđẩy dữliệu trực tiếp lên Server; hệ thống không hỗtrợlưu trữdữliệu điểm danh offline trên thiết bịnếu mất mạng. 

- **Ràng buộc thời gian đáp ứng:** Thời gian từlúc quẹt thẻđến khi màn hình Web cập nhật trạng thái "Có mặt"không được vượt quá 3 giây. 

## **2.5.2 Giảđịnh (Assumptions)** 

- **Hạtầng:** Tại nơi triển khai hoặc demo, thiết bịESP32 luôn được cấp nguồn điện ổn định (5V) và có kết nối WiFi liên tục không bịgián đoạn. 

- **Môi trường vật lý:** Thao tác quẹt thẻđược thực hiện đúng chuẩn (thẻđặt song song, cách mặt đầu đọc tối đa 3-5cm, không bịvật cản kim loại che khuất). 

- **Quy trình người dùng:** Mỗi sinh viên/giảng viên tựbảo quản thẻcủa mình. Hệthống chỉghi nhận và xác thực mã UID của thẻ, giảđịnh rằng người cầm thẻchính là chủsởhữu (không giải quyết rủi ro quẹt thẻhộở phiên bản MVP này). 

18 

`- Trường Đại học Bách Khoa ĐHQG-TP.HCM Khoa Khoa học và Kĩ thuật Máy tính` 

## **3 THIẾT KẾKIẾN TRÚC VÀ DỮLIỆU** 

## **3.1 Architecture Document (Tài liệu kiến trúc)** 

## **3.1.1 Introduction & Goals (Giới thiệu & Mục tiêu)** 

- **Tên dựán:** Hệthống điểm danh sinh viên bằng thẻRFID. 

- **Mục tiêu chính:** Xây dựng MVP (Minimum Viable Product) cho hệthống điểm danh tựđộng bằng công nghệRFID. Hệthống này giúp giảm thiểu thời gian điểm danh thủcông, cung cấp dữliệu thời gian thực và giao diện thân thiện cho giảng viên và quản trịviên. 

- **Yêu cầu nghiệp vụ:** 

   - Đảm bảo tính chính xác tuyệt đối của thời gian điểm danh. 

   - Tựđộng phân loại trạng thái sinh viên: Có mặt, Vắng mặt hoặc Muộn. 

   - Hiển thịdữliệu trực quan theo thời gian thực qua giao diện web. 

## **3.1.2 Architecture Constraints (Ràng buộc kiến trúc)** 

- **Phần cứng:** Sửdụng vi điều khiển ESP32/Arduino và module đọc thẻRFID RC522. 

- **Cơ sởdữliệu:** MySQL đểlưu trữdữliệu tập trung. 

- **Giao diện web:** React cho phát triển frontend. 

- **Backend:** Node.js hoặc Java xửlý logic Server và API. 

- **Mẫu thiết kế(Design Patterns):** Áp dụng mẫu kiến trúc MVC và mẫu Observer đểxửlý dữliệu thời gian thực. 

19 

`- Trường Đại học Bách Khoa ĐHQG-TP.HCM Khoa Khoa học và Kĩ thuật Máy tính` 

## **3.1.3 System Scope and Context (Phạm vi hệthống và Ngữcảnh)** 

Phần này xác định rõ ranh giới của hệthống, các đối tượng tương tác và phạm vi chức năng thực hiện. 

## **3.1.3.1 Ngữcảnh hệthống và Người dùng (Actors)** 

- **Admin (Quản trịviên):** Quản lý hồsơ sinh viên/giảng viên, thiết lập phân quyền và quản lý vòng đời thẻRFID (gán, thu hồi). 

- **Giảng viên:** Theo dõi danh sách điểm danh real-time, tra cứu lịch sử, xem biểu đồthống kê và xuất báo cáo. 

- **Sinh viên:** Tương tác vật lý bằng cách quét thẻlên thiết bịđọc RFID để ghi nhận hiện diện. 

## **Sơ đồluồng tương tác:** 

- _Luồng thiết bị:_ ThẻSinh viên _→_ Thiết bịRFID _→_ Backend Server _→_ Database. 

- _Luồng phần mềm:_ Admin/Giảng viên _→_ Web Application _→_ Backend Server _→_ Database. 

## **3.1.3.2 Trong phạm vi (In-scope)** 

- Phát triển Firmware cho vi điều khiển đểđọc UID và truyền dữliệu qua API. 

- Xây dựng Backend API xửlý logic điểm danh và kiểm tra tính hợp lệ. 

- Phát triển Web Application Responsive cho Admin và Giảng viên. 

- Quản lý định danh và ánh xạmã UID thẻvới từng cá nhân. 

- Thống kê trực quan và xuất dữliệu báo cáo (CSV/Excel). 

20 

`- Trường Đại học Bách Khoa ĐHQG-TP.HCM Khoa Khoa học và Kĩ thuật Máy tính` 

## **3.1.3.3 Ngoài phạm vi (Out-of-scope)** 

- Không tích hợp trực tiếp với hệthống đào tạo lõi của trường (BKeL, MyBK). 

- Không phát triển ứng dụng di động Native (App Store/Google Play). 

- Không sửdụng công nghệsinh trắc học (vân tay, khuôn mặt) hay GPS. 

- Không quản lý điểm sốmôn học, chỉtập trung vào sựchuyên cần. 

## **3.1.4 Solution Strategy (Chiến lược giải pháp)** 

- **Kiến trúc:** Client-Server, máy chủxửlý logic nghiệp vụtập trung. 

- **Logic backend:** Tựđộng tính toán trạng thái dựa trên thời gian bắt đầu lớp học được cấu hình. 

- **Giao thức truyền thông:** Sửdụng HTTP hoặc MQTT đểđảm bảo kết nối ổn định giữa thiết bịvà server. 

## **3.1.5 Building Block View (Góc nhìn khối xây dựng)** 

- **Block 1: Thiết bịRFID:** Đọc thẻ, gửi mã UID lên Server và phản hồi tín hiệu thành công (tiếng bíp). 

- **Block 2: Backend Server & API:** Xác minh UID, xửlý logic đi muộn và lưu trữvào Database. 

- **Block 3: Web Application:** Giao diện React hiển thịdanh sách và biểu đồthống kê theo thời gian thực. 

## **3.1.6 Runtime View (Góc nhìn luồng thực thi)** 

Quy trình điểm danh diễn ra theo các bước: 

1. Sinh viên quét thẻRFID. 

21 

`- Trường Đại học Bách Khoa ĐHQG-TP.HCM Khoa Khoa học và Kĩ thuật Máy tính` 

   2. Thiết bịgửi mã UID qua HTTP/MQTT Request lên API Server. 

   3. Backend truy vấn Database đểđịnh danh sinh viên. 

   4. Backend so khớp thời gian quét với lịch học đểtính toán trạng thái (Có mặt/Muộn). 

   5. Dữliệu được lưu trữvà Backend thông báo qua WebSocket đểcập nhật giao diện web tức thời. 

   6. Backend gửi lệnh phản hồi vềthiết bịđểphát tín hiệu thông báo cho sinh viên. 

- **3.1.7 Deployment View (Góc nhìn triển khai)** 

   - **Thiết bịRFID:** Gắn cốđịnh tại cửa lớp, kết nối qua mạng Wi-Fi nội bộ. 

   - **Database & API Server:** Triển khai trên máy chủđám mây (VPS) hoặc dịch vụRender/Heroku. 

   - **Web Frontend:** Triển khai trên Vercel hoặc Netlify đểtối ưu tốc độtruy cập. 

**Sơ đồtriển khai:** RFID Device _→_ Internet _→_ Web Server _→_ Database Server. 

22 

`- Trường Đại học Bách Khoa ĐHQG-TP.HCM Khoa Khoa học và Kĩ thuật Máy tính` 

## **3.2 Deployment Diagram** 

Hình 8: Sơ đồtriển khai hệthống (Deployment Diagram) 

## **3.3 Component Diagram** 

Hình 9: Sơ đồthành phần (Component Diagram) 

23 

`- Trường Đại học Bách Khoa ĐHQG-TP.HCM Khoa Khoa học và Kĩ thuật Máy tính` 

## **3.4 Thiết kếdữliệu** 

Hình 10: Sơ đồthực thểmối quan hệ(ERD) 

24 

`- Trường Đại học Bách Khoa ĐHQG-TP.HCM Khoa Khoa học và Kĩ thuật Máy tính` 

## **3.5 Lựa chọn công nghệ** 

## **4 THIẾT KẾCHI TIẾT VÀ MÔ HÌNH HÓA** 

## **4.1 Sequence Diagram** 

Hình 11: Sequence Diagram - Đăng nhập 

25 

`- Trường Đại học Bách Khoa ĐHQG-TP.HCM Khoa Khoa học và Kĩ thuật Máy tính` 

Hình 12: Sequence Diagram - Quản lý thông tin người dùng thẻ 

26 

`- Trường Đại học Bách Khoa ĐHQG-TP.HCM Khoa Khoa học và Kĩ thuật Máy tính` 

Hình 13: Sequence Diagram - Quản lý thẻ 

27 

## `- Trường Đại học Bách Khoa ĐHQG-TP.HCM Khoa Khoa học và Kĩ thuật Máy tính` 

Hình 14: Sequence Diagram - Quản lý sinh viên 

28 

`- Trường Đại học Bách Khoa ĐHQG-TP.HCM Khoa Khoa học và Kĩ thuật Máy tính` 

Hình 15: Sequence Diagram - Điểm danh bằng thẻRFID 

29 

`- Trường Đại học Bách Khoa ĐHQG-TP.HCM Khoa Khoa học và Kĩ thuật Máy tính` 

Hình 16: Sequence Diagram - Hiển thịdanh sách điểm danh trực tuyến 

30 

`- Trường Đại học Bách Khoa ĐHQG-TP.HCM Khoa Khoa học và Kĩ thuật Máy tính` 

Hình 17: Sequence Diagram - Tra cứu lịch sửđiểm danh 

31 

`- Trường Đại học Bách Khoa ĐHQG-TP.HCM Khoa Khoa học và Kĩ thuật Máy tính` 

Hình 18: Sequence Diagram - Xem biểu đồthống kê 

32 

`- Trường Đại học Bách Khoa ĐHQG-TP.HCM Khoa Khoa học và Kĩ thuật Máy tính` 

Hình 19: Sequence Diagram - Xem sốliệu tổng quan 

33 

`- Trường Đại học Bách Khoa ĐHQG-TP.HCM Khoa Khoa học và Kĩ thuật Máy tính` 

Hình 20: Sequence Diagram - Xuất file báo cáo 

## **4.2 API Specification (Đặc tảAPI)** 

## **4.2.1 Introduction** 

Tài liệu này mô tảcác API của hệthống Điểm danh sinh viên bằng thẻRFID, hỗ trợquản lý người dùng, quản lý thẻRFID, thực hiện điểm danh tựđộng và cung cấp các chức năng tra cứu, thống kê. 

Hệthống phục vụ3 nhóm chính: 

- Admin 

34 

`- Trường Đại học Bách Khoa ĐHQG-TP.HCM Khoa Khoa học và Kĩ thuật Máy tính` 

- Giảng viên 

- Thiết bịRFID 

## **4.2.2 Base URL** 

`http://localhost:8080/api` 

## **4.2.3 Authentication** 

Hệthống sửdụng JWT (JSON Web Token). 

## **Header** 

`Authorization: Bearer <token>` 

**Phân quyền** 

|**Role**<br>~~——~~|**Quyền**<br>~~——~~|
|---|---|
|Admin<br>~~——~~|Toàn quyền<br>~~——~~|
|Lecturer<br>~~——~~|Quản lý lớp & điểm danh<br>~~——~~|
|RFID Device<br>~~——~~|Gửi dữliệu check-in<br>~~——~~|



## **4.2.4 API CONVENTIONS** 

|**Thành phần**<br>~~==~~|**Ý nghĩa**<br>~~==~~|
|---|---|
|GET<br>~~==~~|Lấy dữliệu<br>~~==~~|
|POST<br>~~==~~|Tạo mới<br>~~==~~|
|PUT<br>~~==~~|Cập nhật<br>~~==~~|
|DELETE<br>~~==~~|Xóa<br>~~==~~|



**4.2.5 API SPECIFICATION** 

## **1. USER MANAGEMENT (Admin)** 

35 

`- Trường Đại học Bách Khoa ĐHQG-TP.HCM Khoa Khoa học và Kĩ thuật Máy tính` 

## **Create User** 

- **Endpoint** POST /users 

- **Description** Tạo mới tài khoản sinh viên hoặc giảng viên trong hệthống. 

- **Permission** Admin 

- **Request Body** 

`{ "userId": "U001", "name": "Nguyen Van A", "email": "a@gmail.com", "role": "student", "classId": "C01" }` 

- **Response** 

`{ "message": "User created successfully" }` 

- **Business Rules** 

   - userId là duy nhất 

   - Email không trùng 

   - Role chỉgồm: student, lecturer 

## **Get Users** 

- **Endpoint** GET /users 

- **Description** Lấy danh sách toàn bộngười dùng. 

36 

`- Trường Đại học Bách Khoa ĐHQG-TP.HCM Khoa Khoa học và Kĩ thuật Máy tính` 

## **Update User** 

- **Endpoint** PUT /users/{id} 

- **Description** Cập nhật thông tin người dùng. 

## **Delete User** 

- **Endpoint** DELETE /users/{id} 

- **Description** Xoá người dùng khỏi hệthống. 

## **2. RFID MANAGEMENT (Admin)** 

## **Assign RFID** 

- **Endpoint** POST /rfid/assign 

- **Description** Gán thẻRFID cho người dùng. 

- **Request** 

`{ "userId": "U001", "rfidCode": "RFID001" }` 

- **Response** 

`{` 

`"message": "RFID assigned successfully" }` 

## • **Business Rules** 

- RFID phải duy nhất 

- Mỗi user chỉcó 1 RFID 

37 

`- Trường Đại học Bách Khoa ĐHQG-TP.HCM Khoa Khoa học và Kĩ thuật Máy tính` 

## **Update RFID** 

- **Endpoint** PUT /rfid/update 

- **Description** Cập nhật hoặc thay đổi thẻRFID. 

## **3. CLASS MANAGEMENT (Lecturer)** 

## **Get Students in Class** 

- **Endpoint** GET /classes/{classId}/students 

- **Description** Lấy danh sách sinh viên thuộc lớp. 

- **Permission** Lecturer 

- **Response** 

`[` 

`{ "studentId": "S123", "name": "Nguyen Van A" }` 

`]` 

## **4. ATTENDANCE (RFID CORE)** 

## **Check-in via RFID** 

- **Endpoint** POST /attendance/check-in 

- **Description** Ghi nhận điểm danh khi sinh viên quét thẻRFID. Đây là chức năng cốt lõi của hệthống. 

- **Called By** Thiết bịRFID 

38 

`- Trường Đại học Bách Khoa ĐHQG-TP.HCM Khoa Khoa học và Kĩ thuật Máy tính` 

## • **Request** 

`{ "rfidCode": "RFID001", "classId": "C01" }` • **Response** `{ "studentName": "Nguyen Van A", "time": "2026-04-10T08:05:00", "status": "present" }` 

- **Processing Logic** 

1. Xác định user từrfidCode 2. Kiểm tra user có thuộc lớp 3. Kiểm tra thời gian hợp lệ 

4. Kiểm tra trùng điểm danh 

   5. Lưu dữliệu 

- **Error Responses** 

`{ "message": "Invalid RFID" } { "message": "Student not in class" } { "message": "Already checked in" }` 

**5. LIVE ATTENDANCE VIEW** 

39 

`- Trường Đại học Bách Khoa ĐHQG-TP.HCM Khoa Khoa học và Kĩ thuật Máy tính` 

## **Get Live Attendance** 

- **Endpoint** GET /attendance/live 

- **Description** Hiển thịdanh sách sinh viên đã điểm danh theo thời gian thực. 

- **Query Params** ?classId=C01 

- **Response** 

`[ { "studentName": "Nguyen Van A", "time": "08:05", "status": "present" } ]` 

## **6. ATTENDANCE HISTORY** 

## **Get Attendance History** 

- **Endpoint** GET /attendance/history 

- **Description** Tra cứu lịch sửđiểm danh theo điều kiện. 

- **Query Params** ?date=2026-04-10 

?classId=C01 

?studentId=S123 

- **Response** 

`[ { "studentId": "S123",` 

40 

`- Trường Đại học Bách Khoa ĐHQG-TP.HCM Khoa Khoa học và Kĩ thuật Máy tính` 

`"studentName": "Nguyen Van A", "classId": "C01", "time": "2026-04-10T08:05:00", "status": "present" } ]` 

**7. STATISTICS** 

## **Overall Statistics** 

- **Endpoint** GET /stats/attendance 

- **Description** Thống kê tổng quan điểm danh. 

- **Response** 

`{ "totalStudents": 100, "present": 85, "absent": 15, "attendanceRate": 0.85 }` 

## **Class Statistics** 

- **Endpoint** GET /stats/class/{classId} 

- **Description** Thống kê điểm danh theo lớp. 

41 

`- Trường Đại học Bách Khoa ĐHQG-TP.HCM Khoa Khoa học và Kĩ thuật Máy tính` 

## **4.2.6 ERROR HANDLING** 

|**Code**|**Meaning**|
|---|---|
|400|Bad request|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|500|Server Error|



## **4.2.7 CONCLUSION** 

Tài liệu API này bao phủđầy đủcác chức năng chính của hệthống: 

- Quản lý người dùng 

- Quản lý RFID 

- Điểm danh tựđộng (core) 

- Hiển thịrealtime 

- Tra cứu lịch sử 

- Thống kê 

Thiết kếđảm bảo: 

- Phân quyền rõ ràng 

- Dễmởrộng 

- Phù hợp triển khai thực tế 

42 

`- Trường Đại học Bách Khoa ĐHQG-TP.HCM Khoa Khoa học và Kĩ thuật Máy tính` 

## **4.3 Thiết kếWireframe UI** 

## **4.3.1 Giao diện quẹt thẻ** 

Quy trình tương tác vật lý của sinh viên với thiết bịRFID được thểhiện qua các trạng thái phản hồi trực quan trên màn hình. 

Hình 21: Trạng thái chờquét 

Hình 22: Thông báo điểm danh thành công 

43 

`- Trường Đại học Bách Khoa ĐHQG-TP.HCM Khoa Khoa học và Kĩ thuật Máy tính` 

Hình 23: Thông báo lỗi thẻhoặc thẻchưa đăng ký 

## **4.3.2 Giao diện đăng nhập** 

Dưới đây là các màn hình giao diện dành cho quy trình truy cập hệthống của Quản trịviên và Giảng viên. 

Hình 24: Màn hình chào mừng 

44 

`- Trường Đại học Bách Khoa ĐHQG-TP.HCM Khoa Khoa học và Kĩ thuật Máy tính` 

Hình 25: Lựa chọn vai trò 

Hình 26: Form đăng nhập 

## **4.3.3 Giao diện quyền Admin** 

**Giao diện Trang chủvà Quản lý danh sách lớp:** 

45 

`- Trường Đại học Bách Khoa ĐHQG-TP.HCM Khoa Khoa học và Kĩ thuật Máy tính` 

Hình 27: Giao diện trang chủDashboard cho Admin 

Hình 28: Danh sách các lớp học hiện có trên hệthống 

## **Giao diện Theo dõi và Thống kê điểm danh:** 

46 

`- Trường Đại học Bách Khoa ĐHQG-TP.HCM Khoa Khoa học và Kĩ thuật Máy tính` 

Hình 29: Chi tiết danh sách điểm danh theo từng lớp học 

Hình 30: Biểu đồthống kê tỷlệchuyên cần giữa các lớp 

**Giao diện Quản lý Sinh viên:** 

47 

`- Trường Đại học Bách Khoa ĐHQG-TP.HCM Khoa Khoa học và Kĩ thuật Máy tính` 

Hình 31: Danh sách tổng hợp sinh viên 

Hình 32: Xem chi tiết hồsơ và lịch sửđiểm danh của sinh viên 

48 

`- Trường Đại học Bách Khoa ĐHQG-TP.HCM Khoa Khoa học và Kĩ thuật Máy tính` 

Hình 33: Chỉnh sửa thông tin sinh viên và cập nhật mã thẻRFID 

## **4.3.4 Giao diện quyền Giảng viên** 

## **Trang chủvà Quản lý lớp học** 

Hình 34: Trang chủDashboard cho Giảng viên 

49 

`- Trường Đại học Bách Khoa ĐHQG-TP.HCM Khoa Khoa học và Kĩ thuật Máy tính` 

Hình 35: Danh sách các lớp học giảng viên đang phụtrách 

## **Theo dõi và Thống kê điểm danh** 

Hình 36: Chi tiết danh sách điểm danh thời gian thực của lớp học 

50 

`- Trường Đại học Bách Khoa ĐHQG-TP.HCM Khoa Khoa học và Kĩ thuật Máy tính` 

Hình 37: Biểu đồthống kê tỷlệsinh viên chuyên cần 

## **Quản lý thông tin cá nhân và Sinh viên** 

Hình 38: Xem lịch sửgiảng dạy và thông tin cá nhân của Giảng viên 

51 

`- Trường Đại học Bách Khoa ĐHQG-TP.HCM Khoa Khoa học và Kĩ thuật Máy tính` 

Hình 39: Danh sách sinh viên trong các lớp phụtrách 

Hình 40: Xem chi tiết lịch sửđiểm danh của một sinh viên cụthể 

## **4.4 Áp dụng mẫu thiết kế(Design Patterns)** 

Trong quá trình hiện thực hệthống điểm danh sinh viên bằng thẻRFID, nhóm đề xuất và áp dụng bốn mẫu thiết kếchính là **MVC (Model – View – Controller)** , 

52 

`- Trường Đại học Bách Khoa ĐHQG-TP.HCM Khoa Khoa học và Kĩ thuật Máy tính` 

**Observer** , **Strategy** và **Factory** . Các mẫu này không chỉđược nêu tên vềmặt lý thuyết mà còn gắn trực tiếp với các vấn đềcụthểtrong kiến trúc hệthống như tổchức mã nguồn, xửlý nghiệp vụđiểm danh, cập nhật dữliệu theo thời gian thực và khởi tạo các thành phần xửlý phù hợp với từng ngữcảnh. 

## **4.4.1 MVC Pattern** 

**Vấn đềcần giải quyết:** Hệthống có cảgiao diện web cho Admin/Giảng viên, API backend và tầng dữliệu. Nếu toàn bộlogic hiển thị, điều hướng và nghiệp vụ bịtrộn lẫn, hệthống sẽkhó bảo trì, khó mởrộng và khó phân chia công việc giữa frontend và backend. 

## **Cách áp dụng trong kiến trúc:** 

- **Model:** Quản lý dữliệu và nghiệp vụcốt lõi của hệthống, bao gồm các thực thểnhư _Student_ , _Lecturer_ , _Class_ , _RFID Card_ , _Attendance Record_ . Các xửlý như kiểm tra thẻRFID hợp lệ, xác định sinh viên thuộc lớp nào, tính trạng thái điểm danh và lưu lịch sửđiểm danh đều thuộc tầng này. 

- **View:** Là phần giao diện web nơi Admin và Giảng viên theo dõi danh sách sinh viên, lịch sửđiểm danh, thông tin lớp học và các biểu đồthống kê. Các màn hình Dashboard, quản lý lớp, quản lý sinh viên và theo dõi điểm danh trực tuyến thuộc lớp View. 

- **Controller:** Nhận request từgiao diện web hoặc thiết bịRFID, gọi nghiệp vụphù hợp trong Model, sau đó trảkết quảvềcho View hoặc API response. Ví dụ, khi thiết bịgửi UID thẻlên server, controller tiếp nhận request, chuyển cho tầng xửlý điểm danh, rồi trảkết quảthành công hoặc thất bại. 

## **Ý nghĩa áp dụng MVC:** 

- Tách biệt rõ phần giao diện, điều hướng và nghiệp vụ. 

- Giúp nhóm dễphát triển song song giữa frontend và backend. 

- Dễbảo trì, kiểm thửvà mởrộng thêm chức năng vềsau. 

53 

`- Trường Đại học Bách Khoa ĐHQG-TP.HCM Khoa Khoa học và Kĩ thuật Máy tính` 

## **4.4.2 Observer Pattern** 

**Vấn đềcần giải quyết:** Hệthống cần cập nhật điểm danh theo thời gian thực lên giao diện giảng viên hoặc admin. Nếu client liên tục polling lên server thì vừa tốn tài nguyên, vừa tạo độtrễtrong quá trình theo dõi. 

## **Cách áp dụng trong kiến trúc:** 

- **Subject:** Module xửlý điểm danh ởbackend. Khi có bản ghi điểm danh mới được tạo, subject phát ra sựkiện dữliệu đã thay đổi. 

- **Observers:** Các client web đang mởmàn hình theo dõi điểm danh trực tuyến, danh sách sinh viên có mặt hoặc trang thống kê. Các observer này đăng ký lắng nghe thay đổi từbackend thông qua WebSocket hoặc cơ chế realtime tương đương. 

## **Cơ chếhoạt động:** 

1. Sinh viên quét thẻRFID tại thiết bị. 

2. Thiết bịgửi UID thẻlên server. 

3. Backend kiểm tra tính hợp lệvà lưu kết quảđiểm danh. 

4. Sau khi dữliệu thay đổi, backend phát sựkiện cập nhật. 

5. Các giao diện đang subscribe sựkiện sẽnhận dữliệu mới và tựđộng làm mới danh sách điểm danh. 

## **Ý nghĩa áp dụng Observer:** 

- Phù hợp với yêu cầu hiển thịđiểm danh theo thời gian thực. 

- Giảm việc client phải liên tục gửi polling lên server. 

- Tăng tính tương tác và khảnăng giám sát trực tiếp trên giao diện. 

54 

`- Trường Đại học Bách Khoa ĐHQG-TP.HCM Khoa Khoa học và Kĩ thuật Máy tính` 

## **4.4.3 Strategy Pattern** 

**Vấn đềcần giải quyết:** Quy tắc xác định trạng thái điểm danh không cốđịnh ởmột trường hợp duy nhất. Tùy theo môn học, thời điểm quét thẻhoặc quy định của giảng viên, hệthống có thểcần các cách tính khác nhau như _có mặt đúng giờ_ , _đi muộn_ , _vắng_ , hoặc mởrộng thêm các chính sách như cho phép trễtrong một khoảng thời gian nhất định. 

## **Cách áp dụng trong kiến trúc:** 

- Xây dựng một tập các chiến lược xửlý trạng thái điểm danh, ví dụ: _OnTimeStrategy_ , _LateStrategy_ , _AbsentStrategy_ hoặc các chiến lược tính theo từng loại lớp học. 

- Khi backend nhận dữliệu check-in, tầng nghiệp vụsẽchọn strategy phù hợp dựa trên lịch học, thời gian hiện tại và quy tắc áp dụng cho lớp đó. 

- Mỗi strategy chịu trách nhiệm tính toán và trảvềkết quảtrạng thái điểm danh tương ứng, thay vì nhồi toàn bộđiều kiện `if-else` vào một hàm lớn. 

## **Ý nghĩa áp dụng Strategy:** 

- Tách riêng từng luật nghiệp vụđiểm danh đểdễquản lý. 

- Dễmởrộng khi thay đổi quy chếchuyên cần hoặc thêm loại trạng thái mới. 

- Giúp mã nguồn rõ ràng hơn, tránh khối điều kiện phức tạp trong service xử lý điểm danh. 

## **4.4.4 Factory Pattern** 

**Vấn đềcần giải quyết:** Hệthống có nhiều đối tượng hoặc thành phần cần được khởi tạo theo ngữcảnh, chẳng hạn đối tượng xửlý yêu cầu điểm danh, đối tượng phản hồi cho thiết bịRFID, hoặc các strategy tính trạng thái điểm danh. Nếu khởi tạo trực tiếp rải rác trong code, hệthống sẽkhó thống nhất và khó mởrộng. 

55 

`- Trường Đại học Bách Khoa ĐHQG-TP.HCM Khoa Khoa học và Kĩ thuật Máy tính` 

## **Cách áp dụng trong kiến trúc:** 

- Dùng Factory đểtạo ra strategy phù hợp cho từng tình huống điểm danh, ví dụmột _AttendanceStrategyFactory_ chọn chiến lược xửlý theo thời gian và cấu hình lớp học. 

- Có thểdùng Factory đểtạo response gửi vềthiết bịRFID, ví dụphản hồi _success_ , _invalid card_ , _already checked-in_ hoặc _not in class_ . 

- Trong tương lai, nếu hệthống hỗtrợnhiều loại thiết bịRFID hoặc nhiều nguồn dữliệu đầu vào, Factory giúp chọn đúng adapter hoặc handler tương ứng mà không cần sửa nhiều chỗtrong code. 

## **Ý nghĩa áp dụng Factory:** 

- Chuẩn hóa cách khởi tạo các đối tượng nghiệp vụ. 

- Giảm phụthuộc giữa tầng điều khiển và các lớp cài đặt cụthể. 

- Tạo điều kiện thuận lợi đểmởrộng hệthống vềsau. 

## **4.4.5 Tổng kết** 

Việc kết hợp **MVC** , **Observer** , **Strategy** và **Factory** giúp hệthống vừa có cấu trúc rõ ràng, vừa xửlý tốt các yêu cầu nghiệp vụđặc thù của bài toán điểm danh bằng thẻRFID. MVC tổchức kiến trúc theo hướng tách lớp hợp lý; Observer hỗ trợcập nhật realtime; Strategy giải quyết linh hoạt các luật tính trạng thái điểm danh; còn Factory hỗtrợkhởi tạo đúng thành phần xửlý trong từng ngữcảnh. Sựkết hợp này giúp hệthống dễbảo trì, dễmởrộng và phù hợp với định hướng triển khai thực tế. 

56 

`- Trường Đại học Bách Khoa ĐHQG-TP.HCM Khoa Khoa học và Kĩ thuật Máy tính` 

## **5 TIẾN ĐỘVÀ KẾT QUẢDEMO GIỮA KỲ** 

## **5.1 Trạng thái hiện tại của dựán** 

Hiện tại, nhóm đã hoàn thành phần giao tiếp cơ bản giữa thiết bịRFID và server. Hệthống đã có thểđọc thẻ, gửi dữliệu lên server và hiển thịkết quảtrên một giao diện UI đơn giản đểphục vụkiểm thửvà demo chức năng cốt lõi. 

Ởgiai đoạn này, dữliệu vẫn đang được hardcode, bao gồm hashID, tên người dùng và mã thẻởdạng hex. Việc này giúp nhóm tập trung kiểm chứng tính ổn định của luồng giao tiếp giữa thiết bịvà hệthống trước khi tích hợp với cơ sởdữliệu thực tế. 

Ngoài ra, thiết bịđã có phản hồi trực quan bằng đèn báo và còi khi quẹt thẻđúng hoặc sai. Nhìn chung, dựán hiện đã hoàn thành được phần lõi của bản mẫu ban đầu: đọc thẻRFID, gửi dữliệu lên server, hiển thịtrên UI và phản hồi trạng thái ngay tại thiết bị. Đây là nền tảng đểnhóm tiếp tục kết nối cơ sởdữliệu thật và hoàn thiện các chức năng quản lý điểm danh trong giai đoạn tiếp theo. 

## **5.2 Kết quảDemo** 

Nhóm đã thực hiện quay video demo đểminh họa luồng hoạt động hiện tại của hệ thống. Nội dung video thểhiện đầy đủquá trình từlúc người dùng quẹt thẻRFID trên thiết bị, phản hồi tại thiết bị, dữliệu được thiết bịđọc và gửi lên server, cho đến khi kết quảcuối cùng được hiển thịtrên màn hình giao diện. 

Cụthể, video demo cho thấy sau khi thẻđược quét, thiết bịnhận mã thẻvà truyền dữliệu lên backend. Tại phía server, dữliệu đầu vào được tiếp nhận và xửlý theo luồng hiện tại của hệthống. Sau đó, kết quảđược trảvềvà hiển thịtrên UI đơn giản, giúp quan sát trực tiếp thông tin tương ứng với thẻvừa quét. 

Thông qua video này, nhóm chứng minh được rằng luồng giao tiếp chính của hệ thống đã hoạt động thành công, bao gồm: đọc thẻRFID, gửi dữliệu từthiết bị 

57 

`- Trường Đại học Bách Khoa ĐHQG-TP.HCM Khoa Khoa học và Kĩ thuật Máy tính` 

lên server, xửlý dữliệu ởphía backend và hiển thịkết quảtrên màn hình. Đây là cơ sởquan trọng đểtiếp tục hoàn thiện hệthống trong các giai đoạn tiếp theo. 

## **5.3 Đánh giá rủi ro** 

Rủi ro lớn nhất hiện tại là dữliệu vẫn đang được hardcode, nên hệthống chưa phản ánh đầy đủcách vận hành với cơ sởdữliệu thực tế. Khi chuyển sang giai đoạn tích hợp thật, có thểphát sinh sai khác trong việc tra cứu sinh viên, đồng bộthông tin thẻvà lưu lịch sửđiểm danh. 

Bên cạnh đó, hệthống vẫn phụthuộc vào độổn định của kết nối giữa thiết bịvà server. Các sựcốnhư mất kết nối mạng, gửi dữliệu chậm hoặc lỗi giao tiếp có thểảnh hưởng trực tiếp đến quá trình điểm danh. Ngoài ra, giao diện hiện mới ở mức đơn giản đểphục vụdemo nên vẫn cần tiếp tục hoàn thiện đểđáp ứng tốt hơn khi mởrộng hệthống. 

Trong giai đoạn tiếp theo, nhóm sẽưu tiên tích hợp cơ sởdữliệu thật, bổsung cơ chếxửlý lỗi giao tiếp và hoàn thiện giao diện đểgiảm các rủi ro trên. 

58 

