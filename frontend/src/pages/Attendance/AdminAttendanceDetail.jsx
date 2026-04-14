import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Users, CheckCircle, XCircle, Download, BarChart2, ChevronDown } from 'lucide-react';
import './Attendance.css';

export default function AdminAttendanceDetail() {
  const navigate = useNavigate();
  const { classId } = useParams();
  const location = useLocation();
  const basePath = location.pathname.match(/^\/[^/]+/)?.[0] || '';


  const mockStudents = [
    { mssv: '2110001', name: 'Nguyễn Văn A', status: 'present', time: '10:05 AM' },
    { mssv: '2110002', name: 'Trần Thị B', status: 'absent', time: '-' },
    { mssv: '2110003', name: 'Lê Văn C', status: 'late', time: '10:45 AM' },
    { mssv: '2110004', name: 'Phạm Thị D', status: 'present', time: '10:02 AM' },
  ];

  return (
    <div className="content-container w-full h-full flex flex-col flex-1">
      <div className="detail-grid flex-1 w-full h-full">
        {/* Cột trái: Summary Cards */}
        <div className="summary-col">
          <div className="summary-card">
            <div className="summary-icon total"><Users size={26} /></div>
            <div className="summary-info">
               <span>100</span>
               <span>Tham gia</span>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon present"><CheckCircle size={26} /></div>
            <div className="summary-info">
               <span>60</span>
               <span>Có mặt</span>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon absent"><XCircle size={26} /></div>
            <div className="summary-info">
               <span>40</span>
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
                 {mockStudents.map((s, idx) => (
                   <tr key={idx}>
                     <td>{s.mssv}</td>
                     <td>{s.name}</td>
                     <td>
                       <span className={`status-badge ${s.status}`}>
                         {s.status === 'present' ? 'Có mặt' : s.status === 'absent' ? 'Vắng' : 'Muộn'}
                       </span>
                     </td>
                     <td>{s.time}</td>
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
