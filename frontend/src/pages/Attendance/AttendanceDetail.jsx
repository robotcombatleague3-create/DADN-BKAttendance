import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Users, CheckCircle, XCircle, Download, BarChart2, ChevronDown } from 'lucide-react';
import { io } from 'socket.io-client';
import './Attendance.css';

export default function AttendanceDetail() {
  const navigate = useNavigate();
  const { classId } = useParams();
  const location = useLocation();
  const basePath = location.pathname.match(/^\/[^/]+/)?.[0] || '';

  const [historyData, setHistoryData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({ total: 0, present: 0, absent: 0, late: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      // Lấy thống kê
      const statsRes = await fetch(`http://localhost:3000/api/stats/class/${classId}`);
      const statsData = await statsRes.json();
      if (statsData.success) {
        setStats({
          total: statsData.data.total_students,
          present: statsData.data.present,
          late: statsData.data.late,
          absent: statsData.data.absent
        });
      }

      // Lấy lịch sử điểm danh
      const historyRes = await fetch(`http://localhost:3000/api/attendance/history?classId=${classId}`);
      const historyJson = await historyRes.json();
      if (historyJson.success) {
        setHistoryData(historyJson.data);
      }
    } catch (error) {
      console.error("Error fetching detail data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportAttendance = () => {
    if (!historyData || historyData.length === 0) {
      alert('Không có dữ liệu để xuất');
      return;
    }

    const headers = ['MSSV', 'Họ và tên', 'Thời gian điểm danh', 'Trạng thái'];
    
    const rows = historyData.map(s => {
      let statusText = s.status === 'Present' ? 'Có mặt' : (s.status === 'Absent' ? 'Vắng' : 'Đi trễ');
      let timeText = s.checkin_time ? new Date(s.checkin_time).toLocaleString('vi-VN') : '-';
      return `"${s.student_code}","${s.student_name}","${timeText}","${statusText}"`;
    });

    const csvContent = headers.join(',') + '\n' + rows.join('\n');
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    const dateStr = new Date().toLocaleDateString('vi-VN').replace(/\//g, '-');
    link.download = `DiemDanh_Lop_${classId}_Ngay_${dateStr}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    fetchData();

    // Kết nối Socket.IO
    const socket = io('http://localhost:3000');
    
    socket.on('new_attendance', (data) => {
      // Dữ liệu từ socket: { name, student_code, time, status }
      setHistoryData(prev => [
        {
          student_code: data.student_code,
          student_name: data.name,
          status: data.status,
          checkin_time: new Date().toISOString()
        },
        ...prev
      ]);
      
      // Observer Pattern: Cập nhật state không cần reload
      setStats(prev => {
        let newPresent = prev.present;
        let newLate = prev.late;
        let newAbsent = prev.absent;

        if (data.status === 'Present') {
          newPresent += 1;
          newAbsent = Math.max(0, newAbsent - 1);
        } else if (data.status === 'Late') {
          newLate += 1;
          newAbsent = Math.max(0, newAbsent - 1);
        }

        return { ...prev, present: newPresent, late: newLate, absent: newAbsent };
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [classId]);

  const filteredHistoryData = historyData.filter(s => {
    const term = (searchTerm || '').toLowerCase();
    return (s?.student_code || '').toLowerCase().includes(term) || (s?.student_name || '').toLowerCase().includes(term);
  });

  return (
    <div className="content-container">
      <div className="detail-grid">
        {/* Cột trái: Summary Cards */}
        <div className="summary-col">
          <div className="summary-card">
            <div className="summary-icon total"><Users size={26} /></div>
            <div className="summary-info">
              <span>{stats.total}</span>
              <span>Tổng SV</span>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon present"><CheckCircle size={26} /></div>
            <div className="summary-info">
              <span>{stats.present + stats.late}</span>
              <span>Có mặt / Trễ</span>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon absent"><XCircle size={26} /></div>
            <div className="summary-info">
              <span>{stats.absent}</span>
              <span>Vắng mặt</span>
            </div>
          </div>
        </div>

        {/* Cột phải: Main Board */}
        <div className="main-board">
          <div className="board-top">
            <span className="board-title">Chi tiết điểm danh - Lớp ID: {classId}</span>
            <div className="board-controls">
              <input 
                type="text" 
                placeholder="Tìm kiếm MSSV, Họ tên..." 
                className="board-search" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="board-btn" onClick={handleExportAttendance}>
                <Download size={18} /> Xuất <ChevronDown size={14}/>
              </button>
              <button className="board-btn primary" onClick={() => navigate(`${basePath}/attendance/${classId}/stats`)}>
                <BarChart2 size={18} /> Thống kê
              </button>
            </div>
          </div>

          <div className="table-container">
            {isLoading ? (
              <div className="d-flex justify-content-center p-5">
                <div className="spinner-border text-primary" role="status"></div>
              </div>
            ) : (
              <table className="attendance-table">
                <thead>
                  <tr>
                    <th>MSSV</th>
                    <th>Họ và tên</th>
                    <th>Trạng thái</th>
                    <th>Thời gian điểm danh</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistoryData.length > 0 ? filteredHistoryData.map((s, idx) => {
                    let badgeClass = s.status === 'Present' ? 'present' : (s.status === 'Absent' ? 'absent' : 'late');
                    let statusText = s.status === 'Present' ? 'Có mặt' : (s.status === 'Absent' ? 'Vắng' : 'Đi trễ');
                    let timeText = s.checkin_time ? new Date(s.checkin_time).toLocaleString('vi-VN') : '-';
                    return (
                      <tr key={idx}>
                        <td>{s.student_code}</td>
                        <td>{s.student_name}</td>
                        <td>
                          <span className={`status-badge ${badgeClass}`}>
                            {statusText}
                          </span>
                        </td>
                        <td>{timeText}</td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan="4" className="text-center p-4">Chưa có dữ liệu điểm danh</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
