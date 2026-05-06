import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, ChevronDown } from 'lucide-react';
import './Attendance.css';

export default function AttendanceStats() {
  const { classId } = useParams();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3000/api/stats/class/${classId}`)
      .then(res => res.json())
      .then(resData => {
        if (resData.success) {
          const stats = resData.data;
          // Transform for BarChart
          setData([
            { 
              name: `Lớp ID: ${classId}`, 
              present: stats.present, 
              late: stats.late,
              absent: stats.absent 
            }
          ]);
        }
      })
      .catch(err => console.error("Error fetching stats:", err))
      .finally(() => setIsLoading(false));
  }, [classId]);

  const handleExportStats = () => {
    if (!data || data.length === 0) {
      alert('Không có dữ liệu để xuất');
      return;
    }

    const headers = ['Lớp', 'Sĩ số', 'Có mặt', 'Vắng', 'Đi trễ', 'Tỷ lệ chuyên cần (%)'];
    
    const rows = data.map(item => {
      const total = item.present + item.late + item.absent;
      const rate = total > 0 ? (((item.present + item.late) / total) * 100).toFixed(2) : 0;
      return `"${item.name}","${total}","${item.present}","${item.absent}","${item.late}","${rate}%"`;
    });

    const csvContent = headers.join(',') + '\n' + rows.join('\n');
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `ThongKe_ChuyenCan_CacLop.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="content-container">
      <div className="stats-card">
        <div className="stats-top">
          <span className="board-title">Thống kê lớp học (ID: {classId})</span>
          <div className="stats-legend">
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#22c55e' }}></div>
              <span>Có mặt</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#f59e0b' }}></div>
              <span>Đi trễ</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#ef4444' }}></div>
              <span>Vắng mặt</span>
            </div>
            <button className="board-btn" style={{ marginLeft: '10px' }} onClick={handleExportStats}>
              <Download size={18} /> Xuất <ChevronDown size={14}/>
            </button>
          </div>
        </div>

        <div className="chart-container">
          {isLoading ? (
            <div className="d-flex justify-content-center align-items-center h-100">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="present" fill="#22c55e" name="Có mặt" radius={[4, 4, 0, 0]} />
                <Bar dataKey="late" fill="#f59e0b" name="Đi trễ" radius={[4, 4, 0, 0]} />
                <Bar dataKey="absent" fill="#ef4444" name="Vắng mặt" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
