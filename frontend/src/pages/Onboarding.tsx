import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, UserPlus, ArrowRight, Wallet, Users, Layout } from 'lucide-react';
import { api } from '../api';

const Onboarding: React.FC<{ user: any }> = ({ user }) => {
  const [mode, setMode] = useState<'choice' | 'create' | 'join'>('choice');
  const [formData, setFormData] = useState({ name: '', description: '', targetAmount: '', clubId: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const club = await api.createClub({ ...formData, creatorId: user.id });
      navigate(`/group/${club.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const club = await api.joinClub(formData.clubId, user.id);
      navigate(`/group/${club.id}`);
    } catch (err) {
      console.error(err);
      alert('Club not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ minHeight: '90vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <button 
        onClick={() => mode === 'choice' ? navigate('/dashboard') : setMode('choice')} 
        className="secondary" 
        style={{ width: 'fit-content', marginBottom: '24px' }}
      >
        Cancel
      </button>

      {mode === 'choice' && (
        <div style={{ display: 'grid', gap: '20px' }}>
          <div className="text-center" style={{ marginBottom: '20px' }}>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Start Your Fom</h1>
            <p>Choose how you want to begin pooling resources.</p>
          </div>

          <div className="glass-card flex-between" onClick={() => setMode('create')} style={{ cursor: 'pointer', padding: '32px' }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div style={{ background: 'var(--primary-glow)', padding: '16px', borderRadius: '16px' }}>
                <PlusCircle color="var(--primary)" size={32} />
              </div>
              <div>
                <h3 style={{ marginBottom: '4px' }}>Create a New Fom</h3>
                <p style={{ fontSize: '0.85rem' }}>Start a fresh goal for your circle.</p>
              </div>
            </div>
            <ArrowRight size={20} color="var(--text-dim)" />
          </div>

          <div className="glass-card flex-between" onClick={() => setMode('join')} style={{ cursor: 'pointer', padding: '32px' }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div style={{ background: 'var(--secondary-glow)', padding: '16px', borderRadius: '16px' }}>
                <UserPlus color="var(--secondary)" size={32} />
              </div>
              <div>
                <h3 style={{ marginBottom: '4px' }}>Join Existing Fom</h3>
                <p style={{ fontSize: '0.85rem' }}>Enter a Club ID to join your friends.</p>
              </div>
            </div>
            <ArrowRight size={20} color="var(--text-dim)" />
          </div>
        </div>
      )}

      {mode === 'create' && (
        <div className="glass-card">
          <h2 style={{ marginBottom: '24px' }}>New Fom Club</h2>
          <form onSubmit={handleCreate}>
            <div className="input-group">
              <label><Layout size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Fom Name</label>
              <input 
                type="text" 
                placeholder="e.g. Zanzibar Trip 🏝️" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div className="input-group">
              <label>Description</label>
              <textarea 
                placeholder="What's the plan? Be specific!" 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
                rows={3}
              />
            </div>
            <div className="input-group">
              <label><Wallet size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Target Amount (KES)</label>
              <input 
                type="number" 
                placeholder="50000" 
                value={formData.targetAmount}
                onChange={(e) => setFormData({...formData, targetAmount: e.target.value})}
                required
              />
            </div>
            <button type="submit" className="primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Creating...' : 'Launch Fom'}
            </button>
          </form>
        </div>
      )}

      {mode === 'join' && (
        <div className="glass-card">
          <h2 style={{ marginBottom: '24px' }}>Join a Fom</h2>
          <form onSubmit={handleJoin}>
            <div className="input-group">
              <label><Users size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Club ID</label>
              <input 
                type="text" 
                placeholder="e.g. CLUB-1234" 
                value={formData.clubId}
                onChange={(e) => setFormData({...formData, clubId: e.target.value})}
                required
              />
            </div>
            <button type="submit" className="primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Joining...' : 'Find & Join'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Onboarding;
