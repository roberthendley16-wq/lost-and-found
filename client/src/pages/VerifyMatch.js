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
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  if (result) {
    return (
      <div>
        <h2>{result.success ? 'Verified!' : 'Verification Failed'}</h2>
        <p>{result.message}</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Verify Ownership</h2>
      <p>Enter the secret detail you provided when you reported this item lost.</p>
      <input
        placeholder="Your secret detail"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
      />
      <br /><br />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleVerify}>Verify</button>
    </div>
  );
}

export default VerifyMatch;
