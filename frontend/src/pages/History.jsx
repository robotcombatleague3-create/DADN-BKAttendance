import { useState, useEffect } from 'react';
import { getHistory, formatDateTime, getStatusClass } from '../services/api';

export default function History() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const history = await getHistory();
        if (isMounted) {
          setLogs(history);
        }
      } catch (err) {
        console.error("Lỗi tải lịch sử", err);
      }
    };
    loadData();
    
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <div className="header">
        <h1>Lịch sử toàn bộ</h1>
      </div>

      <div className="glass-card">
        <h2 style={{ marginBottom: '1.5rem', color: '#fff' }}>Nhật ký hệ thống</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Log ID</th>
                <th>MSSV</th>
                <th>Họ tên</th>
                <th>Thời gian</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr key={`${log.id}-${index}`}>
                  <td>{log.id}</td>
                  <td><strong>{log.studentCode}</strong></td>
                  <td>{log.fullName}</td>
                  <td>{formatDateTime(log.timestamp)}</td>
                  <td><span className={`status ${getStatusClass(log.status)}`}>{log.status}</span></td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>Không có dữ liệu</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
