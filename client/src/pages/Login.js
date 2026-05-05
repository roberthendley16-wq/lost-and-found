import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleSubmit = async () => {
    setError(null);
    setMessage(null);
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else setMessage('Check your email to confirm your account!');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#111' }}>
      <div style={{ width: '100%', maxWidth: '380px', padding: '0 1rem' }}>
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '32px', letterSpacing: '3px', color: '#c8102e', lineHeight: 1 }}>
            Frostburg State Lost & Found
          </h1>
          <p style={{ fontSize: '13px', color: '#666', marginTop: '6px' }}>Web Application</p>
        </div>
        <div className="card">
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label">Email address</label>
            <input type="email" placeholder="you@frostburg.edu" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label">Password</label>
            <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          {error && <p className="error">{error}</p>}
          {message && <p className="success">{message}</p>}
          <button className="primary" style={{ width: '100%' }} onClick={handleSubmit}>
            {isSignUp ? 'Create Account' : 'Log In'}
          </button>
        </div>
        <p onClick={() => { setIsSignUp(!isSignUp); setError(null); setMessage(null); }}
          style={{ textAlign: 'center', fontSize: '13px', color: '#c8102e', cursor: 'pointer', marginTop: '1rem' }}>
          {isSignUp ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
        </p>
      </div>
    </div>
  );
}

export default Login;
