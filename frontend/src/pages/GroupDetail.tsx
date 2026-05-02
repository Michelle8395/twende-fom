import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Send, Users, History, Calendar } from 'lucide-react';
import ProgressRing from '../components/ProgressRing';
import ActivityItem from '../components/ActivityItem';
import { api } from '../api';

const GroupDetail: React.FC<{ user: any }> = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchDetails = useCallback(() => {
    if (!id) return;
    api.getClub(id)
      .then(setData)
      .catch(console.error);
  }, [id]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const handleContribute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !amount || parseFloat(amount) <= 0) return;

    setLoading(true);
    try {
      await api.contribute(id, user.id, parseFloat(amount));
      setAmount('');
      fetchDetails();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!data) return <div className="container text-center" style={{ marginTop: '50px' }}>Loading...</div>;

  const { club, activities } = data;
  const progress = Math.min(100, Math.round((club.currentAmount / club.targetAmount) * 100));
  const myContribution = club.members.find((m: any) => m.userId === user.id)?.contributed || 0;

  return (
    <div className="container">
      <header className="flex-between" style={{ padding: '24px 0' }}>
        <button onClick={() => navigate('/dashboard')} className="secondary" style={{ padding: '8px 12px' }}>
          <ChevronLeft size={20} />
        </button>
        <h3 style={{ fontSize: '1.1rem' }}>Fom Details</h3>
        <div style={{ width: '44px' }}></div>
      </header>

      <section className="glass-card text-center" style={{ marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'var(--primary-glow)', filter: 'blur(60px)', borderRadius: '50%' }}></div>

        <div style={{ position: 'relative', display: 'inline-grid', placeItems: 'center', marginBottom: '20px' }}>
          <ProgressRing radius={70} stroke={8} progress={progress} glow={true} />
          <div style={{ position: 'absolute' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: '800', display: 'block' }}>{progress}%</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: '600' }}>FUNDED</span>
          </div>
        </div>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{club.name}</h2>
        <p style={{ fontSize: '0.9rem', marginBottom: '20px', maxWidth: '300px', margin: '0 auto 20px' }}>{club.description}</p>

        <div className="flex-between" style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '16px' }}>
          <div>
            <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: '600', marginBottom: '4px' }}>COLLECTED</span>
            <span style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--secondary)' }}>KES {club.currentAmount.toLocaleString()}</span>
          </div>
          <div style={{ width: '1px', height: '30px', background: 'var(--border)' }}></div>
          <div>
            <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: '600', marginBottom: '4px' }}>TARGET</span>
            <span style={{ fontSize: '1.1rem', fontWeight: '700' }}>KES {club.targetAmount.toLocaleString()}</span>
          </div>
        </div>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div className="glass-card" style={{ padding: '16px' }}>
          <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: '600', marginBottom: '8px' }}>MY SHARE</span>
          <span style={{ fontSize: '1.1rem', fontWeight: '700' }}>KES {myContribution.toLocaleString()}</span>
        </div>
        <div className="glass-card" style={{ padding: '16px' }}>
          <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: '600', marginBottom: '8px' }}>EVENT DATE</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={14} color="var(--primary)" />
            <span style={{ fontSize: '0.9rem', fontWeight: '700' }}>
              {club.nextEventDate ? new Date(club.nextEventDate).toLocaleDateString() : 'TBD'}
            </span>
          </div>
        </div>
      </div>

      <section className="glass-card" style={{ marginBottom: '24px' }}>
        <h4 style={{ marginBottom: '16px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Send size={16} color="var(--secondary)" /> Contribute to Fom
        </h4>
        <form onSubmit={handleContribute} style={{ display: 'flex', gap: '12px' }}>
          <input
            type="number"
            placeholder="Amount (KES)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ flex: 1 }}
          />
          <button type="submit" className="primary" disabled={loading}>
            {loading ? '...' : 'Send'}
          </button>
        </form>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <div className="flex-between" style={{ marginBottom: '16px' }}>
          <h4 style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <History size={16} color="var(--text-dim)" /> Recent Activity
          </h4>
        </div>
        <div className="glass-card">
          {activities.length === 0 ? (
            <p style={{ fontSize: '0.9rem', textAlign: 'center' }}>No activity yet.</p>
          ) : (
            activities.map((act: any) => <ActivityItem key={act.id} activity={act} />)
          )}
        </div>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h4 style={{ marginBottom: '16px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={16} color="var(--text-dim)" /> Members ({club.members.length})
        </h4>
        <div style={{ display: 'grid', gap: '12px' }}>
          {club.members.map((member: any) => (
            <div key={member.userId} className="glass-card flex-between" style={{ padding: '12px 16px', borderRadius: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', display: 'grid', placeItems: 'center', fontWeight: '700', fontSize: '0.8rem' }}>
                  {member.name.charAt(0)}
                </div>
                <div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: '600' }}>
                    {member.name} {member.userId === user.id && '(Me)'}
                  </p>
                  <p style={{ fontSize: '0.7rem' }}>
                    {member.role === 'admin' ? 'Organizer' : 'Contributor'}
                  </p>
                </div>
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>
                KES {member.contributed.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default GroupDetail;