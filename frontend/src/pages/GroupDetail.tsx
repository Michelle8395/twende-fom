import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const GroupDetail: React.FC<{ user: any }> = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<{ club: any, activities: any[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showMpesaModal, setShowMpesaModal] = useState(false);
  const [mpesaAmount, setMpesaAmount] = useState('');
  const [mpesaPin, setMpesaPin] = useState('');

  const fetchData = async () => {
    try {
      const res = await fetch(`http://localhost:5001/api/clubs/${id}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error('Fom Club not found. It might have been deleted or the server restarted.');
        throw new Error('Failed to fetch club details.');
      }
      const result = await res.json();
      setData(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleLogout = () => {
    localStorage.removeItem('tf_user');
    window.location.href = '/';
  };

  const handleMpesaPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mpesaAmount || !mpesaPin) return;
    
    try {
      const res = await fetch(`http://localhost:5001/api/clubs/${id}/contribute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, amount: mpesaAmount }),
      });
      const result = await res.json();
      setData(result);
      setShowMpesaModal(false);
      setMpesaAmount('');
      setMpesaPin('');
      alert(`STK Push Sent! Contribution of KES ${mpesaAmount} recorded.`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleNudge = (memberName: string) => {
    alert(`📢 Friendly reminder sent to ${memberName} via WhatsApp!`);
  };

  if (error) {
    return (
      <div className="container text-center" style={{ marginTop: '50px' }}>
        <div className="card">
          <h2 style={{ color: 'var(--danger)' }}>Error</h2>
          <p>{error}</p>
          <button className="primary" style={{ marginTop: '20px' }} onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  if (!data) return <div className="container text-center" style={{ marginTop: '50px' }}>Loading Fom Group...</div>;
  
  const { club, activities } = data;
  const progressPercent = Math.round((club.currentAmount / club.targetAmount) * 100);

  return (
    <div className="container">
      <header className="flex-between" style={{ padding: '20px 0' }}>
        <button onClick={() => navigate('/dashboard')} style={{ background: 'none' }}>← Back</button>
        <h3>{club.name}</h3>
        <button onClick={handleLogout} style={{ background: 'none', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '5px 10px' }}>Logout</button>
      </header>

      {progressPercent >= 100 && (
        <div className="card text-center" style={{ background: 'var(--success)', color: 'white', animation: 'bounce 1s infinite' }}>
          🎉 100% FUNDED! LET'S GO! 🎉
        </div>
      )}

      <section className="card text-center">
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '20px' }}>
          <svg width="120" height="120">
            <circle cx="60" cy="60" r="50" stroke="#eee" strokeWidth="10" fill="none" />
            <circle 
              cx="60" cy="60" r="50" 
              stroke="var(--secondary)" 
              strokeWidth="10" 
              fill="none" 
              strokeDasharray="314" 
              strokeDashoffset={314 - (314 * Math.min(1, club.currentAmount / club.targetAmount))}
              style={{ transition: 'stroke-dashoffset 0.5s ease-out', transform: 'rotate(-90deg)', transformOrigin: 'center' }}
            />
          </svg>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontWeight: 'bold', fontSize: '1.2rem' }}>
            {progressPercent}%
          </div>
        </div>
        <h4>Collected: KES {club.currentAmount} / {club.targetAmount}</h4>
        <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Target: {club.targetAmount}</p>
      </section>

      <section className="card">
        <div className="flex-between">
          <h3>Activity Feed</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 'bold' }}>Live 🟢</span>
        </div>
        <div style={{ marginTop: '10px', maxHeight: '150px', overflowY: 'auto' }}>
          {activities.map((act) => (
            <div key={act.id} style={{ fontSize: '0.85rem', padding: '8px 0', borderBottom: '1px solid #f0f0f0', display: 'flex', gap: '10px' }}>
              <span>{act.type === 'payment' ? '💰' : act.type === 'milestone' ? '🚀' : 'ℹ️'}</span>
              <div>
                <p>{act.message}</p>
                <small style={{ opacity: 0.5 }}>{new Date(act.timestamp).toLocaleTimeString()}</small>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <h3>Members & Accountability</h3>
        <div style={{ marginTop: '10px' }}>
          {club.members.map((member: any) => (
            <div key={member.userId} className="flex-between" style={{ padding: '12px 0', borderBottom: '1px solid #eee' }}>
              <div>
                <span style={{ fontWeight: member.userId === user.id ? 'bold' : 'normal' }}>
                  {member.name} {member.userId === user.id && '(You)'}
                </span>
                <br />
                <small style={{ color: member.role === 'admin' ? 'var(--primary)' : '#666' }}>{member.role}</small>
              </div>
              <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div>
                  <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>KES {member.contributed}</span>
                  <br />
                  <small>{Math.round((member.contributed / (club.targetAmount / club.members.length)) * 100)}% of share</small>
                </div>
                {member.userId !== user.id && member.contributed < (club.targetAmount / club.members.length) && (
                  <button 
                    onClick={() => handleNudge(member.name)}
                    title="Send Reminder"
                    style={{ background: '#FFF3CD', border: '1px solid #FFE69C', padding: '5px 8px', fontSize: '1rem' }}
                  >
                    🔔
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <h3>Contribution</h3>
        <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '15px' }}>
          Contributions are managed via M-PESA for full transparency and real-time tracking.
        </p>
        
        <button 
          className="secondary" 
          style={{ width: '100%', background: '#00C323', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }} 
          onClick={() => setShowMpesaModal(true)}
        >
          <span style={{ fontWeight: 'bold' }}>Lipa na M-PESA</span>
        </button>
      </section>

      <div className="text-center" style={{ margin: '20px' }}>
        <p style={{ fontSize: '0.9rem', color: '#666' }}>Share this Club ID with friends to join:</p>
        <code style={{ background: '#eee', padding: '5px 15px', borderRadius: '5px', fontSize: '1.1rem', fontWeight: 'bold', display: 'inline-block', marginTop: '10px' }}>
            {club.clubId}
        </code>
      </div>

      {showMpesaModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.5)', display: 'grid', placeContent: 'center', zIndex: 1000
        }}>
          <div className="card" style={{ width: '320px', margin: 0 }}>
            <h3 style={{ color: '#00C323' }}>M-PESA Payment</h3>
            <p style={{ fontSize: '0.8rem', marginBottom: '15px' }}>Enter details to trigger STK Push</p>
            
            <form onSubmit={handleMpesaPayment}>
              <div className="input-group">
                <label>Amount (KES)</label>
                <input 
                  type="number" 
                  value={mpesaAmount} 
                  onChange={(e) => setMpesaAmount(e.target.value)} 
                  placeholder="e.g. 500" 
                  required 
                />
              </div>
              <div className="input-group">
                <label>M-PESA PIN (Placeholder)</label>
                <input 
                  type="password" 
                  value={mpesaPin} 
                  onChange={(e) => setMpesaPin(e.target.value)} 
                  placeholder="****" 
                  maxLength={4}
                  required 
                />
              </div>
              <button type="submit" className="secondary" style={{ width: '100%', background: '#00C323' }}>
                Confirm Payment
              </button>
              <button 
                type="button" 
                style={{ width: '100%', background: 'none', marginTop: '10px', color: '#666' }} 
                onClick={() => setShowMpesaModal(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupDetail;
