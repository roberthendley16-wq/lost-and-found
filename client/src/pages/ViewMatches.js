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
      const res = await axios.get(`http://localhost:3001/matches/${lostItemId}`);
      setMatches(res.data);
      setSearched(true);
      setError(null);
    } catch (err) {
      setError('Could not find matches. Check your item ID.');
    }
  };

  return (
    <div>
      <h2>Find Matches</h2>
      <input
        placeholder="Enter your lost item ID"
        value={lostItemId}
        onChange={(e) => setLostItemId(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {searched && matches.length === 0 && <p>No matches found yet.</p>}
      {matches.map((match) => (
        <div key={match.found_item_id} style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0' }}>
          <p>Item: {match.Items?.Item_Names?.name}</p>
          <p>Color: {match.Items?.Colors?.color}</p>
          <p>Location: {match.Items?.Locations?.location}</p>
          <button onClick={() => navigate(`/verify/${lostItemId}`, { state: { found_item_id: match.found_item_id } })}>
            This is mine — verify ownership
          </button>
        </div>
      ))}
    </div>
  );
}

export default ViewMatches;
