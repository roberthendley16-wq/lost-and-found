import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function ViewMatches() {
  const [lostItemId, setLostItemId] = useState('');
  const [lostItem, setLostItem] = useState(null);
  const [matches, setMatches] = useState([]);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      setError(null);
      setSearched(false);
      setMatches([]);
      setLostItem(null);

      if (!lostItemId.trim()) {
        setError('Please enter your lost item ID.');
        return;
      }

      // Get the lost item the user is searching for
      const { data: lostData, error: lostError } = await supabase
        .from('lost_items')
        .select(`
          lost_item_id,
          status,
          secret_detail,
          Items (
            item_id,
            Item_Names_id,
            Colors_id,
            Locations_id,
            Item_Names ( name ),
            Colors ( color ),
            Locations ( location )
          )
        `)
        .eq('lost_item_id', lostItemId.trim())
        .single();

      if (lostError || !lostData) {
        console.error('Lost item search error:', lostError);
        setError('Could not find that lost item ID.');
        return;
      }

      setLostItem(lostData);

      // Get all unclaimed found items
      const { data: foundItems, error: foundError } = await supabase
        .from('Found_Items')
        .select(`
          found_item_id,
          status,
          Items (
            item_id,
            Item_Names_id,
            Colors_id,
            Locations_id,
            Item_Names ( name ),
            Colors ( color ),
            Locations ( location )
          )
        `)
        .eq('status', 'unclaimed');

      if (foundError) {
        console.error('Found items error:', foundError);
        setError('Could not load found items.');
        return;
      }

      const lostItemData = lostData.Items;

      // Matching logic:
      // Item type is most important, then color, then location.
      const scoredMatches = (foundItems || [])
        .map((found) => {
          const foundItemData = found.Items;

          let score = 0;
          const reasons = [];

          if (foundItemData?.Item_Names_id === lostItemData?.Item_Names_id) {
            score += 50;
            reasons.push('same item type');
          }

          if (foundItemData?.Colors_id === lostItemData?.Colors_id) {
            score += 30;
            reasons.push('same color');
          }

          if (foundItemData?.Locations_id === lostItemData?.Locations_id) {
            score += 20;
            reasons.push('same location');
          }

          return {
            ...found,
            match_score: score,
            reasons
          };
        })
        .filter((match) => match.match_score >= 70)
        .sort((a, b) => b.match_score - a.match_score);

      setMatches(scoredMatches);
      setSearched(true);
    } catch (err) {
      console.error('Match search crash:', err);
      setError('Something went wrong while searching for matches.');
    }
  };

  return (
    <div className="page">
      <h2 className="page-title">View Matches:</h2>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="form-group">
          <label className="form-label">Enter your lost item ID:</label>
          <input
            placeholder="Paste your lost item ID here"
            value={lostItemId}
            onChange={(e) => setLostItemId(e.target.value)}
          />
        </div>

        {error && <p className="error">{error}</p>}

        <button className="primary" onClick={handleSearch}>
          Search for Matches
        </button>
      </div>

      {lostItem && (
        <div className="card">
          <h3 style={{ color: '#c8102e', marginBottom: '0.75rem' }}>Lost Item Search</h3>
          <p>Item: <span>{lostItem.Items?.Item_Names?.name}</span></p>
          <p>Color: <span>{lostItem.Items?.Colors?.color}</span></p>
          <p>Location: <span>{lostItem.Items?.Locations?.location}</span></p>
          <p>Status: <span>{lostItem.status}</span></p>
        </div>
      )}

      {searched && matches.length === 0 && (
        <p style={{ color: '#888', fontSize: '14px' }}>
          No matches found yet. Try again later after more found items are posted.
        </p>
      )}

      {matches.map((match) => (
        <div key={match.found_item_id} className="match-card">
          <p>Possible Match Score: <span>{match.match_score}%</span></p>
          <p>Matched By: <span>{match.reasons.join(', ')}</span></p>
          <p>Item: <span>{match.Items?.Item_Names?.name}</span></p>
          <p>Color: <span>{match.Items?.Colors?.color}</span></p>
          <p>Location: <span>{match.Items?.Locations?.location}</span></p>
          <p>Status: <span>{match.status}</span></p>

          <button
            className="secondary"
            style={{ marginTop: '0.75rem' }}
            onClick={() =>
              navigate(`/verify/${lostItemId.trim()}`, {
                state: { found_item_id: match.found_item_id }
              })
            }
          >
            This is mine — verify ownership
          </button>
        </div>
      ))}
    </div>
  );
}

export default ViewMatches;
