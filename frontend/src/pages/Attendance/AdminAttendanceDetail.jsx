import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Users, CheckCircle, XCircle, Download, BarChart2, ChevronDown } from 'lucide-react';
import { getClassAttendance } from '../../services/api';
import './Attendance.css';

export default function AdminAttendanceDetail() {
  const navigate = useNavigate();
  const { classId } = useParams();
  const location = useLocation();
  const basePath = location.pathname.match(/^\/[^/]+/)?.[0] || '';

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const data = await getClassAttendance(classId || 3);
        setStudents(data);
      } catch (error) {
        console.error("Lỗi khi tải chi tiết điểm danh:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [classId]);

  const total = students.length;
  const present = students.filter(s => s.status === 'present').length;
  const late = students.filter(s => s.status === 'late').length;
  const absent = students.filter(s => s.status === 'absent').length;

  return (
    <div className="content-container w-full h-full flex flex-col flex-1">
      <div className="detail-grid flex-1 w-full h-full">
        {/* Cột trái: Summary Cards */}
        <div className="summary-col">
          <div className="summary-card">
            <div className="summary-icon total"><Users size={26} /></div>
            <div className="summary-info">
               <span>{total}</span>
               <span>Tham gia</span>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon present"><CheckCircle size={26} /></div>
            <div className="summary-info">
               <span>{present + late}</span>
               <span>Có mặt (cả trễ)</span>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon absent"><XCircle size={26} /></div>
            <div className="summary-info">
               <span>{absent}</span>
               <span>Vắng mặt</span>
            </div>
          </div>
        </div>

        {/* Cột phải: Main Board */}
        <div className="main-board flex flex-col h-full w-full">
          <div className="board-top">
            <span className="board-title">Lớp: L0{classId || '3'}</span>
            <div className="board-controls">
               <input type="text" placeholder="Tìm kiếm..." className="board-search" />
               <button className="board-btn">
                 <Download size={18} /> Xuất <ChevronDown size={14}/>
               </button>
               <button className="board-btn primary" onClick={() => navigate(`${basePath}/attendance/${classId || 3}/stats`)}>
                 <BarChart2 size={18} /> Thống kê
               </button>
            </div>
          </div>

          <div className="table-container flex-1 w-full">
            <table className="attendance-table">
               <thead>
                 <tr>
                   <th>MSSV</th>
                   <th>Họ và tên</th>
                   <th>
                     <div className="th-flex">
                       Trạng thái <ChevronDown size={14} />
                     </div>
                   </th>
                   <th>
                     <div className="th-flex">
                       Thời gian điểm danh <ChevronDown size={14} />
                     </div>
                   </th>
                 </tr>
               </thead>
               <tbody>
                 {loading ? (
                   <tr><td colSpan="4" className="text-center">Đang tải dữ liệu...</td></tr>
                 ) : students.length === 0 ? (
                   <tr><td colSpan="4" className="text-center">Lớp này chưa có sinh viên.</td></tr>
                 ) : students.map((s, idx) => (
                   <tr key={idx}>
                     <td>{s.mssv}</td>
                     <td>{s.name}</td>
                     <td>
                       <span className={`status-badge ${s.status}`}>
                         {s.status === 'present' ? 'Có mặt' : s.status === 'absent' ? 'Vắng' : 'Muộn'}
                       </span>
                     </td>
                     <td>{s.time || '-'}</td>
                   </tr>
                 ))}
               </tbody>
            </table>
          </div>

          <div className="board-bottom">
            <div className="pagination">
               <div className="page-item">&lt;</div>
               <div className="page-item active">1</div>
               <div className="page-item">2</div>
               <div className="page-item">3</div>
               <div className="page-item">&gt;</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
