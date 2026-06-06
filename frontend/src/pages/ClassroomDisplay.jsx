import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const ClassroomDisplay = () => {
    // states: 'IDLE', 'SUCCESS', 'ERROR'
    const [status, setStatus] = useState('IDLE');
    const [studentData, setStudentData] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('vi-VN'));

    useEffect(() => {
        // Clock timer
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString('vi-VN'));
        }, 1000);

        // Socket.io connection
        const socket = io('http://localhost:3000');

        socket.on('new_attendance', (data) => {
            setStudentData(data);
            setStatus('SUCCESS');
            
            // Auto-revert to IDLE after 5 seconds
            setTimeout(() => {
                setStatus('IDLE');
                setStudentData(null);
            }, 5000);
        });

        socket.on('scan_error', (data) => {
            setErrorMessage(data.message || 'Thẻ không hợp lệ');
            setStatus('ERROR');
            
            // Auto-revert to IDLE after 5 seconds
            setTimeout(() => {
                setStatus('IDLE');
                setErrorMessage('');
            }, 5000);
        });

        return () => {
            clearInterval(timer);
            socket.disconnect();
        };
    }, []);

    // Styles matching the mockup
    const styles = {
        container: {
            minHeight: '100vh',
            backgroundColor: '#9edbf2',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        },
        header: {
            backgroundColor: '#0c588e',
            color: 'white',
            padding: '15px 30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            fontSize: '28px',
            fontWeight: '500'
        },
        logo: {
            position: 'absolute',
            left: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            backgroundColor: 'white',
            borderRadius: '4px'
        },
        content: {
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px'
        },
        idleBox: {
            display: 'flex',
            alignItems: 'center',
            gap: '50px'
        },
        iconLarge: {
            fontSize: '150px',
            color: '#000'
        },
        idleText: {
            fontSize: '56px',
            color: '#000',
            lineHeight: '1.3',
            maxWidth: '600px'
        },
        successBox: {
            display: 'flex',
            alignItems: 'center',
            gap: '50px'
        },
        avatarBox: {
            width: '300px',
            height: '300px',
            backgroundColor: '#dcf6b8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        avatarIcon: {
            fontSize: '180px',
            color: '#2a4411'
        },
        successText: {
            fontSize: '48px',
            color: '#000',
            lineHeight: '1.5',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
        },
        errorBox: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '30px'
        },
        errorIcon: {
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            border: '12px solid #ff0000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
        },
        errorCross1: {
            position: 'absolute',
            width: '100px',
            height: '12px',
            backgroundColor: '#ff0000',
            transform: 'rotate(45deg)'
        },
        errorCross2: {
            position: 'absolute',
            width: '100px',
            height: '12px',
            backgroundColor: '#ff0000',
            transform: 'rotate(-45deg)'
        },
        errorText: {
            fontSize: '48px',
            color: '#000'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div style={styles.logo}>
                    {/* Placeholder for BK Logo */}
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#0c588e" strokeWidth="2">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                </div>
                H6-301
            </div>

            <div style={styles.content}>
                {status === 'IDLE' && (
                    <div style={styles.idleBox}>
                        <svg width="200" height="250" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            {/* Card Outline */}
                            <rect x="5" y="2" width="10" height="15" rx="1"></rect>
                            {/* Hand/Finger overlaying card */}
                            <path d="M10 17v-5.5A1.5 1.5 0 0 1 11.5 10v0A1.5 1.5 0 0 1 13 11.5V17"></path>
                            <path d="M13 13.5v-1A1.5 1.5 0 0 1 14.5 11v0A1.5 1.5 0 0 1 16 12.5v3"></path>
                            <path d="M16 14.5v-1A1.5 1.5 0 0 1 17.5 12v0A1.5 1.5 0 0 1 19 13.5v3.5"></path>
                            <path d="M19 16.5v-1A1.5 1.5 0 0 1 20.5 14v0A1.5 1.5 0 0 1 22 15.5V19a6 6 0 0 1-6 6h-2a6 6 0 0 1-5.7-4.1l-2.1-6.4a1.5 1.5 0 0 1 2.8-1l1.5 4.5"></path>
                            <line x1="7" y1="5" x2="7" y2="7"></line>
                        </svg>
                        <div style={styles.idleText}>
                            <div>Vui lòng quẹt</div>
                            <div>thẻ điểm danh</div>
                            <div>trước khi vào lớp</div>
                            <div style={{ fontSize: '32px', color: '#333', marginTop: '20px' }}>
                                Thời gian thực: <strong>{currentTime}</strong>
                            </div>
                        </div>
                    </div>
                )}

                {status === 'SUCCESS' && studentData && (
                    <div style={styles.successBox}>
                        <div style={styles.avatarBox}>
                            <svg width="180" height="180" viewBox="0 0 24 24" fill="none" stroke="#2a4411" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="8" r="5"></circle>
                                <path d="M20 21a8 8 0 0 0-16 0"></path>
                            </svg>
                        </div>
                        <div style={styles.successText}>
                            <div>{studentData.name ? studentData.name.toUpperCase() : 'KHÔNG RÕ TÊN'}</div>
                            <div>MSSV: {studentData.student_code}</div>
                            <div>Lớp: Đang cập nhật</div>
                            <div style={{ fontSize: '36px', marginTop: '10px' }}>
                                Thời gian điểm danh: <strong>{studentData.time}</strong>
                            </div>
                        </div>
                    </div>
                )}

                {status === 'ERROR' && (
                    <div style={styles.errorBox}>
                        <div style={styles.errorIcon}>
                            <div style={styles.errorCross1}></div>
                            <div style={styles.errorCross2}></div>
                        </div>
                        <div style={styles.errorText}>
                            {errorMessage}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClassroomDisplay;
