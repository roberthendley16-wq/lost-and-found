import React, { useState } from 'react';
import axios from 'axios';

function CreateFoundItem() {
  const [form, setForm] = useState({
    user_id: '',
    name: '',
    color: '',
    location: ''
  });
  const [submitted, setSubmitted] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post('http://localhost:3001/found-items', form);
      setSubmitted(res.data);
      setError(null);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div>
        <h2>Found item reported!</h2>
        <p>Thank you for reporting this item.</p>
        <button onClick={() => setSubmitted(null)}>Report another</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Report a Found Item</h2>
      <input name="user_id" placeholder="Your user ID" onChange={handleChange} /><br /><br />
      <input name="name" placeholder="Item name (e.g. wallet)" onChange={handleChange} /><br /><br />
      <input name="color" placeholder="Color" onChange={handleChange} /><br /><br />
      <input name="location" placeholder="Where did you find it?" onChange={handleChange} /><br /><br />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default CreateFoundItem;
