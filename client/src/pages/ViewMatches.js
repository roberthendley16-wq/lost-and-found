import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ViewMatches() {
  const [lostItemId, setLostItemId] = useState('');
  const [matches, setMatches] = useState([]);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const res = await axios.get(`https://lost-and-found-uffo.onrender.com/matches/${lostItemId}`);
      setMatches(res.data);
      setSearched(true);
      setError(null);
    } catch {
      setError('Could not find matches. Check your item ID.');
    }
  };

  return (
    <div className="page">
      <h2 className="page-title">View Matches:</h2>
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="form-group">
          <label className="form-label">Enter your lost item ID:</label>
          <input
            placeholder="e.g. 123e4567-e89b..."
            value={lostItemId}
            onChange={(e) => setLostItemId(e.target.value)}
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button className="primary" onClick={handleSearch}>Search for Matches</button>
      </div>

      {searched && matches.length === 0 && (
        <p style={{ color: '#888', fontSize: '14px' }}>No matches found yet. Check back later.</p>
      )}

      {matches.map((match) => (
        <div key={match.found_item_id} className="match-card">
          <p>Item: <span>{match.Items?.Item_Names?.name}</span></p>
          <p>Color: <span>{match.Items?.Colors?.color}</span></p>
          <p>Location: <span>{match.Items?.Locations?.location}</span></p>
          <button
            className="secondary"
            style={{ marginTop: '0.75rem' }}
            onClick={() => navigate(`/verify/${lostItemId}`, { state: { found_item_id: match.found_item_id } })}>
            This is mine — verify ownership
          </button>
        </div>
      ))}
    </div>
  );
}

export default ViewMatches;
