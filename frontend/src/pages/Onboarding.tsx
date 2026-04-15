import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Onboarding: React.FC<{ user: any }> = ({ user }) => {
  const [clubName, setClubName] = useState('');
  const [target, setTarget] = useState('');
  const [joinId, setJoinId] = useState('');
  const [view, setView] = useState<'main' | 'create' | 'join'>('main');
  const navigate = useNavigate();

  const handleCreate = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/clubs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: clubName, 
          targetAmount: target, 
          creatorId: user.id,
          description: 'A new Fom Club'
        }),
      });
      const club = await res.json();
      navigate(`/group/${club.id}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleJoin = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/clubs/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clubId: joinId, userId: user.id }),
      });
      const club = await res.json();
      navigate(`/group/${club.id}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <div className="card text-center" style={{ marginTop: '50px' }}>
        <h2>Karibu, {user.name}!</h2>
        <p style={{ margin: '10px 0', fontSize: '1.2rem' }}>Your Fom ID: <strong style={{color: 'var(--primary)'}}>{user.fomId}</strong></p>
      </div>

      {view === 'main' && (
        <div style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
          <button className="primary" onClick={() => setView('create')}>Tupange Fom Mpya (Create Club)</button>
          <button className="secondary" onClick={() => setView('join')}>Join Existing Fom (Club ID)</button>
          <button style={{ background: 'none', border: '1px solid var(--gray)' }} onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
        </div>
      )}

      {view === 'create' && (
        <div className="card">
          <h3>Create Fom Club</h3>
          <div className="input-group">
            <label>Club Name</label>
            <input type="text" value={clubName} onChange={(e) => setClubName(e.target.value)} placeholder="e.g. Mombasa Roadtrip" />
          </div>
          <div className="input-group">
            <label>Target Amount (KES)</label>
            <input type="number" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="e.g. 50000" />
          </div>
          <button className="primary" style={{ width: '100%' }} onClick={handleCreate}>Launch Fom Club</button>
          <button style={{ width: '100%', marginTop: '10px', background: 'none' }} onClick={() => setView('main')}>Back</button>
        </div>
      )}

      {view === 'join' && (
        <div className="card">
          <h3>Join a Fom Club</h3>
          <div className="input-group">
            <label>Enter Club ID</label>
            <input type="text" value={joinId} onChange={(e) => setJoinId(e.target.value)} placeholder="e.g. CLUB-1234" />
          </div>
          <button className="secondary" style={{ width: '100%' }} onClick={handleJoin}>Join Group</button>
          <button style={{ width: '100%', marginTop: '10px', background: 'none' }} onClick={() => setView('main')}>Back</button>
        </div>
      )}
    </div>
  );
};

export default Onboarding;
