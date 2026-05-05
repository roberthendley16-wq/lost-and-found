import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';

function VerifyMatch() {
  const { lostItemId } = useParams();
  const { state } = useLocation();
  const found_item_id = state?.found_item_id;
  const [guess, setGuess] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleVerify = async () => {
    try {
      const res = await axios.post('https://lost-and-found-uffo.onrender.com/matches/verify', {
        lost_item_id: lostItemId,
        found_item_id,
        guess
      });
      setResult(res.data);
      setError(null);
    } catch {
      setError('Something went wrong. Please try again.');
    }
  };

  if (result) {
    return (
      <div className="page">
        <div className="card">
          <h2 className="page-title">{result.success ? 'Verified!' : 'Verification Failed'}</h2>
          <p style={{ color: '#ccc' }}>{result.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h2 className="page-title">Verify Ownership</h2>
      <div className="card">
        <p style={{ color: '#888', fontSize: '14px', marginBottom: '1rem' }}>
          Enter the secret detail you provided when you reported this item lost.
        </p>
        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label className="form-label">Secret detail</label>
          <input
            placeholder="Your secret detail"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button className="primary" onClick={handleVerify}>Verify Ownership</button>
      </div>
    </div>
  );
}

export default VerifyMatch;
