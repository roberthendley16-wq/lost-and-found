import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CreateLostItem from './pages/CreateLostItem';
import CreateFoundItem from './pages/CreateFoundItem';
import ViewMatches from './pages/ViewMatches';
import VerifyMatch from './pages/VerifyMatch';
import Login from './pages/Login';
import { supabase } from './supabaseClient';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
  }, []);

  if (loading) return <p style={{ color: '#fff', padding: '2rem' }}>Loading...</p>;
  if (!user) return <Login />;

  return (
    <Router>
      <nav className="nav">
        <span className="nav-brand">Frostburg State Lost & Found Web Application</span>
        <div className="nav-links">
          <Link to="/">Report Lost Item Around Campus</Link>
          <Link to="/found">Report Found Item Around Campus</Link>
          <Link to="/matches">View Item Matches Around Campus</Link>
        </div>
        <button className="nav-logout" onClick={() => supabase.auth.signOut()}>Log Out</button>
      </nav>
      <div>
        <Routes>
          <Route path="/" element={<CreateLostItem />} />
          <Route path="/found" element={<CreateFoundItem />} />
          <Route path="/matches" element={<ViewMatches />} />
          <Route path="/verify/:lostItemId" element={<VerifyMatch />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
