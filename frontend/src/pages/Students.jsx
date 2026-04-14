import React, { useState } from 'react';
import { Search, User, Pencil, Trash2, MoreHorizontal, X, ArrowLeft } from 'lucide-react';
import './Students.css';

const DUMMY_STUDENTS = [
  { id: 1, name: 'Nguyễn Văn A', code: '2112345', class: 'MT21KH01' },
  { id: 2, name: 'Trần Thị B', code: '2112346', class: 'MT21KH01' },
  { id: 3, name: 'Lê Hoàng C', code: '2112347', class: 'MT21KH01' },
  { id: 4, name: 'Phạm Văn D', code: '2112348', class: 'MT21KH01' },
  { id: 5, name: 'Hoàng Thị E', code: '2112349', class: 'MT21KH01' },
  { id: 6, name: 'Bùi Văn F', code: '2112350', class: 'MT21KH01' },
  { id: 7, name: 'Ngô Thị G', code: '2112351', class: 'MT21KH01' }
];

const INITIAL_HISTORY = [
  { id: 1, date: '2/4/2026', subject: 'Nguyên lý ngôn ngữ lập trình', room: 'H6-301', time: '12:58:22', status: 'present' },
  { id: 2, date: '1/4/2026', subject: 'Nguyên lý ngôn ngữ lập trình', room: 'H6-301', time: '---', status: 'absent' },
  { id: 3, date: '25/3/2026', subject: 'Nguyên lý ngôn ngữ lập trình', room: 'H6-301', time: '12:55:10', status: 'present' },
  { id: 4, date: '18/3/2026', subject: 'Nguyên lý ngôn ngữ lập trình', room: 'H6-301', time: '12:50:05', status: 'present' }
];

export default function Students() {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // For editable history
  const [history, setHistory] = useState(INITIAL_HISTORY);
  const [editingHistoryId, setEditingHistoryId] = useState(null);
  const [editStatusValue, setEditStatusValue] = useState('');

  const handleRowClick = (student) => {
    setSelectedStudent(student);
    setHistory(INITIAL_HISTORY); // reset history for this dummy
    setEditingHistoryId(null);
  };

  const handleBack = () => {
    setSelectedStudent(null);
  };

  const handleEditClick = (h) => {
    setEditingHistoryId(h.id);
    setEditStatusValue(h.status);
  };

  const handleSaveStatus = (id) => {
    setHistory(history.map(h => h.id === id ? { 
      ...h, 
      status: editStatusValue,
      time: editStatusValue === 'absent' ? '---' : (h.time === '---' ? '12:00:00' : h.time)
    } : h));
    setEditingHistoryId(null);
  };

  const confirmDelete = () => {
    setShowDeleteModal(false);
    setSelectedStudent(null);
  };

  if (selectedStudent) {
    return (
      <div className="students-container">
        <button onClick={handleBack} className="btn-back">
          <ArrowLeft size={18} /> Quay lại danh sách
        </button>

        <div className="detail-view-container">
          <div className="detail-card">
            {/* Sidebar */}
            <div className="detail-sidebar">
              <div className="student-avatar">
                <User size={40} />
              </div>
              <div className="student-name">{selectedStudent.name}</div>
              <div className="student-meta">{selectedStudent.code}</div>
              <div className="student-meta">{selectedStudent.class}</div>
            </div>

            {/* Main Content */}
            <div className="detail-main">
              <div className="detail-header">
                <h2 className="detail-title">Lịch sử điểm danh</h2>
                <button className="btn-delete" onClick={() => setShowDeleteModal(true)} title="Xóa sinh viên khỏi lớp">
                  <X size={20} />
                </button>
              </div>

              <div className="history-list">
                {history.map((item) => (
                  <div className="history-row" key={item.id}>
                    <div className="history-date">{item.date}</div>
                    <div className="history-details">
                      {item.subject} | L03 | {item.room} | <span className={item.status === 'absent' ? 'history-absent' : ''}>{item.time}</span>
                    </div>
                    <div className="history-actions">
                      {editingHistoryId === item.id ? (
                        <div className="status-editor">
                          <select 
                            value={editStatusValue} 
                            onChange={e => setEditStatusValue(e.target.value)}
                            className="status-select"
                          >
                            <option value="present">Có mặt</option>
                            <option value="absent">Vắng mặt</option>
                          </select>
                          <button onClick={() => handleSaveStatus(item.id)} className="btn-save-status">Lưu</button>
                        </div>
                      ) : (
                        <Pencil 
                          size={18} 
                          className="action-icon" 
                          onClick={() => handleEditClick(item)}
                          title="Chỉnh sửa trạng thái"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <p>Bạn có chắc chắn muốn xóa sinh viên này khỏi lớp?</p>
              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>Hủy</button>
                <button className="btn-confirm" onClick={confirmDelete}>Xác nhận</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = DUMMY_STUDENTS?.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="students-container">
      {/* Top Bar Wrapper offset to stretch */}
      <div className="students-topbar-wrapper">
        <div className="search-box">
          <Search size={18} color="#888" />
          <input 
            type="text" 
            placeholder="Tìm kiếm sinh viên..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* List */}
      <div className="student-list-container">
        {!filteredStudents || filteredStudents.length === 0 ? (
          <div className="text-center p-5 text-secondary">Đang tải / Không có dữ liệu.</div>
        ) : (
          filteredStudents?.map(student => (
            <div className="student-row" key={student.id} onClick={() => handleRowClick(student)}>
              <div className="student-row-left">
                <div className="student-avatar">
                  <User size={24} />
                </div>
                <div className="student-info">
                  <div className="student-name">{student.name}</div>
                  <div className="student-meta">{student.code} • {student.class}</div>
                </div>
              </div>
              <div className="student-row-right">
                <Pencil size={20} className="action-icon" onClick={(e) => { e.stopPropagation(); }} title="Chỉnh sửa" />
                <Trash2 size={20} className="action-icon" onClick={(e) => { e.stopPropagation(); }} title="Xóa" />
                <MoreHorizontal size={20} className="action-icon" onClick={(e) => { e.stopPropagation(); }} title="Khác" />
              </div>
            </div>
          ))
        )}
        
        {/* Pagination Dummy */}
        <div className="pagination">
          <button className="page-btn">Trước</button>
          <button className="page-btn active">1</button>
          <button className="page-btn">2</button>
          <button className="page-btn">3</button>
          <span style={{color: '#666', padding: '0 5px'}}>...</span>
          <button className="page-btn">9</button>
          <button className="page-btn">10</button>
          <button className="page-btn">Sau</button>
        </div>
      </div>
    </div>
  );
}
