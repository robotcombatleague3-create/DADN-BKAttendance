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
            <button className="board-btn" style={{ marginLeft: '10px' }}>
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
            <ResponsiveContainer width="100%" height="100%">
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
