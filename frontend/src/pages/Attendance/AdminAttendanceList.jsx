import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Filter, Users, Search } from 'lucide-react';
import { getClasses } from '../../services/api';
import './Attendance.css';

export default function AdminAttendanceList() {
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.replace(/\/attendance.*$/, '');

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const data = await getClasses();
        setClasses(data);
      } catch (err) {
        console.error("Lỗi tải danh sách lớp học:", err);
      } finally {
        setLoading(false);
      }
    };
    loadClasses();
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const filteredData = classes?.filter(item => {
    const matchSearch = (item?.name || '').toLowerCase().includes((searchTerm || '').toLowerCase()) || 
                        (item?.lecturer || '').toLowerCase().includes((searchTerm || '').toLowerCase());
    const matchFilter = filterStatus === 'ALL' || item.status === filterStatus;
    return matchSearch && matchFilter;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  const totalPages = Math.ceil((filteredData?.length || 0) / itemsPerPage);
  const currentData = filteredData?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="content-container w-full h-full flex flex-col flex-1">
      <div className="list-card flex-1 flex flex-col w-full h-full">
        {/* Topbar: Lọc & Nhập Cải Tiến */}
        <div className="list-topbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ flex: 1 }}></div>
          <div style={{ display: 'flex', gap: '15px' }}>
            <div className="list-search" style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0 10px', background: 'white' }}>
              <Search size={18} color="#94a3b8" />
              <input 
                type="text" 
                placeholder="Tìm môn học, mã lớp, giảng viên..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ border: 'none', outline: 'none', padding: '10px', minWidth: '320px' }} 
              />
            </div>
            <select 
              className="list-filter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 16px', outline: 'none', color: '#334155', fontWeight: 500 }}
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
          </div>
        </div>

        {/* Rows */}
        <div className="list-rows flex-1 w-full h-full" style={{ overflowY: 'auto' }}>
          {loading ? (
            <div className="text-center p-5 text-secondary">Đang tải dữ liệu từ server...</div>
          ) : !currentData || currentData.length === 0 ? (
            <div className="text-center p-5 text-secondary">Không có dữ liệu.</div>
          ) : (
            currentData?.map((item) => (
              <div 
                key={item.id} 
                className="list-row w-full" 
                onClick={() => navigate(`${basePath}/attendance/${item.id}`)}
                style={{ padding: '20px' }}
              >
                {/* Cột trái */}
                <div className="row-left" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span className="row-title">{item.name}</span>
                  <span style={{ color: '#64748b', fontSize: '0.95rem' }}>{item.lecturer}</span>
                  <div className="row-meta" style={{ marginTop: '8px' }}>
                    <span className="row-student-count">
                      {item.students} tham gia <Users size={16} />
                    </span>
                    <span style={{ color: '#cbd5e1' }}>|</span>
                    <span className="row-status" style={{ color: item.status === 'online' ? '#22c55e' : '#94a3b8' }}>
                      {item.status === 'online' ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>

                {/* Cột phải */}
                <div className="row-right">
                  {item.time}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center align-items-center p-3 border-top">
            <button 
              className="btn btn-outline-secondary btn-sm me-2"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            >
              Trước
            </button>
            <span className="text-secondary small mx-2">
              Trang {currentPage} / {totalPages}
            </span>
            <button 
              className="btn btn-outline-secondary btn-sm ms-2"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            >
              Sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
