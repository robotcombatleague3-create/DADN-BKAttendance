import React, { useState, useEffect } from 'react';
import { Search, User, Pencil, Trash2, X, ChevronLeft, ScanLine } from 'lucide-react';
import { getStudents, updateStudent, deleteStudent, createStudent } from '../../services/api';

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  
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

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editName, setEditName] = useState("");
  const [editCode, setEditCode] = useState("");
  const [rfidValue, setRfidValue] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  const openEditModal = (student, e) => {
    if (e) e.stopPropagation();
    setEditingStudent(student);
    setEditName(student.name || '');
    setEditCode(student.code || '');
    setRfidValue(student.rfid_uid || '');
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingStudent(null);
    setIsScanning(false);
  };

  const openAddModal = () => {
    setEditingStudent(null);
    setEditName("");
    setEditCode("");
    setRfidValue("");
    setShowEditModal(true);
  };

  const handleSave = async () => {
    try {
      if (editingStudent) {
        await updateStudent(editingStudent.id, {
          name: editName,
          code: editCode,
          rfidUid: rfidValue
        });
      } else {
        await createStudent({
          name: editName,
          code: editCode,
          rfidUid: rfidValue
        });
      }
      // reload
      const data = await getStudents();
      setStudents(data);
      
      // Update selectedStudent view if it is the one being edited
      if (selectedStudent && editingStudent && selectedStudent.id === editingStudent.id) {
         setSelectedStudent({...selectedStudent, name: editName, code: editCode, rfid_uid: rfidValue});
      }
      closeEditModal();
    } catch (err) {
      console.error(err);
      alert(editingStudent ? "Lỗi cập nhật sinh viên" : "Lỗi thêm sinh viên");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sinh viên này?")) return;
    try {
      await deleteStudent(id);
      const data = await getStudents();
      setStudents(data);
      if (selectedStudent && selectedStudent.id === id) {
        setSelectedStudent(null);
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi xóa sinh viên");
    }
  };

  const handleScanRfid = () => {
    setIsScanning(true);
    setTimeout(() => {
      setRfidValue('A3B4C5D6');
      setIsScanning(false);
    }, 3000);
  };

  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = students?.filter(student => 
    (student?.name || '').toLowerCase().includes((searchTerm || '').toLowerCase()) || 
    (student?.code || '').toString().toLowerCase().includes((searchTerm || '').toLowerCase())
  );

  const handleSyncHardware = async () => {
    if (window.confirm('Bạn có chắc muốn đẩy dữ liệu xuống phần cứng?')) {
      try {
        const res = await fetch('http://localhost:3000/api/students/sync-hardware', { method: 'POST' });
        const data = await res.json();
        if (data.success) {
          alert(data.message);
        } else {
          alert('Lỗi: ' + data.message);
        }
      } catch (err) {
        alert('Lỗi mạng khi đồng bộ phần cứng');
      }
    }
  };

  return (
    <div className="container-fluid mt-3 flex-grow-1 d-flex flex-column">
      
      {!selectedStudent ? (
        /* TRẠNG THÁI 1: DANH SÁCH SINH VIÊN */
        <>
          <div className="d-flex justify-content-between mb-3 gap-2 align-items-center">
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
            <div className="d-flex gap-2">
              <button className="btn btn-outline-primary fw-medium d-flex align-items-center gap-2" onClick={handleSyncHardware}>
                Đồng bộ phần cứng
              </button>
              <button className="btn btn-primary fw-medium d-flex align-items-center gap-2 text-white" onClick={openAddModal}>
                <User size={18} /> Thêm sinh viên
              </button>
            </div>
          </div>

          <div className="card border-0 shadow-sm flex-grow-1 mb-3">
            <div className="list-group list-group-flush rounded-3" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
              {loading ? (
                 <div className="text-center p-5 text-secondary">Đang tải dữ liệu từ server...</div>
              ) : !filteredStudents || filteredStudents.length === 0 ? (
                 <div className="text-center p-5 text-secondary">Không có dữ liệu.</div>
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
                        <span className="text-secondary small d-block">MSSV: {student.code} {student.rfid_uid ? `| Thẻ: ${student.rfid_uid}` : '| Chưa gán thẻ'}</span>
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <button className="btn btn-outline-primary btn-sm rounded" onClick={(e) => openEditModal(student, e)} title="Chỉnh sửa">
                        <Pencil size={18} />
                      </button>
                      <button className="btn btn-outline-danger btn-sm rounded" onClick={(e) => { e.stopPropagation(); handleDelete(student.id); }} title="Xóa">
                        <Trash2 size={18} />
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
          <button className="btn btn-secondary d-flex align-items-center gap-2 mb-3 text-white fw-medium align-self-start" onClick={() => setSelectedStudent(null)}>
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
                <p className="text-secondary mb-1">MSSV: {selectedStudent.code}</p>
                <p className="text-secondary small">Mã thẻ: {selectedStudent.rfid_uid || 'Chưa có'}</p>
              </div>
            </div>

            {/* Cột phải (Lịch sử điểm danh) */}
            <div className="col-md-9 d-flex flex-column">
              <div className="card border-0 shadow-sm p-4 flex-grow-1">
                <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                  <h4 className="fw-bold m-0 text-dark">Lịch sử điểm danh</h4>
                  <div className="d-flex gap-2">
                    <button className="btn btn-primary d-flex align-items-center gap-2 text-white" onClick={() => openEditModal(selectedStudent)}>
                      <Pencil size={18} /> Chỉnh sửa
                    </button>
                    <button className="btn btn-danger d-flex align-items-center gap-2" onClick={() => handleDelete(selectedStudent.id)}>
                      <Trash2 size={18} /> Xóa
                    </button>
                  </div>
                </div>
                
                <div className="list-group list-group-flush">
                  <div className="list-group-item d-flex justify-content-between align-items-center py-3">
                    <div>
                      <span className="fw-semibold d-block text-dark">{selectedStudent.class || 'Chưa phân lớp'}</span>
                      <span className="small text-secondary">Lớp học hiện tại</span>
                    </div>
                  </div>
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
                <h5 className="modal-title fw-bold">{editingStudent ? 'Cập nhật sinh viên' : 'Thêm sinh viên mới'}</h5>
                <button type="button" className="btn-close" onClick={closeEditModal}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-medium">Họ và tên</label>
                  <input type="text" className="form-control" value={editName} onChange={(e) => setEditName(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-medium">Mã số sinh viên (MSSV)</label>
                  <input type="text" className="form-control" value={editCode} onChange={(e) => setEditCode(e.target.value)} />
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
                <button type="button" className="btn btn-primary px-4" onClick={handleSave}>Lưu thông tin</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
