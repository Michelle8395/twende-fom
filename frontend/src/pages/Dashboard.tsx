import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, LogOut, TrendingUp, Users, Target } from 'lucide-react';
import ProgressRing from '../components/ProgressRing';
import StatBox from '../components/StatBox';

const Dashboard: React.FC<{ user: any }> = ({ user }) => {
  const [data, setData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5001/api/users/${user.id}/dashboard`)
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, [user.id]);

  const handleLogout = () => {
    localStorage.removeItem('tf_user');
    window.location.href = '/';
  };

  if (!data) return (
    <div className="container" style={{ display: 'grid', placeItems: 'center', minHeight: '80vh' }}>
      <div className="text-center">
        <div className="spinner" style={{ border: '3px solid var(--border)', borderTop: '3px solid var(--primary)', borderRadius: '50%', width: '30px', height: '30px', animation: 'spin 1s linear infinite', margin: '0 auto 15px' }}></div>
        <p>Loading your Foms...</p>
      </div>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const totalBalance = data.clubs.reduce((acc: number, club: any) => {
    const member = club.members.find((m: any) => m.userId === user.id);
    return acc + (member ? member.contributed : 0);
  }, 0);

  return (
    <div className="container">
      <header className="flex-between" style={{ padding: '24px 0 32px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Habari, {data.user.name.split(' ')[0]}! 👋</h2>
          <p style={{ fontSize: '0.85rem' }}>Fom ID: <span style={{ color: 'var(--secondary)', fontWeight: '600' }}>{data.user.fomId}</span></p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => navigate('/onboarding')} className="primary" style={{ padding: '10px' }}>
            <Plus size={20} />
          </button>
          <button onClick={handleLogout} className="secondary" style={{ padding: '10px', color: 'var(--danger)' }}>
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
        <StatBox 
          label="Total Saved" 
          value={`KES ${totalBalance.toLocaleString()}`} 
          icon={<TrendingUp size={18} />}
          color="var(--success)"
        />
        <StatBox 
          label="Active Foms" 
          value={data.clubs.length} 
          icon={<Users size={18} />}
          color="var(--secondary)"
        />
      </div>

      <div className="flex-between" style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '1.1rem' }}>Active Fom Clubs</h3>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: '600', cursor: 'pointer' }}>View All</span>
      </div>

      <div style={{ display: 'grid', gap: '16px' }}>
        {data.clubs.length === 0 ? (
          <div className="glass-card text-center" style={{ padding: '48px 24px' }}>
            <Target size={40} style={{ color: 'var(--text-dim)', marginBottom: '16px' }} />
            <p style={{ marginBottom: '20px' }}>No active groups. Why not start a "Fom" today?</p>
            <button onClick={() => navigate('/onboarding')} className="primary">Create New Fom</button>
          </div>
        ) : (
          data.clubs.map((club: any) => {
            const progress = Math.min(100, Math.round((club.currentAmount / club.targetAmount) * 100));
            return (
              <div 
                key={club.id} 
                className="glass-card flex-between" 
                onClick={() => navigate(`/group/${club.id}`)}
                style={{ cursor: 'pointer', padding: '20px' }}
              >
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>{club.name}</h4>
                  <p style={{ fontSize: '0.8rem', marginBottom: '12px' }}>{club.description.substring(0, 45)}...</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Users size={14} color="var(--text-dim)" />
                        <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>{club.members.length}</span>
                    </div>
                    <div style={{ height: '4px', width: '4px', borderRadius: '50%', background: 'var(--text-dim)' }} />
                    <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--secondary)' }}>KES {club.targetAmount.toLocaleString()} Goal</span>
                  </div>
                </div>
                <div style={{ position: 'relative', display: 'grid', placeItems: 'center' }}>
                    <ProgressRing radius={34} stroke={4} progress={progress} />
                    <span style={{ position: 'absolute', fontSize: '0.75rem', fontWeight: '800' }}>{progress}%</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="glass-card" style={{ marginTop: '32px', background: 'linear-gradient(135deg, var(--bg-card) 0%, #1c2641 100%)', border: '1px solid var(--primary-glow)' }}>
        <div className="flex-between" style={{ marginBottom: '16px' }}>
            <h4 style={{ color: 'var(--primary)' }}>Quick Tip</h4>
            <Target size={18} color="var(--primary)" />
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', opacity: 0.9 }}>
            Consistency is key! Regular contributions help the group reach milestones faster. Did you know 70% of Foms hit their goal 2 weeks early?
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
