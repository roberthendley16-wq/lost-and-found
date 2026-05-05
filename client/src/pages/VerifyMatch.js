import React, { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function VerifyMatch() {
  const { lostItemId } = useParams();
  const { state } = useLocation();

  const found_item_id = state?.found_item_id;

  const [guess, setGuess] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleVerify = async () => {
    try {
      setError(null);
      setResult(null);

      if (!found_item_id) {
        setError('Missing found item ID. Go back to matches and select an item.');
        return;
      }

      if (!guess.trim()) {
        setError('Please enter the secret detail.');
        return;
      }

      const { data: lostItem, error: lostError } = await supabase
        .from('lost_items')
        .select('lost_item_id, secret_detail')
        .eq('lost_item_id', lostItemId)
        .single();

      if (lostError || !lostItem) {
        console.error('Lost item verify error:', lostError);
        setError('Lost item not found.');
        return;
      }

      // Exact match only
      // This ignores capital letters and extra spaces at the beginning/end.
      const correctAnswer = lostItem.secret_detail.trim().toLowerCase();
      const userAnswer = guess.trim().toLowerCase();
      const isCorrect = userAnswer === correctAnswer;

      const { data: match, error: matchError } = await supabase
        .from('Matches')
        .insert([
          {
            lost_item_id: lostItemId,
            found_item_id: found_item_id,
            status: isCorrect ? 'verified' : 'failed'
          }
        ])
        .select()
        .single();

      if (matchError) {
        console.error('Match insert error:', matchError);
        setError(matchError.message);
        return;
      }

      const { error: verificationError } = await supabase
        .from('verification')
        .insert([
          {
            match_id: match.match_id,
            provided_answer: guess,
            is_correct: isCorrect
          }
        ]);

      if (verificationError) {
        console.error('Verification insert error:', verificationError);
        setError(verificationError.message);
        return;
      }

      if (isCorrect) {
        const { error: lostUpdateError } = await supabase
          .from('lost_items')
          .update({ status: 'resolved' })
          .eq('lost_item_id', lostItemId);

        if (lostUpdateError) {
          console.error('Lost item update error:', lostUpdateError);
          setError(lostUpdateError.message);
          return;
        }

        const { error: foundUpdateError } = await supabase
          .from('Found_Items')
          .update({ status: 'claimed' })
          .eq('found_item_id', found_item_id);

        if (foundUpdateError) {
          console.error('Found item update error:', foundUpdateError);
          setError(foundUpdateError.message);
          return;
        }

        setResult({
          success: true,
          message: 'Ownership verified! The lost item is now resolved and the found item is marked as claimed.'
        });
      } else {
        setResult({
          success: false,
          message: 'Incorrect secret detail. Verification failed.'
        });
      }
    } catch (err) {
      console.error('Verify crash:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  if (result) {
    return (
      <div className="page">
        <div className="card">
          <h2 className="page-title">
            {result.success ? 'Verified!' : 'Verification Failed'}
          </h2>

          <p style={{ color: '#ccc' }}>
            {result.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h2 className="page-title">Verify Ownership</h2>

      <div className="card">
        <p style={{ color: '#888', fontSize: '14px', marginBottom: '1rem' }}>
          Enter the exact secret detail you gave when you reported this item lost.
        </p>

        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label className="form-label">Secret Detail:</label>
          <input
            placeholder="Enter your secret detail"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
          />
        </div>

        {error && <p className="error">{error}</p>}

        <button className="primary" onClick={handleVerify}>
          Verify Ownership
        </button>
      </div>
    </div>
  );
}

export default VerifyMatch;
  
