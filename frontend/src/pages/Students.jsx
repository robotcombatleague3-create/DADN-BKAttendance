import { useState, useEffect, useContext, useRef } from 'react';
import { getStudents, assignRfid } from '../services/api';
import { FlashContext } from '../App';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState({ id: '', name: 'Chưa chọn' });
  const [rfidUid, setRfidUid] = useState('');
  const rfidInputRef = useRef(null);
  const showFlashMessage = useContext(FlashContext);

  const loadData = async () => {
    try {
      const data = await getStudents();
      setStudents(data);
    } catch (err) {
      console.error(err);
      showFlashMessage('Lỗi tải danh sách sinh viên', 'error');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelect = (id, name) => {
    setSelectedStudent({ id, name });
    if (rfidInputRef.current) {
      rfidInputRef.current.focus();
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedStudent.id) {
      showFlashMessage('Vui lòng chọn sinh viên cần gán mã', 'error');
      return;
    }

    try {
      const res = await assignRfid(selectedStudent.id, rfidUid);
      if (res.success) {
        showFlashMessage(res.message, 'success');
        setRfidUid('');
        setSelectedStudent({ id: '', name: 'Chưa chọn' });
        loadData(); // Tải lại danh sách
      } else {
        showFlashMessage(res.message || 'Lỗi gán mã', 'error');
      }
    } catch (error) {
      console.error(error);
      showFlashMessage('Lỗi kết nối Server', 'error');
    }
  };

  return (
    <>
      <div className="header">
        <h1>Quản lý Sinh viên</h1>
      </div>

      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', color: '#fff' }}>Gán Thẻ RFID</h2>
        <form onSubmit={handleAssign}>
          <div className="form-group">
            <label>Sinh viên đã chọn:</label>
            <div style={{ color: '#10B981', fontWeight: 600, fontSize: '1.1rem', marginBottom: '1rem' }}>
              {selectedStudent.name}
            </div>
            <input type="hidden" value={selectedStudent.id} />
          </div>
          
          <div className="form-group">
            <label htmlFor="rfid-uid">Mã RFID (Quẹt thẻ để tự động điền)</label>
            <input
              type="text"
              id="rfid-uid"
              placeholder="VD: A1 B2 C3 D4"
              value={rfidUid}
              onChange={(e) => setRfidUid(e.target.value)}
              ref={rfidInputRef}
              required
            />
          </div>
          
          <button type="submit" className="btn">Gắn Thẻ</button>
        </form>
      </div>

      <div className="glass-card">
        <h2 style={{ marginBottom: '1.5rem', color: '#fff' }}>Danh sách Sinh viên</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>MSSV</th>
                <th>Họ tên</th>
                <th>Mã RFID</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td><strong>{student.studentCode}</strong></td>
                  <td>{student.fullName}</td>
                  <td>
                    {student.rfidUid 
                      ? `Thẻ: ${student.rfidUid}` 
                      : <span style={{color:'#EF4444'}}>Chưa gán thẻ</span>}
                  </td>
                  <td>
                    <button 
                      type="button"
                      style={{
                        padding: '0.4rem 0.8rem',
                        borderRadius: '6px',
                        border: '1px solid #4F46E5',
                        background: 'transparent',
                        color: '#fff',
                        cursor: 'pointer'
                      }}
                      onClick={() => handleSelect(student.id, student.fullName)}
                    >
                      Chọn Gán thẻ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
