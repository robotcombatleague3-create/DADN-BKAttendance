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
      
      const isSuccess = newLog.status === 'Present' || newLog.status === 'Late';
      const msgText = isSuccess 
        ? `✅ Điểm danh: ${newLog.student_name}`
        : `⚠️ Cảnh báo: ${newLog.status}`;
      const msgType = isSuccess ? 'success' : 'error';
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
                <th>MSSV</th>
                <th>Họ tên</th>
                <th>Lớp học</th>
                <th>Thời gian</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr key={`${log.student_id}-${index}`} className={log.isNew ? 'new-row' : ''}>
                  <td><strong>{log.student_code}</strong></td>
                  <td>{log.student_name}</td>
                  <td>{log.class_name}</td>
                  <td>{formatDateTime(log.checkin_time)}</td>
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
