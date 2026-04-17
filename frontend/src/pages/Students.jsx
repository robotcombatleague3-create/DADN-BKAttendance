import React, { useState, useEffect } from 'react';
import { Search, User, Pencil, Trash2, MoreHorizontal, X, ArrowLeft } from 'lucide-react';
import { getStudents, getStatusClass } from '../services/api';
import './Students.css';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const data = await getStudents();
        setStudents(data);
      } catch (err) {
        console.error("Lỗi tải danh sách sinh viên:", err);
      } finally {
        setLoading(false);
      }
    };
    loadStudents();
  }, []);

  const handleRowClick = (student) => {
    setSelectedStudent(student);
  };

  const handleBack = () => {
    setSelectedStudent(null);
  };

  const confirmDelete = () => {
    // Logic xóa sinh viên thật (nếu có API)
    setShowDeleteModal(false);
    setSelectedStudent(null);
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.code.toString().includes(searchTerm)
  );

  if (selectedStudent) {
    return (
      <div className="students-container">
        <button onClick={handleBack} className="btn-back">
          <ArrowLeft size={18} /> Quay lại danh sách
        </button>

        <div className="detail-view-container">
          <div className="detail-card">
            <div className="detail-sidebar">
              <div className="student-avatar">
                <User size={40} />
              </div>
              <div className="student-name">{selectedStudent.name}</div>
              <div className="student-meta">MSSV: {selectedStudent.code}</div>
              <div className="student-meta">Lớp: {selectedStudent.class || 'Chưa xếp lớp'}</div>
              {selectedStudent.rfid_uid && (
                <div className="student-meta" style={{color: '#4ade80'}}>RFID: {selectedStudent.rfid_uid}</div>
              )}
            </div>

            <div className="detail-main">
              <div className="detail-header">
                <h2 className="detail-title">Thông tin chi tiết</h2>
                <button className="btn-delete" onClick={() => setShowDeleteModal(true)} title="Xóa sinh viên">
                  <X size={20} />
                </button>
              </div>
              <div style={{ padding: '20px', color: '#ccc' }}>
                <p>Tính năng xem lịch sử riêng từng sinh viên đang được phát triển...</p>
              </div>
            </div>
          </div>
        </div>

        {showDeleteModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <p>Bạn có chắc chắn muốn xóa sinh viên <strong>{selectedStudent.name}</strong>?</p>
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

  return (
    <div className="students-container">
      <div className="students-topbar-wrapper">
        <div className="search-box">
          <Search size={18} color="#888" />
          <input 
            type="text" 
            placeholder="Tìm kiếm sinh viên theo tên hoặc MSSV..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="student-list-container">
        {loading ? (
          <div className="text-center p-5 text-secondary">Đang tải danh sách...</div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center p-5 text-secondary">Không tìm thấy sinh viên nào.</div>
        ) : (
          filteredStudents.map(student => (
            <div className="student-row" key={student.id} onClick={() => handleRowClick(student)}>
              <div className="student-row-left">
                <div className="student-avatar">
                  <User size={24} />
                </div>
                <div className="student-info">
                  <div className="student-name">{student.name}</div>
                  <div className="student-meta">{student.code} • {student.class || 'N/A'}</div>
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
      </div>
    </div>
  );
}
