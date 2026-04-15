import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import GroupDetail from './pages/GroupDetail';
import Onboarding from './pages/Onboarding';
import './styles/global.css';

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('tf_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} />} />
          <Route path="/onboarding" element={user ? <Onboarding user={user} /> : <Navigate to="/" />} />
          <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/" />} />
          <Route path="/group/:id" element={user ? <GroupDetail user={user} /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
