import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, ChevronDown } from 'lucide-react';
import { getOverallStats } from '../../services/api';
import './Attendance.css';

export default function AdminAttendanceStats() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const stats = await getOverallStats();
        setData(stats);
      } catch (error) {
        console.error("Lỗi khi tải thống kê:", error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const handleExportStats = () => {
    if (!data || data.length === 0) {
      alert('Không có dữ liệu để xuất');
      return;
    }

    const headers = ['Tên lớp', 'Sĩ số', 'Có mặt', 'Đi trễ', 'Vắng'];
    
    const rows = data.map(c => {
      const total = (c.present || 0) + (c.late || 0) + (c.absent || 0);
      return `"${c.name}","${total}","${c.present || 0}","${c.late || 0}","${c.absent || 0}"`;
    });

    const csvContent = headers.join(',') + '\n' + rows.join('\n');
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    const dateStr = new Date().toLocaleDateString('vi-VN').replace(/\//g, '-');
    link.download = `ThongKe_ToanTruong_Ngay_${dateStr}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="content-container w-full h-full flex flex-col flex-1">
      <div className="stats-card flex-1 flex flex-col w-full h-full">
        <div className="stats-top">
          <span className="board-title">Thống kê lớp học toàn trường</span>
          <div className="stats-legend">
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#60a5fa' }}></div>
              <span>Có mặt</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#fde047' }}></div>
              <span>Đi trễ</span>
            </div>
            <div className="legend-item">
              <div className="legend-color absent" style={{ backgroundColor: '#ef4444' }}></div>
              <span>Vắng</span>
            </div>
            <button className="board-btn" style={{ marginLeft: '10px' }} onClick={handleExportStats}>
              <Download size={18} /> Xuất <ChevronDown size={14}/>
            </button>
          </div>
        </div>

        <div className="chart-container flex-1 w-full h-full" style={{ minHeight: '500px' }}>
          {loading ? (
             <div className="text-center p-5 text-secondary">Đang tải dữ liệu biểu đồ...</div>
          ) : data.length === 0 ? (
             <div className="text-center p-5 text-secondary">Chưa có dữ liệu thống kê.</div>
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
                
                {/* Stacked columns for Present and Late */}
                <Bar dataKey="late" stackId="a" fill="#fde047" name="Đi trễ" />
                <Bar dataKey="present" stackId="a" fill="#60a5fa" name="Có mặt" radius={[4, 4, 0, 0]} />
                
                {/* Independent column for Absent */}
                <Bar dataKey="absent" fill="#ef4444" name="Vắng" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
