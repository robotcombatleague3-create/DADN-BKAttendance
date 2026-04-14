import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Filter, Users, Search } from 'lucide-react';
import './Attendance.css';

export default function AdminAttendanceList() {
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.replace(/\/attendance.*$/, '');

  const dummyData = [
    { id: 1, name: 'Nguyên lý ngôn ngữ lập trình L01 | H6-301', lecturer: 'GV: Trần Thị A', time: 'T3 10:00 - 11h50', students: 100, status: 'offline' },
    { id: 2, name: 'Kiến trúc máy tính L02 | H1-201', lecturer: 'GV: Nguyễn Văn B', time: 'T4 07:00 - 09h50', students: 85, status: 'offline' },
    { id: 3, name: 'Cơ sở dữ liệu L03 | H3-401', lecturer: 'GV: Phan T', time: 'T5 13:00 - 15h50', students: 120, status: 'online' },
    { id: 4, name: 'Cấu trúc dữ liệu và giải thuật L04 | H1-402', lecturer: 'GV: Lê Thị C', time: 'T6 07:00 - 09h50', students: 110, status: 'online' }
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const filteredData = dummyData?.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        item.lecturer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFilter = filterStatus === 'ALL' || item.status === filterStatus;
    return matchSearch && matchFilter;
  });

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
          {!filteredData || filteredData.length === 0 ? (
            <div className="text-center p-5 text-secondary">Đang tải / Không có dữ liệu.</div>
          ) : (
            filteredData?.map((item) => (
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
      </div>
    </div>
  );
}
