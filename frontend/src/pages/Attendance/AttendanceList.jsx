import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Attendance.css';

export default function AttendanceList() {
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.replace(/\/attendance.*$/, '');

  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    // Gọi API với lecturerId=1 (Hardcode tạm thời)
    fetch('http://localhost:3000/api/classes/lecturer?lecturerId=1')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Thêm một status mặc định để demo (online/offline)
          const formatted = data.data.map(c => ({
            ...c,
            status: 'online', 
            students: 0 // Tạm thời để 0 vì chưa có API tổng số sinh viên tại đây
          }));
          setClasses(formatted);
        }
      })
      .catch(err => console.error("Error fetching classes:", err))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredData = classes?.filter(item => {
    const matchSearch = item.class_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        item.class_code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFilter = filterStatus === 'ALL' || item.status === filterStatus;
    return matchSearch && matchFilter;
  });

  return (
    <div className="content-container flex-grow-1 w-100">
      <div className="list-card container mt-4">
        {/* Topbar: Bộ lọc */}
        <div className="list-topbar mb-4 d-flex justify-content-end">
          <div style={{ display: 'flex', gap: '15px' }}>
            <div className="list-search" style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0 10px', background: 'white' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input 
                type="text" 
                placeholder="Tìm môn học, mã lớp..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ border: 'none', outline: 'none', padding: '10px', minWidth: '250px' }} 
              />
            </div>
            <select 
              className="form-select list-filter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', minWidth: '150px' }}
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
          </div>
        </div>

        {/* Danh sách lớp */}
        <div className="list-rows">
          {isLoading ? (
            <div className="d-flex justify-content-center p-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Đang tải...</span>
              </div>
            </div>
          ) : !filteredData || filteredData.length === 0 ? (
            <div className="text-center p-5 text-secondary">Không tìm thấy lớp học nào.</div>
          ) : (
            filteredData.map((item) => (
              <div 
                key={item.class_id} 
                className="list-row d-flex justify-content-between align-items-center p-3 mb-3 border rounded shadow-sm bg-white" 
                onClick={() => navigate(`${basePath}/attendance/${item.class_id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="row-left">
                  <span className="row-title fw-bold d-block mb-1">{item.class_name} | {item.room}</span>
                  <div className="row-meta text-muted" style={{ fontSize: '14px' }}>
                    <span className="row-student-count me-3">
                      Mã lớp: {item.class_code}
                      <svg className="ms-1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                    </span>
                    <span className="row-status d-inline-flex align-items-center">
                      Trạng thái: 
                      <div className="ms-2" style={{
                        width: '10px', 
                        height: '10px', 
                        borderRadius: '50%', 
                        backgroundColor: item.status === 'online' ? '#22c55e' : '#94a3b8'
                      }}></div>
                    </span>
                  </div>
                </div>
                <div className="row-right fw-medium text-muted">
                  Phòng: {item.room}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}