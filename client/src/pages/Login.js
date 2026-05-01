import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    const { error } = isSignUp
      ? await supabase.auth.signUp({email, password })
      : await supabase.auth.signInWithPassword({email, password });
    if (error) setError(error.message);
  };

  return (
    <div className="card">
      <h2>{isSignUp ? 'Create Account': 'Log In'}</h2>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      {error && <p className="error">{error}</p>}
      <button onClick={handleSubmit}>{isSignUp ? 'Sign Up' : 'Log In'}</button>
      <p onClick={() => setIsSignUp(!isSignUp)} style={{ cursor: 'pointer', color: 'blue' }}>
        {isSignUp ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
      </p>
    </div>
  );
}

export default Login;
