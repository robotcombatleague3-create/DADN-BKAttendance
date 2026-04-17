import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const TestRFID = () => {
    const [uid, setUid] = useState('');
    const [resultData, setResultData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [mqttLogs, setMqttLogs] = useState([]);

    useEffect(() => {
        // Connect to Socket.io server
        const socket = io('http://localhost:3000');

        socket.on('new_data', (data) => {
            // data format: { raw, formatted, uid, timestamp }
            setMqttLogs((prev) => [data, ...prev].slice(0, 5));
            
            if (data.uid) {
                // Auto trigger scan if UID is present
                processScan(data.uid);
            }
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const processScan = async (rfidUid) => {
        if (!rfidUid || !rfidUid.trim()) {
            setError('Mã UID không hợp lệ!');
            return;
        }

        setUid(rfidUid);
        setLoading(true);
        setError(null);
        setResultData(null);

        try {
            const response = await fetch('http://localhost:3000/api/attendance/scan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rfid_uid: rfidUid }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setResultData(data.data);
                setError(null);
            } else {
                setError(data.message || 'Thẻ không tồn tại hoặc lỗi hệ thống.');
                setResultData(null);
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setError('Không thể kết nối đến Server. Vui lòng kiểm tra Backend!');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        processScan(uid);
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4 text-center">Trang Kiểm Thử Luồng Quét Thẻ RFID</h2>
            
            <div className="row">
                {/* Cột trái: MQTT Logs */}
                <div className="col-md-5">
                    <div className="card shadow-sm border-info mb-4">
                        <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">MQTT Live Logs</h5>
                            <span className="badge bg-light text-info pulse">Real-time</span>
                        </div>
                        <div className="card-body p-0" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            {mqttLogs.length === 0 ? (
                                <div className="p-4 text-center text-muted">
                                    <p className="mb-0 italic small">Đang chờ tín hiệu từ HiveMQ (topic: test/vinh/mqtt)...</p>
                                </div>
                            ) : (
                                <div className="list-group list-group-flush">
                                    {mqttLogs.map((log, index) => (
                                        <div key={index} className={`list-group-item list-group-item-action ${index === 0 ? 'bg-light' : ''}`}>
                                            <div className="d-flex w-100 justify-content-between">
                                                <small className="text-primary fw-bold">{log.uid ? 'SCAN DETECTED' : 'SYSTEM MSG'}</small>
                                                <small className="text-muted">{log.timestamp}</small>
                                            </div>
                                            <p className="mb-1 font-monospace small" style={{ wordBreak: 'break-all' }}>
                                                {log.formatted}
                                            </p>
                                            {log.uid && (
                                                <small className="text-success fw-bold">Converted UID: {log.uid}</small>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Cột phải: Form giả lập và Kết quả */}
                <div className="col-md-7">
                    {/* Phần 1: Form giả lập */}
                    <div className="card shadow-sm mb-4">
                        <div className="card-header bg-primary text-white">
                            <h5 className="mb-0">Giả lập tín hiệu thủ công</h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="uidInput" className="form-label">Mã UID thẻ (Ví dụ: A3B4C5D6)</label>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="uidInput"
                                            value={uid}
                                            onChange={(e) => setUid(e.target.value)}
                                            placeholder="Nhập UID thẻ..."
                                        />
                                        <button 
                                            type="submit" 
                                            className="btn btn-primary"
                                            disabled={loading}
                                        >
                                            {loading ? '...' : 'Gửi'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Phần 2: Khu vực hiển thị kết quả */}
                    <div className="card shadow-sm">
                        <div className="card-header bg-light">
                            <h5 className="mb-0">Kết quả truy vấn (Result Area)</h5>
                        </div>
                        <div className="card-body" style={{ minHeight: '200px' }}>
                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                    {error.includes("thẻ không tồn tại") ? "Thẻ không lệ hoặc chưa được đăng ký!" : error}
                                </div>
                            )}

                            {resultData && (
                                <div className="p-3 border rounded border-success bg-light">
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="bg-success text-white rounded-circle p-2 me-3 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                            <i className="bi bi-check-lg fs-4"></i>
                                        </div>
                                        <h5 className="text-success mb-0">Điểm danh thành công!</h5>
                                    </div>
                                    <div className="ms-5">
                                        <p className="mb-2"><strong>Họ tên:</strong> {resultData.name}</p>
                                        <p className="mb-2"><strong>MSSV:</strong> {resultData.student_code}</p>
                                        <p className="mb-0 text-muted"><strong>Thời gian:</strong> {resultData.time}</p>
                                    </div>
                                </div>
                            )}

                            {!resultData && !error && (
                                <div className="text-center text-muted mt-5">
                                    <i className="bi bi-rfid fs-1 d-block mb-3"></i>
                                    <p>Đang chờ quét thẻ từ MQTT hoặc nhập thủ công...</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-4 text-center">
                        <a href="/lecturer/home" className="btn btn-outline-secondary">
                            <i className="bi bi-arrow-left me-1"></i> Quay lại Dashboard
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestRFID;

