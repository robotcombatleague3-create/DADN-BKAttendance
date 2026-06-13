import React, { useState, useEffect } from 'react';
import { User, Pencil, X } from 'lucide-react';
import { getLecturerProfile, getLecturerHistory, updateLecturerProfile } from '../services/api';
import './LecturerProfile.css';

export default function LecturerProfile() {
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', department: '', specialization: '' });
  const [saving, setSaving] = useState(false);

  const userId = localStorage.getItem('userId');

  const fetchProfileData = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const [profileData, historyData] = await Promise.all([
        getLecturerProfile(userId),
        getLecturerHistory(userId)
      ]);
      setProfile(profileData);
      setHistory(historyData);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu hồ sơ:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleEditClick = () => {
    if (profile) {
      setEditForm({
        name: profile.name || '',
        department: profile.department || '',
        specialization: profile.specialization || ''
      });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateLecturerProfile(userId, editForm);
      alert('Cập nhật hồ sơ thành công!');
      setShowModal(false);
      fetchProfileData(); // Reload data
    } catch (error) {
      console.error("Lỗi cập nhật hồ sơ:", error);
      alert('Có lỗi xảy ra khi cập nhật hồ sơ!');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page-container d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-page-container d-flex justify-content-center align-items-center text-muted">
        Không tìm thấy thông tin hồ sơ.
      </div>
    );
  }

  return (
    <div className="profile-page-container">
      <div className="profile-card">
        {/* CỘT TRÁI (Thông tin cá nhân) */}
        <div className="profile-left-col position-relative">
          <button className="btn btn-sm btn-outline-light position-absolute top-0 end-0 m-3" onClick={handleEditClick} title="Chỉnh sửa thông tin">
            <Pencil size={16} /> Edit
          </button>
          <div className="profile-avatar">
            <User size={72} strokeWidth={1.5} />
          </div>
          <div className="profile-name">{profile.name}</div>
          <div className="profile-id">{profile.department || 'Chưa cập nhật khoa'}</div>
          <div className="profile-sub-id">{profile.specialization || 'Chưa cập nhật chuyên ngành'}</div>
          {profile.rfid_uid && (
            <div className="mt-3 text-success small">RFID: {profile.rfid_uid}</div>
          )}
        </div>

        {/* CỘT PHẢI (Lịch sử điểm danh) */}
        <div className="profile-right-col">
          <h2 className="profile-header-title">Lịch sử giảng dạy</h2>
          
          <div className="profile-history-list">
            {history.length === 0 ? (
              <div className="text-muted text-center p-4">Không có dữ liệu lịch sử.</div>
            ) : (
              history.map((item) => (
                <div key={item.session_id} className="profile-history-row">
                  <div className="profile-history-date">
                    {new Date(item.session_date).toLocaleDateString('vi-VN')}
                  </div>
                  
                  <div className="profile-history-detail-group">
                    <div className="profile-history-text">
                      <strong>{item.class_name}</strong> | {item.room} | {item.start_time} - {item.end_time}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showModal && (
        <div className="modal-overlay d-flex justify-content-center align-items-center" style={{backgroundColor: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1050}}>
          <div className="modal-content p-4 rounded bg-white shadow" style={{width: '400px', maxWidth: '90%'}}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0 text-dark">Chỉnh sửa hồ sơ</h5>
              <button className="btn btn-link text-dark p-0" onClick={() => setShowModal(false)}><X size={20}/></button>
            </div>
            <div className="mb-3">
              <label className="form-label text-dark">Họ tên</label>
              <input 
                type="text" 
                className="form-control" 
                value={editForm.name} 
                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
              />
            </div>
            <div className="mb-3">
              <label className="form-label text-dark">Khoa/Bộ môn</label>
              <input 
                type="text" 
                className="form-control" 
                value={editForm.department} 
                onChange={(e) => setEditForm({...editForm, department: e.target.value})}
              />
            </div>
            <div className="mb-3">
              <label className="form-label text-dark">Chuyên ngành</label>
              <input 
                type="text" 
                className="form-control" 
                value={editForm.specialization} 
                onChange={(e) => setEditForm({...editForm, specialization: e.target.value})}
              />
            </div>
            <div className="d-flex justify-content-end gap-2 mt-4">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Hủy</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
