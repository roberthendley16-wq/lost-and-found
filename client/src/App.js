import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CreateLostItem from './pages/CreateLostItem';
import CreateFoundItem from './pages/CreateFoundItem';
import ViewMatches from './pages/ViewMatches';
import VerifyMatch from './pages/VerifyMatch';

function App() {
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
