import { useState, useEffect, useContext } from 'react';
import { socket } from '../services/socket';
import { getHistory, formatDateTime, getStatusClass } from '../services/api';
import { FlashContext } from '../App';

export default function Dashboard() {
  const [logs, setLogs] = useState([]);
  const showFlashMessage = useContext(FlashContext);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const history = await getHistory();
        if (isMounted) {
          // Lấy 20 log mới nhất
          let sliced = history.slice(0, 20).map(l => ({ ...l, isNew: false }));
          setLogs(sliced);
        }
      } catch (err) {
        console.error("Lỗi load history", err);
      }
    };
    loadData();

    const handleNewAttendance = (newLog) => {
      setLogs(prev => [{ ...newLog, isNew: true }, ...prev]);
      
      const msgText = newLog.status === 'Hợp lệ' 
        ? `✅ Điểm danh thành công: ${newLog.fullName}`
        : `⚠️ Cảnh báo: ${newLog.status}`;
      const msgType = newLog.status === 'Hợp lệ' ? 'success' : 'error';
      showFlashMessage(msgText, msgType);
    };

    socket.on('new_attendance', handleNewAttendance);
    
    return () => {
      isMounted = false;
      socket.off('new_attendance', handleNewAttendance);
    };
  }, [showFlashMessage]);

  return (
    <>
      <div className="header">
        <h1>Dashboard Điểm danh</h1>
      </div>
      <div className="glass-card">
        <h2 style={{ marginBottom: '1.5rem', color: '#fff' }}>Điểm danh hôm nay (Real-time)</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>MSSV</th>
                <th>Họ tên</th>
                <th>Thời gian</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr key={`${log.id}-${index}`} className={log.isNew ? 'new-row' : ''}>
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
