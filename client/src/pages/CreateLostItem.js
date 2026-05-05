 import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'https://lost-and-found-uffo.onrender.com';

function CreateLostItem() {
  const [options, setOptions] = useState({ names: [], colors: [], locations: [] });
  const [form, setForm] = useState({ user_id: '', name: '', color: '', location: '', secret_detail: '' });
  const [submitted, setSubmitted] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${API}/lost-items/options`)
      .then(res => setOptions(res.data))
      .catch(() => setError('Could not load options'));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`${API}/lost-items`, form);
      setSubmitted(res.data);
      setError(null);
    } catch {
      setError('Something went wrong. Please try again!');
    }
  };

  if (submitted) {
    return (
      <div className="page">
        <div className="card">
          <h2 className="page-title">Item Reported!</h2>
          <p style={{ color: '#ccc', marginBottom: '0.5rem' }}>Your item ID is:</p>
          <p style={{ fontSize: '20px', fontWeight: '500', color: '#c8102e', marginBottom: '1rem' }}>{submitted.lost_item_id}</p>
          <p style={{ color: '#888', fontSize: '13px', marginBottom: '1.5rem' }}>Save this ID — you will need it to check for matches.</p>
          <button className="secondary" onClick={() => setSubmitted(null)}>Report Another</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h2 className="page-title">Report a Lost Item:</h2>
      <div className="card">
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Item Type:</label>
            <select name="name" onChange={handleChange} defaultValue="">
              <option value="" disabled>Select item</option>
              {options.names?.map(n => <option key={n.Item_Names_id} value={n.name}>{n.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Color:</label>
            <select name="color" onChange={handleChange} defaultValue="">
              <option value="" disabled>Select color</option>
              {options.colors?.map(c => <option key={c.Colors_id} value={c.color}>{c.color}</option>)}
            </select>
          </div>
          <div className="form-group full">
            <label className="form-label">Location:</label>
            <select name="location" onChange={handleChange} defaultValue="">
              <option value="" disabled>Select location</option>
              {options.locations?.map(l => <option key={l.Locations_id} value={l.location}>{l.location}</option>)}
            </select>
          </div>
          <div className="form-group full">
            <label className="form-label">Secret detail (only you would know)</label>
            <input name="secret_detail" placeholder="e.g. sticker on back, cracked screen corner..." onChange={handleChange} />
          </div>
        </div>
        {error && <p className="error">{error}</p>}
        <button className="primary" onClick={handleSubmit}>Submit Report</button>
      </div>
    </div>
  );
}

export default CreateLostItem;
