import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, ChevronDown } from 'lucide-react';
import './Attendance.css';

export default function AttendanceStats() {
  const data = [
    { name: 'L01', present: 80, absent: 20 },
    { name: 'L02', present: 65, absent: 35 },
    { name: 'L03', present: 90, absent: 10 },
    { name: 'L04', present: 50, absent: 50 },
    { name: 'L05', present: 75, absent: 25 },
  ];

  return (
    <div className="content-container">
      <div className="stats-card">
        <div className="stats-top">
          <span className="board-title">Thống kê lớp học</span>
          <div className="stats-legend">
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#8884d8' }}></div>
              <span>Có mặt</span>
            </div>
            <div className="legend-item">
              <div className="legend-color absent"></div>
              <span>Vắng/Trễ</span>
            </div>
            <button className="board-btn" style={{ marginLeft: '10px' }}>
              <Download size={18} /> Xuất <ChevronDown size={14}/>
            </button>
          </div>
        </div>

        <div className="chart-container">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip cursor={{fill: '#f8fafc'}} />
              <Bar dataKey="present" fill="#8884d8" name="Có mặt" radius={[4, 4, 0, 0]} />
              <Bar dataKey="absent" fill="#ef4444" name="Vắng/Trễ" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
