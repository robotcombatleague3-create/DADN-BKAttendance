import React, { useState, useEffect } from 'react';
import { Search, User, Pencil, Trash2, X, ChevronLeft, ScanLine, UserPlus } from 'lucide-react';
import { getLecturers } from '../../services/api';

export default function AdminLecturers() {
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLecturer, setSelectedLecturer] = useState(null);
  
  useEffect(() => {
    const loadLecturers = async () => {
      try {
        const data = await getLecturers();
        setLecturers(data);
      } catch (err) {
        console.error("Lỗi tải danh sách giảng viên:", err);
      } finally {
        setLoading(false);
      }
    };
    loadLecturers();
  }, []);
  
  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingLecturer, setEditingLecturer] = useState(null);
  const [rfidValue, setRfidValue] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  const openEditModal = (lecturer, e) => {
    if (e) e.stopPropagation();
    setEditingLecturer(lecturer);
    setRfidValue(lecturer.rfid_uid || '');
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingLecturer(null);
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

  const filteredLecturers = lecturers?.filter(lecturer => 
    lecturer.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (lecturer.khoa && lecturer.khoa.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container-fluid mt-3 flex-grow-1 d-flex flex-column">
      
      {!selectedLecturer ? (
        /* TRẠNG THÁI 1: DANH SÁCH GIẢNG VIÊN */
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
            <button className="btn bg-white border border-dark fw-medium d-flex align-items-center gap-2">
              <UserPlus size={18} /> Thêm
            </button>
          </div>

          <div className="card border-0 shadow-sm flex-grow-1 mb-3">
            <div className="list-group list-group-flush rounded-3" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
              {loading ? (
                 <div className="text-center p-5 text-secondary">Đang tải dữ liệu từ server...</div>
              ) : !filteredLecturers || filteredLecturers.length === 0 ? (
                 <div className="text-center p-5 text-secondary">Không có dữ liệu.</div>
              ) : (
                filteredLecturers?.map(lecturer => (
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
                        <span className="text-secondary small d-block">Khoa: {lecturer.khoa || 'Chưa cập nhật'} {lecturer.rfid_uid ? `| Mã thẻ: ${lecturer.rfid_uid}` : '| Chưa gán thẻ'}</span>
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <button className="btn btn-light btn-sm rounded" onClick={(e) => openEditModal(lecturer, e)} title="Chỉnh sửa">
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
          <button className="btn btn-link text-decoration-none d-flex align-items-center gap-2 p-0 mb-3 text-primary fw-medium align-self-start" onClick={() => setSelectedLecturer(null)}>
            <ChevronLeft size={20} /> Quay lại
          </button>
          
          <div className="row flex-grow-1">
            {/* Cột trái (Thông tin tóm tắt) */}
            <div className="col-md-3">
              <div className="card border-0 shadow-sm p-4 text-center h-100">
                <div className="rounded-circle d-flex align-items-center justify-content-center bg-danger bg-opacity-10 text-danger mx-auto mb-3" style={{ width: '80px', height: '80px' }}>
                  <User size={40} />
                </div>
                <h5 className="fw-bold mb-2">{selectedLecturer.name}</h5>
                <p className="text-secondary mb-1">Khoa: {selectedLecturer.khoa}</p>
                <p className="text-secondary small">Mã thẻ: {selectedLecturer.rfid_uid || 'Chưa định danh'}</p>
              </div>
            </div>

            {/* Cột phải (Lịch sử giảng dạy) */}
            <div className="col-md-9 d-flex flex-column">
              <div className="card border-0 shadow-sm p-4 flex-grow-1">
                <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                  <h4 className="fw-bold m-0 text-dark">Lịch sử điểm danh</h4>
                  <div className="d-flex gap-2">
                    <button className="btn btn-outline-secondary d-flex align-items-center gap-2" onClick={() => openEditModal(selectedLecturer)}>
                      <Pencil size={18} /> Chỉnh sửa
                    </button>
                    <button className="btn btn-danger d-flex align-items-center gap-2">
                      <Trash2 size={18} /> Xóa
                    </button>
                  </div>
                </div>
                
                <div className="list-group list-group-flush flex-grow-1">
                  <div className="text-center text-secondary py-5">Chức năng quản lý lớp của giảng viên đang được phát triển...</div>
                </div>

                {/* Phân trang */}
                <div className="d-flex justify-content-end mt-4">
                  <nav>
                    <ul className="pagination mb-0">
                      <li className="page-item disabled"><a className="page-link" href="#">Trang trước</a></li>
                      <li className="page-item active"><a className="page-link" href="#">1</a></li>
                      <li className="page-item"><a className="page-link" href="#">2</a></li>
                      <li className="page-item"><a className="page-link" href="#">3</a></li>
                      <li className="page-item"><a className="page-link" href="#">Trang sau</a></li>
                    </ul>
                  </nav>
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
                <h5 className="modal-title fw-bold">Cập nhật Giảng viên</h5>
                <button type="button" className="btn-close" onClick={closeEditModal}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-medium">Họ và tên</label>
                  <input type="text" className="form-control" defaultValue={editingLecturer?.name} />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-medium">Khoa / Phòng ban</label>
                  <input type="text" className="form-control" defaultValue={editingLecturer?.khoa} />
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
                      <ScanLine size={18} /> {isScanning ? 'Đang chờ thẻ...' : 'Quét thẻ từ thiết bị'}
                    </button>
                  </div>
                  <div className="form-text text-success mt-2">
                    * Đặt thẻ lên đầu đọc phần cứng để hệ thống tự động xác nhận mã. (Chờ 3s)
                  </div>
                </div>
              </div>
              <div className="modal-footer border-top-0 pt-0">
                <button type="button" className="btn btn-light" onClick={closeEditModal}>Hủy bỏ</button>
                <button type="button" className="btn btn-primary px-4" onClick={closeEditModal}>OK</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
