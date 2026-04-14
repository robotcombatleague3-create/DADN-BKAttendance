import React from 'react';
import { User, Mail, Phone, MapPin } from 'lucide-react';

export default function AdminProfile() {
  const user = {
    name: 'Phan T',
    role: 'Admin',
    email: 'admin@hcmut.edu.vn',
    phone: '0123.456.789',
    office: 'A1-201',
    avatar: 'T',
    color: '#22c55e'
  };

  return (
    <div className="container-fluid mt-3 flex-grow-1 d-flex flex-column align-items-center justify-content-center p-5">
      <div className="card shadow-sm w-100" style={{ maxWidth: '600px', borderRadius: '16px', overflow: 'hidden' }}>
        <div 
          className="card-header border-0 text-center text-white" 
          style={{ backgroundColor: user.color, padding: '40px 20px 80px' }}
        >
          <h3 className="m-0 fw-bold">Hồ Sơ Quản Trị Viên</h3>
        </div>
        <div className="card-body text-center bg-white" style={{ position: 'relative', marginTop: '-60px', paddingBottom: '40px' }}>
          <div 
            className="rounded-circle d-flex align-items-center justify-content-center mx-auto shadow" 
            style={{ 
              width: '120px', height: '120px', backgroundColor: 'white', border: `4px solid ${user.color}`,
              fontSize: '3rem', fontWeight: 'bold', color: user.color 
            }}
          >
            {user.avatar}
          </div>
          <h4 className="mt-3 fw-bold text-dark">{user.name}</h4>
          <span className="badge bg-secondary mb-4 px-3 py-2 rounded-pill shadow-sm">{user.role}</span>
          
          <div className="d-flex flex-column gap-3 text-start mt-2 px-md-4">
            <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-3">
              <Mail className="text-secondary" />
              <div>
                <small className="text-secondary d-block fw-semibold h6 m-0">Email</small>
                <span className="text-dark">{user.email}</span>
              </div>
            </div>
            <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-3">
              <Phone className="text-secondary" />
              <div>
                <small className="text-secondary d-block fw-semibold h6 m-0">Điện thoại</small>
                <span className="text-dark">{user.phone}</span>
              </div>
            </div>
            <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-3">
              <MapPin className="text-secondary" />
              <div>
                <small className="text-secondary d-block fw-semibold h6 m-0">Văn phòng</small>
                <span className="text-dark">{user.office}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
