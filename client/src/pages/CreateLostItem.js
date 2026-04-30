import React, { useState } from 'react';
import axios from 'axios';

function CreateLostItem() {
  const [form, setForm] = useState({
    user_id: '',
    name: '',
    color: '',
    location: '',
    secret_detail: ''
  });
  const [submitted, setSubmitted] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post('http://localhost:3001/lost-items', form);
      setSubmitted(res.data);
      setError(null);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div>
        <h2>Lost item reported!</h2>
        <p>Your item ID is: <strong>{submitted.lost_item_id}</strong></p>
        <p>Save this ID — you will need it to check for matches.</p>
        <button onClick={() => setSubmitted(null)}>Report another</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Report a Lost Item</h2>
      <input name="user_id" placeholder="Your user ID" onChange={handleChange} /><br /><br />
      <input name="name" placeholder="Item name (e.g. wallet)" onChange={handleChange} /><br /><br />
      <input name="color" placeholder="Color" onChange={handleChange} /><br /><br />
      <input name="location" placeholder="Where did you lose it?" onChange={handleChange} /><br /><br />
      <input name="secret_detail" placeholder="Secret detail only you would know" onChange={handleChange} /><br /><br />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default CreateLostItem;
