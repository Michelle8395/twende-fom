import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type AuthView = 'login' | 'signup' | 'forgot';

const Login: React.FC<{ setUser: (u: any) => void }> = ({ setUser }) => {
  const [view, setView] = useState<AuthView>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (view === 'signup') {
      try {
        const res = await fetch('http://localhost:5001/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email }),
        });
        const data = await res.json();
        localStorage.setItem('tf_user', JSON.stringify(data));
        setUser(data);
        navigate('/onboarding');
      } catch (err) {
        console.error('Signup failed', err);
      }
    } else if (view === 'login') {
      // Mock Login logic
      alert('Login logic is mocked for this prototype. Use Sign Up to create a profile!');
      setView('signup');
    } else {
      alert('Password reset link sent to your email! (Mocked)');
      setView('login');
    }
  };

  return (
    <div className="container text-center">
      <div style={{ marginTop: '80px' }}>
        <h1 style={{ color: 'var(--primary)', fontSize: '3rem', marginBottom: '10px' }}>Twende Fom</h1>
        <p style={{ marginBottom: '30px', color: '#666' }}>
          {view === 'login' && 'Welcome back! Log in to your Fom Club.'}
          {view === 'signup' && 'Create an account and start planning with friends.'}
          {view === 'forgot' && 'Reset your password to get back to the Fom.'}
        </p>

        <div className="card">
          <h2 style={{ marginBottom: '20px' }}>
            {view === 'login' && 'Log In'}
            {view === 'signup' && 'Sign Up'}
            {view === 'forgot' && 'Forgot Password'}
          </h2>

          <form onSubmit={handleAuth}>
            {view === 'signup' && (
              <div className="input-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Enter your name"
                  required
                />
              </div>
            )}

            <div className="input-group">
              <label>Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="you@example.com"
                required
              />
            </div>

            {view !== 'forgot' && (
              <div className="input-group">
                <label>Password</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="********"
                  required
                />
              </div>
            )}

            <button type="submit" className="primary" style={{ width: '100%', marginTop: '10px' }}>
              {view === 'login' && 'Log In'}
              {view === 'signup' && 'Create Account'}
              {view === 'forgot' && 'Send Reset Link'}
            </button>
          </form>

          <div style={{ marginTop: '20px', fontSize: '0.9rem' }}>
            {view === 'login' && (
              <>
                <p>
                  Don't have an account? <span onClick={() => setView('signup')} style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold' }}>Sign Up</span>
                </p>
                <p style={{ marginTop: '10px' }}>
                  <span onClick={() => setView('forgot')} style={{ color: '#666', cursor: 'pointer' }}>Forgot Password?</span>
                </p>
              </>
            )}

            {view === 'signup' && (
              <p>
                Already have an account? <span onClick={() => setView('login')} style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold' }}>Log In</span>
              </p>
            )}

            {view === 'forgot' && (
              <p>
                Remembered your password? <span onClick={() => setView('login')} style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold' }}>Log In</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
