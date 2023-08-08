import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Sidebar from "react-sidebar";
import { FaBars } from 'react-icons/fa';
import './App.css';
import HomePage from './pages/HomePage';
import Calendar from './pages/Calendar'
import AwardGenerator from './pages/AwardGenerator'
import AITrainer from './pages/AITrainer'
import AwardDisplay from './pages/AwardDisplay';
function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const onSetSidebarOpen = (open) => {
    setSidebarOpen(open);
  };

  const sidebarContent = (
    <div className="sidebar-content">
      <button onClick={() => onSetSidebarOpen(false)}>Close</button>
      <nav>
        <Link onClick={() => onSetSidebarOpen(false)} to="/">Generator</Link>
        <Link onClick={() => onSetSidebarOpen(false)} to="/aitrainer">AI Trainer</Link>
        <Link onClick={() => onSetSidebarOpen(false)} to="/award-dash">Award Dashboard</Link>
        {/* <Link onClick={() => onSetSidebarOpen(false)} to="/calendar">Calendar</Link> */}
        {/* <Link onClick={() => onSetSidebarOpen(false)} to="/questions">Question Section</Link> */}
      </nav>
    </div>
  );

  return (
    <div>
      <Router>
        <div className="app">
          {sidebarOpen && (
            <Sidebar
              sidebar={sidebarContent}
              open={sidebarOpen}
              onSetOpen={onSetSidebarOpen}
              styles={{ sidebar: { background: "white", width: "20vw", height: "100%", position: "fixed", zIndex: 2 }, overlay: { zIndex: 1 } }}
            />
          )}
          <button className="sidebar-toggle" onClick={() => onSetSidebarOpen(true)}>
            <FaBars />
          </button>
          <Routes>
            <Route path="/" element={<AwardGenerator />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/award-generator" element={<AwardGenerator />} />
            <Route path="/award-dash" element={<AwardDisplay />} />
            <Route path="/aitrainer" element={<AITrainer />} />
            {/* Other routes can be added here */}
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
