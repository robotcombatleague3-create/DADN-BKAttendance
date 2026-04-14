import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, ChevronDown } from 'lucide-react';
import './Attendance.css';

export default function AdminAttendanceStats() {
  // Stacked chart dummy data
  const data = [
    { name: 'L01', present: 50, late: 20, absent: 30 },
    { name: 'L02', present: 60, late: 10, absent: 15 },
    { name: 'L03', present: 80, late: 15, absent: 10 },
    { name: 'L04', present: 45, late: 25, absent: 50 },
    { name: 'L05', present: 65, late: 15, absent: 25 },
  ];

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
        </div>
      </div>
    </div>
  );
}
