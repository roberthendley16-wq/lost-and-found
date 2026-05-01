import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'https://lost-and-found-uffo.onrender.com';

function CreateLostItem() {
  const [options, setOptions] = useState({ names: [], colors: [], locations: [] });
  const [form, setForm] = useState({
    user_id: '',
    name: '',
    color: '',
    location: '',
    secret_detail: ''
  });
  const [submitted, setSubmitted] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${API}/lost-items/options`)
      .then(res => setOptions(res.data))
      .catch(() => setError('Could not load options'));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`${API}/lost-items`, form);
      setSubmitted(res.data);
      setError(null);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="card">
        <h2>Lost item reported!</h2>
        <p>Your item ID is: <strong>{submitted.lost_item_id}</strong></p>
        <p>Save this ID — you will need it to check for matches.</p>
        <button onClick={() => setSubmitted(null)}>Report another</button>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Report a Lost Item:</h2>
      <input name="user_id" placeholder="Your user ID" onChange={handleChange} />
      <select name="name" onChange={handleChange} defaultValue="">
        <option value="" disabled>Select item type</option>
        {options.names?.map(n => (
          <option key={n.Item_Names_id} value={n.name}>{n.name}</option>
        ))}
      </select>
      <select name="color" onChange={handleChange} defaultValue="">
        <option value="" disabled>Select color</option>
        {options.colors?.map(c => (
          <option key={c.Colors_id} value={c.color}>{c.color}</option>
        ))}
      </select>
      <select name="location" onChange={handleChange} defaultValue="">
        <option value="" disabled>Select location</option>
        {options.locations?.map(l => (
          <option key={l.Locations_id} value={l.location}>{l.location}</option>
        ))}
      </select>
      <input name="secret_detail" placeholder="Secret detail only you would know" onChange={handleChange} />
      {error && <p className="error">{error}</p>}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default CreateLostItem;
