import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC<{ user: any }> = ({ user }) => {
  const [data, setData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5001/api/users/${user.id}/dashboard`)
      .then(res => res.json())
      .then(setData);
  }, [user.id]);

  const handleLogout = () => {
    localStorage.removeItem('tf_user');
    window.location.href = '/';
  };

  if (!data) return <div className="container">Loading Dashboard...</div>;

  return (
    <div className="container">
      <header className="flex-between" style={{ padding: '20px 0' }}>
        <h2 style={{ color: 'var(--primary)' }}>Twende Fom</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => navigate('/onboarding')} className="primary" style={{ padding: '8px 15px' }}>+ New Fom</button>
          <button onClick={handleLogout} style={{ background: 'none', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '8px 15px' }}>Logout</button>
        </div>
      </header>

      <section className="card" style={{ background: 'var(--dark)', color: 'white' }}>
        <h3>Habari, {data.user.name}</h3>
        <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>Member since: {new Date(data.user.joinDate).toLocaleDateString()}</p>
        <div style={{ marginTop: '15px' }}>
          <span style={{ background: 'rgba(255,255,255,0.1)', padding: '5px 10px', borderRadius: '5px' }}>
            Fom ID: {data.user.fomId}
          </span>
        </div>
      </section>

      <h3>My Active Foms</h3>
      <div style={{ display: 'grid', gap: '15px', marginTop: '15px' }}>
        {data.clubs.length === 0 ? (
          <p className="text-center" style={{ padding: '40px' }}>No active groups. Start a new one!</p>
        ) : (
          data.clubs.map((club: any) => (
            <div 
              key={club.id} 
              className="card" 
              onClick={() => navigate(`/group/${club.id}`)}
              style={{ cursor: 'pointer', borderLeft: '5px solid var(--secondary)' }}
            >
              <div className="flex-between">
                <div>
                  <h4>{club.name}</h4>
                  <p style={{ fontSize: '0.8rem', color: '#666' }}>ID: {club.clubId}</p>
                </div>
                <div className="text-right">
                  <p style={{ fontWeight: 'bold' }}>{Math.round((club.currentAmount / club.targetAmount) * 100)}%</p>
                  <p style={{ fontSize: '0.7rem' }}>Collected</p>
                </div>
              </div>
              <div style={{ background: '#eee', height: '8px', borderRadius: '4px', marginTop: '10px' }}>
                <div 
                  style={{ 
                    background: 'var(--secondary)', 
                    height: '100%', 
                    borderRadius: '4px',
                    width: `${Math.min(100, (club.currentAmount / club.targetAmount) * 100)}%`
                  }} 
                />
              </div>
            </div>
          ))
        )}
      </div>

      <section className="card" style={{ marginTop: '30px', border: '1px dashed var(--gray)' }}>
        <h4>Personal Goals (Savings)</h4>
        <p style={{ fontSize: '0.9rem', color: '#666' }}>Save 5000 KES in 4 weeks</p>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
            <div style={{ width: '50px', height: '50px', border: '4px solid var(--primary)', borderRadius: '50%', display: 'grid', placeContent: 'center', fontWeight: 'bold', fontSize: '0.8rem' }}>
                25%
            </div>
            <p style={{ marginLeft: '15px', fontWeight: '500' }}>For Mombasa Trip</p>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
