import React, {useEffect, useState} from 'react';
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

  if (loading) return <p>Loading...</p>;
  if (!user) return <Login />;
  
  return (
    <Router>
      <nav style={{ padding: '1rem', background: '#f0f0f0', marginBottom: '2rem' }}>
        <Link to="/" style={{ marginRight: '1rem' }}>Report Lost Item</Link>
        <Link to="/found" style={{ marginRight: '1rem' }}>Report Found Item</Link>
        <Link to="/matches" style={{ marginRight: '1rem' }}>View Matches</Link>
      </nav>
      <div style={{ padding: '0 2rem' }}>
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
