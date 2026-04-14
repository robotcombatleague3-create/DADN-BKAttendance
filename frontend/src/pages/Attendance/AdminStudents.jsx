import React, { useState } from 'react';
import { Search, User, Pencil, Trash2, X, ChevronLeft, ScanLine } from 'lucide-react';

const DUMMY_STUDENTS = [
  { id: 1, name: 'Nguyễn Văn A', mssv: '2112345', rfid: 'B5C6D7E8', classes: ['Giải tích 2', 'Ngoại ngữ'] },
  { id: 2, name: 'Trần Thị B', mssv: '2112346', rfid: '', classes: ['Nguyên lý ngôn ngữ lập trình', 'Vật lý 1'] },
  { id: 3, name: 'Lê Hoàng C', mssv: '2112347', rfid: 'F1A2B3C4', classes: ['Cấu trúc dữ liệu và giải thuật'] },
  { id: 4, name: 'Phạm Văn D', mssv: '2112348', rfid: '', classes: ['Giải tích 2', 'Lập trình hướng đối tượng'] },
  { id: 5, name: 'Hoàng Thị E', mssv: '2112349', rfid: 'A1B2C3D4', classes: ['Mạng máy tính'] },
];

export default function AdminStudents() {
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [rfidValue, setRfidValue] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  const openEditModal = (student, e) => {
    if (e) e.stopPropagation();
    setEditingStudent(student);
    setRfidValue(student.rfid || '');
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingStudent(null);
    setIsScanning(false);
  };

  const handleScanRfid = () => {
    setIsScanning(true);
    setTimeout(() => {
      setRfidValue('A3B4C5D6');
      setIsScanning(false);
    }, 3000);
  };

  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = DUMMY_STUDENTS?.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.mssv.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid mt-3 flex-grow-1 d-flex flex-column">
      
      {!selectedStudent ? (
        /* TRẠNG THÁI 1: DANH SÁCH SINH VIÊN */
        <>
          <div className="d-flex justify-content-end mb-3 gap-2">
            <div className="input-group" style={{ width: '300px' }}>
              <span className="input-group-text bg-white"><Search size={18} /></span>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Tìm kiếm sinh viên..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="btn bg-white border border-dark fw-medium d-flex align-items-center gap-2">
              <User size={18} /> Thêm sinh viên
            </button>
          </div>

          <div className="card border-0 shadow-sm flex-grow-1 mb-3">
            <div className="list-group list-group-flush rounded-3" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
              {!filteredStudents || filteredStudents.length === 0 ? (
                 <div className="text-center p-5 text-secondary">Đang tải / Không có dữ liệu.</div>
              ) : (
                filteredStudents?.map(student => (
                  <div 
                    key={student.id} 
                    className="list-group-item list-group-item-action d-flex align-items-center justify-content-between p-3"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSelectedStudent(student)}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div className="rounded-circle d-flex align-items-center justify-content-center bg-success bg-opacity-10 text-success" style={{ width: '48px', height: '48px' }}>
                        <User size={24} />
                      </div>
                      <div>
                        <h6 className="mb-1 text-dark fw-bold">{student.name}</h6>
                        <span className="text-secondary small d-block">MSSV: {student.mssv} {student.rfid ? `| Thẻ: ${student.rfid}` : '| Chưa gán thẻ'}</span>
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <button className="btn btn-light btn-sm rounded" onClick={(e) => openEditModal(student, e)} title="Chỉnh sửa">
                        <Pencil size={18} className="text-secondary" />
                      </button>
                      <button className="btn btn-light btn-sm rounded" onClick={(e) => { e.stopPropagation(); }} title="Xóa">
                        <Trash2 size={18} className="text-danger" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      ) : (
        /* TRẠNG THÁI 2: CHI TIẾT & LỊCH SỬ */
        <div className="h-100 d-flex flex-column">
          <button className="btn btn-link text-decoration-none d-flex align-items-center gap-2 p-0 mb-3 text-primary fw-medium align-self-start" onClick={() => setSelectedStudent(null)}>
            <ChevronLeft size={20} /> Quay lại
          </button>
          
          <div className="row flex-grow-1">
            {/* Cột trái (Thông tin tóm tắt) */}
            <div className="col-md-3">
              <div className="card border-0 shadow-sm p-4 text-center h-100">
                <div className="rounded-circle d-flex align-items-center justify-content-center bg-success bg-opacity-10 text-success mx-auto mb-3" style={{ width: '80px', height: '80px' }}>
                  <User size={40} />
                </div>
                <h5 className="fw-bold mb-2">{selectedStudent.name}</h5>
                <p className="text-secondary mb-1">MSSV: {selectedStudent.mssv}</p>
                <p className="text-secondary small">Mã thẻ: {selectedStudent.rfid || 'Chưa có'}</p>
              </div>
            </div>

            {/* Cột phải (Lịch sử điểm danh) */}
            <div className="col-md-9 d-flex flex-column">
              <div className="card border-0 shadow-sm p-4 flex-grow-1">
                <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                  <h4 className="fw-bold m-0 text-dark">Lịch sử điểm danh</h4>
                  <div className="d-flex gap-2">
                    <button className="btn btn-outline-secondary d-flex align-items-center gap-2" onClick={() => openEditModal(selectedStudent)}>
                      <Pencil size={18} /> Chỉnh sửa
                    </button>
                    <button className="btn btn-danger d-flex align-items-center gap-2">
                      <Trash2 size={18} /> Xóa
                    </button>
                  </div>
                </div>
                
                <div className="list-group list-group-flush">
                  {selectedStudent.classes.map((cls, idx) => (
                    <div key={idx} className="list-group-item d-flex justify-content-between align-items-center py-3">
                      <div>
                        <span className="fw-semibold d-block text-dark">{cls}</span>
                        <span className="small text-secondary">Đã tha gia điểm danh trong học kỳ này</span>
                      </div>
                      <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill">Đã điểm danh</span>
                    </div>
                  ))}
                  {selectedStudent.classes.length === 0 && (
                     <div className="text-center text-secondary py-5">Sinh viên chưa điểm danh môn nào.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TRẠNG THÁI 3: BOOTSTRAP MODAL CHỈNH SỬA / GÁN THẺ */}
      {showEditModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '12px' }}>
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-bold">Cập nhật sinh viên</h5>
                <button type="button" className="btn-close" onClick={closeEditModal}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-medium">Họ và tên</label>
                  <input type="text" className="form-control" defaultValue={editingStudent?.name} />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-medium">Mã số sinh viên (MSSV)</label>
                  <input type="text" className="form-control" defaultValue={editingStudent?.mssv} />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-medium text-primary">Mã thẻ RFID</label>
                  <div className="input-group">
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Mã hex của thẻ (VD: A3B4...)" 
                      value={rfidValue}
                      onChange={(e) => setRfidValue(e.target.value)}
                    />
                    <button 
                      className={`btn ${isScanning ? 'btn-warning' : 'btn-outline-primary'} d-flex align-items-center gap-2`} 
                      type="button"
                      onClick={handleScanRfid}
                      disabled={isScanning}
                    >
                      <ScanLine size={18} /> {isScanning ? 'Đang chờ thẻ...' : 'Quét thẻ từ thiết bị'}
                    </button>
                  </div>
                  <div className="form-text text-success mt-2">
                    * Đặt thẻ lên đầu đọc gắn với thiết bị để tự động lấy mã. (Demo click đợi 3s)
                  </div>
                </div>
              </div>
              <div className="modal-footer border-top-0 pt-0">
                <button type="button" className="btn btn-light" onClick={closeEditModal}>Hủy bỏ</button>
                <button type="button" className="btn btn-primary px-4" onClick={closeEditModal}>Lưu OK</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
