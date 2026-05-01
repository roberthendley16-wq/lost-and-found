import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'https://lost-and-found-uffo.onrender.com';

function CreateFoundItem() {
  const [options, setOptions] = useState({ names: [], colors: [], locations: [] });
  const [form, setForm] = useState({
    user_id: '',
    name: '',
    color: '',
    location: ''
  });
  const [submitted, setSubmitted] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${API}/found-items/options`)
      .then(res => setOptions(res.data))
      .catch(() => setError('Could not load options'));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`${API}/found-items`, form);
      setSubmitted(res.data);
      setError(null);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="card">
        <h2>Found item reported!</h2>
        <p>Thank you for reporting this item.</p>
        <button onClick={() => setSubmitted(null)}>Report another</button>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Report a Found Item:</h2>
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
      {error && <p className="error">{error}</p>}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default CreateFoundItem;
