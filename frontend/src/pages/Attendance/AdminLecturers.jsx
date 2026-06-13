import React, { useState, useEffect } from 'react';
import { Search, User, Pencil, Trash2, ChevronLeft, ScanLine } from 'lucide-react';
import { getLecturers, createLecturer, updateLecturer, deleteLecturer } from '../../services/api';

export default function AdminLecturers() {
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLecturer, setSelectedLecturer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('edit');
  const [editingLecturer, setEditingLecturer] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editKhoa, setEditKhoa] = useState('');
  const [editMajor, setEditMajor] = useState('');
  const [rfidValue, setRfidValue] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const loadLecturers = async () => {
    try {
      const data = await getLecturers();
      setLecturers(data);
    } catch (err) {
      console.error('Lỗi tải danh sách giảng viên:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLecturers();
  }, []);

  const openAddModal = () => {
    setModalMode('add');
    setEditingLecturer(null);
    setEditName('');
    setEditEmail('');
    setEditPassword('123456');
    setEditKhoa('');
    setEditMajor('');
    setRfidValue('');
    setShowModal(true);
  };

  const openEditModal = (lecturer, e) => {
    if (e) e.stopPropagation();
    setModalMode('edit');
    setEditingLecturer(lecturer);
    setEditName(lecturer.name || '');
    setEditEmail(lecturer.email || '');
    setEditPassword('');
    setEditKhoa(lecturer.khoa || '');
    setEditMajor(lecturer.major || '');
    setRfidValue(lecturer.rfid_uid || '');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingLecturer(null);
    setIsScanning(false);
  };

  const handleSave = async () => {
    if (!editName.trim() || !editEmail.trim()) {
      alert('Vui lòng nhập đầy đủ họ tên và email');
      return;
    }

    try {
      const payload = {
        name: editName.trim(),
        email: editEmail.trim(),
        department: editKhoa.trim() || null,
        specialization: editMajor.trim() || null,
        rfidUid: rfidValue.trim() || null
      };

      let result;
      if (modalMode === 'add') {
        result = await createLecturer({ ...payload, password: editPassword || '123456' });
      } else {
        result = await updateLecturer(editingLecturer.user_id, payload);
      }

      if (!result.success) {
        alert(result.message || 'Thao tác thất bại');
        return;
      }

      await loadLecturers();

      if (selectedLecturer && editingLecturer && selectedLecturer.id === editingLecturer.id) {
        setSelectedLecturer({
          ...selectedLecturer,
          name: editName,
          email: editEmail,
          khoa: editKhoa,
          major: editMajor,
          rfid_uid: rfidValue
        });
      }

      alert(result.message || (modalMode === 'add' ? 'Thêm giảng viên thành công' : 'Cập nhật thành công'));
      closeModal();
    } catch (err) {
      console.error(err);
      alert('Lỗi kết nối server');
    }
  };

  const handleDelete = async (lecturerId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa giảng viên này?')) return;

    try {
      const result = await deleteLecturer(lecturerId);
      if (!result.success) {
        alert(result.message || 'Không thể xóa giảng viên');
        return;
      }

      await loadLecturers();
      if (selectedLecturer && selectedLecturer.id === lecturerId) {
        setSelectedLecturer(null);
      }
      alert(result.message || 'Xóa giảng viên thành công');
    } catch (err) {
      console.error(err);
      alert('Lỗi kết nối server');
    }
  };

  const handleScanRfid = () => {
    setIsScanning(true);
    setTimeout(() => {
      setRfidValue('A3B4C5D6');
      setIsScanning(false);
    }, 3000);
  };

  const filteredLecturers = lecturers?.filter(lecturer =>
    lecturer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (lecturer.email && lecturer.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.ceil((filteredLecturers?.length || 0) / itemsPerPage);
  const currentData = filteredLecturers?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="container-fluid mt-3 flex-grow-1 d-flex flex-column">

      {!selectedLecturer ? (
        <>
          <div className="d-flex justify-content-end mb-3 gap-2">
            <div className="input-group" style={{ width: '300px' }}>
              <span className="input-group-text bg-white"><Search size={18} /></span>
              <input
                type="text"
                className="form-control"
                placeholder="Tìm kiếm giảng viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="btn btn-primary fw-medium d-flex align-items-center gap-2 text-white" onClick={openAddModal}>
              <User size={18} /> Thêm giảng viên
            </button>
          </div>

          <div className="card border-0 shadow-sm flex-grow-1 mb-3">
            <div className="list-group list-group-flush rounded-3" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
              {loading ? (
                <div className="text-center p-5 text-secondary">Đang tải dữ liệu từ server...</div>
              ) : !currentData || currentData.length === 0 ? (
                <div className="text-center p-5 text-secondary">Không có dữ liệu.</div>
              ) : (
                currentData.map(lecturer => (
                  <div
                    key={lecturer.id}
                    className="list-group-item list-group-item-action d-flex align-items-center justify-content-between p-3"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSelectedLecturer(lecturer)}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div className="rounded-circle d-flex align-items-center justify-content-center bg-danger bg-opacity-10 text-danger" style={{ width: '48px', height: '48px' }}>
                        <User size={24} />
                      </div>
                      <div>
                        <h6 className="mb-1 text-dark fw-bold">{lecturer.name}</h6>
                        <span className="text-secondary small d-block">
                          {lecturer.email} | Khoa: {lecturer.khoa || 'Chưa cập nhật'}
                          {lecturer.rfid_uid ? ` | Mã thẻ: ${lecturer.rfid_uid}` : ' | Chưa gán thẻ'}
                        </span>
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <button className="btn btn-outline-primary btn-sm rounded" onClick={(e) => openEditModal(lecturer, e)} title="Chỉnh sửa">
                        <Pencil size={18} />
                      </button>
                      <button className="btn btn-outline-danger btn-sm rounded" onClick={(e) => { e.stopPropagation(); handleDelete(lecturer.id); }} title="Xóa">
                        <Trash2 size={18} />
                      </button>
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
        </>
      ) : (
        <div className="h-100 d-flex flex-column">
          <button className="btn btn-secondary d-flex align-items-center gap-2 mb-3 text-white fw-medium align-self-start" onClick={() => setSelectedLecturer(null)}>
            <ChevronLeft size={20} /> Quay lại
          </button>

          <div className="row flex-grow-1">
            <div className="col-md-3">
              <div className="card border-0 shadow-sm p-4 text-center h-100">
                <div className="rounded-circle d-flex align-items-center justify-content-center bg-danger bg-opacity-10 text-danger mx-auto mb-3" style={{ width: '80px', height: '80px' }}>
                  <User size={40} />
                </div>
                <h5 className="fw-bold mb-2">{selectedLecturer.name}</h5>
                <p className="text-secondary mb-1">{selectedLecturer.email}</p>
                <p className="text-secondary mb-1">Khoa: {selectedLecturer.khoa || 'Chưa cập nhật'}</p>
                <p className="text-secondary small">Mã thẻ: {selectedLecturer.rfid_uid || 'Chưa định danh'}</p>
              </div>
            </div>

            <div className="col-md-9 d-flex flex-column">
              <div className="card border-0 shadow-sm p-4 flex-grow-1">
                <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                  <h4 className="fw-bold m-0 text-dark">Thông tin giảng viên</h4>
                  <div className="d-flex gap-2">
                    <button className="btn btn-primary d-flex align-items-center gap-2 text-white" onClick={() => openEditModal(selectedLecturer)}>
                      <Pencil size={18} /> Chỉnh sửa
                    </button>
                    <button className="btn btn-danger d-flex align-items-center gap-2" onClick={() => handleDelete(selectedLecturer.id)}>
                      <Trash2 size={18} /> Xóa
                    </button>
                  </div>
                </div>

                <div className="list-group list-group-flush">
                  <div className="list-group-item py-3">
                    <span className="fw-semibold d-block text-dark">Chuyên ngành: {selectedLecturer.major || 'Chưa cập nhật'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '12px' }}>
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-bold">
                  {modalMode === 'add' ? 'Thêm giảng viên mới' : 'Cập nhật giảng viên'}
                </h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-medium">Họ và tên *</label>
                  <input type="text" className="form-control" value={editName} onChange={(e) => setEditName(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-medium">Email *</label>
                  <input type="email" className="form-control" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
                </div>
                {modalMode === 'add' && (
                  <div className="mb-3">
                    <label className="form-label fw-medium">Mật khẩu</label>
                    <input type="text" className="form-control" value={editPassword} onChange={(e) => setEditPassword(e.target.value)} placeholder="Mặc định: 123456" />
                  </div>
                )}
                <div className="mb-3">
                  <label className="form-label fw-medium">Khoa / Phòng ban</label>
                  <input type="text" className="form-control" value={editKhoa} onChange={(e) => setEditKhoa(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-medium">Chuyên ngành</label>
                  <input type="text" className="form-control" value={editMajor} onChange={(e) => setEditMajor(e.target.value)} />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-medium text-primary">Mã thẻ RFID</label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Mã hex kết nối thẻ (VD: A3B4...)"
                      value={rfidValue}
                      onChange={(e) => setRfidValue(e.target.value)}
                    />
                    <button
                      className={`btn ${isScanning ? 'btn-warning' : 'btn-outline-primary'} d-flex align-items-center gap-2`}
                      type="button"
                      onClick={handleScanRfid}
                      disabled={isScanning}
                    >
                      <ScanLine size={18} /> {isScanning ? 'Đang chờ thẻ...' : 'Quét thẻ'}
                    </button>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-top-0 pt-0">
                <button type="button" className="btn btn-light" onClick={closeModal}>Hủy bỏ</button>
                <button type="button" className="btn btn-primary px-4" onClick={handleSave}>
                  {modalMode === 'add' ? 'Thêm giảng viên' : 'Lưu thông tin'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
