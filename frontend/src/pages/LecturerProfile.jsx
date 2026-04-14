import React from 'react';
import { User, Pencil } from 'lucide-react';
import './LecturerProfile.css';

const DUMMY_HISTORY = [
  { id: 1, date: '10/5/2026', subject: 'Nguyên lý ngôn ngữ lập trình', room: 'H6-301', time: '12:55:32' },
  { id: 2, date: '3/5/2026', subject: 'Nguyên lý ngôn ngữ lập trình', room: 'H6-301', time: '12:56:10' },
  { id: 3, date: '26/4/2026', subject: 'Cấu trúc dữ liệu và giải thuật', room: 'H1-402', time: '07:15:00' },
  { id: 4, date: '19/4/2026', subject: 'Cấu trúc dữ liệu và giải thuật', room: 'H1-402', time: '07:12:45' },
  { id: 5, date: '9/4/2026', subject: 'Nguyên lý ngôn ngữ lập trình', room: 'H6-301', time: '13:00:00' },
  { id: 6, date: '2/4/2026', subject: 'Nguyên lý ngôn ngữ lập trình', room: 'H6-301', time: '12:58:22' },
];

export default function LecturerProfile() {
  return (
    <div className="profile-page-container">
      <div className="profile-card">
        {/* CỘT TRÁI (Thông tin cá nhân) */}
        <div className="profile-left-col">
          <div className="profile-avatar">
            <User size={72} strokeWidth={1.5} />
          </div>
          <div className="profile-name">Trần Thị A</div>
          <div className="profile-id">MT071016</div>
          <div className="profile-sub-id">Mã: MT071016XYZ</div>
        </div>

        {/* CỘT PHẢI (Lịch sử điểm danh) */}
        <div className="profile-right-col">
          <h2 className="profile-header-title">Lịch sử điểm danh</h2>
          
          <div className="profile-history-list">
            {DUMMY_HISTORY.map((item) => (
              <div key={item.id} className="profile-history-row">
                <div className="profile-history-date">{item.date}</div>
                
                <div className="profile-history-detail-group">
                  <div className="profile-history-text">
                    {item.subject} | L03 | {item.room} | {item.time}
                  </div>
                  <Pencil size={18} className="profile-icon" title="Chỉnh sửa" />
                </div>
              </div>
            ))}
          </div>

          {/* Phân trang nằm góc dưới cùng bên phải */}
          <div className="profile-pagination">
            <div className="profile-page-item active">1</div>
            <div className="profile-page-item inactive">2</div>
            <div className="profile-page-item inactive">3</div>
          </div>
        </div>
      </div>
    </div>
  );
}
