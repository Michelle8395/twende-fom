import React, { useState } from 'react';
import { LogIn, UserCircle, Mail } from 'lucide-react';

const Login: React.FC<{ setUser: (user: any) => void }> = ({ setUser }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5001/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
      });
      const user = await res.json();
      localStorage.setItem('tf_user', JSON.stringify(user));
      setUser(user);
    } catch (err) {
      console.error(err);
      alert('Failed to connect to server. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '400px', padding: '40px 32px' }}>
        <div className="text-center" style={{ marginBottom: '32px' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            background: 'var(--primary)', 
            borderRadius: '18px', 
            display: 'grid', 
            placeItems: 'center', 
            margin: '0 auto 20px',
            boxShadow: '0 8px 24px var(--primary-glow)'
          }}>
            <LogIn color="white" size={32} />
          </div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Twende Fom</h1>
          <p>Pool resources, hit goals, and enjoy with your circle.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label><UserCircle size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Full Name</label>
            <input 
              type="text" 
              placeholder="e.g. Michelle Wanjiru" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label><Mail size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Email Address</label>
            <input 
              type="email" 
              placeholder="michelle@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="primary" style={{ width: '100%', marginTop: '10px' }} disabled={loading}>
            {loading ? 'Joining the Fom...' : 'Get Started'}
          </button>
        </form>

        <p style={{ marginTop: '24px', fontSize: '0.85rem' }} className="text-center">
          By joining, you agree to our <span style={{ color: 'var(--secondary)', cursor: 'pointer' }}>Terms of Service</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
