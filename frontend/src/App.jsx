import React, { useState, createContext, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import History from './pages/History';

export const FlashContext = createContext(null);

function App() {
  const [messages, setMessages] = useState([]);

  const addFlashMessage = useCallback((text, type = 'success') => {
    const id = Date.now() + Math.random();
    setMessages((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setMessages((prev) => prev.filter((m) => m.id !== id));
    }, 3500);
  }, []);

  return (
    <FlashContext.Provider value={addFlashMessage}>
      <Router>
        <Sidebar />
        <main className="main-content">
          {/* Global Flash Messages */}
          <div className="flash-container">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flash-message ${msg.type}`}
                style={msg.type === 'error' ? { borderColor: '#EF4444' } : {}}
              >
                {msg.text}
              </div>
            ))}
          </div>
          
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </main>
      </Router>
    </FlashContext.Provider>
  );
}

export default App;
