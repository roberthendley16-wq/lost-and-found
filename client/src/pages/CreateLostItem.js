import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

function CreateLostItem() {
  const [options, setOptions] = useState({
    names: [],
    colors: [],
    locations: []
  });

  const [form, setForm] = useState({
    name: '',
    color: '',
    location: '',
    secret_detail: ''
  });

  const [submitted, setSubmitted] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadOptions() {
      try {
        const { data: names, error: namesError } = await supabase
          .from('Item_Names')
          .select('Item_Names_id, name')
          .order('name');

        const { data: colors, error: colorsError } = await supabase
          .from('Colors')
          .select('Colors_id, color')
          .order('color');

        const { data: locations, error: locationsError } = await supabase
          .from('Locations')
          .select('Locations_id, location')
          .order('location');

        if (namesError || colorsError || locationsError) {
          console.error('Dropdown load error:', namesError || colorsError || locationsError);
          setError('Could not load dropdown options.');
          return;
        }

        setOptions({
          names: names || [],
          colors: colors || [],
          locations: locations || []
        });
      } catch (err) {
        console.error('Dropdown crash:', err);
        setError('Could not load dropdown options.');
      }
    }

    loadOptions();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      setError(null);

      if (!form.name || !form.color || !form.location || !form.secret_detail) {
        setError('Please fill out every field.');
        return;
      }

      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData.user) {
        setError('You must be logged in to create a lost item post.');
        return;
      }

      const user_id = userData.user.id;

      const selectedName = options.names.find((item) => item.name === form.name);
      const selectedColor = options.colors.find((color) => color.color === form.color);
      const selectedLocation = options.locations.find((location) => location.location === form.location);

      if (!selectedName || !selectedColor || !selectedLocation) {
        setError('Invalid dropdown selection.');
        return;
      }

      const { data: item, error: itemError } = await supabase
        .from('Items')
        .insert([
          {
            user_id: user_id,
            Item_Names_id: selectedName.Item_Names_id,
            Colors_id: selectedColor.Colors_id,
            Locations_id: selectedLocation.Locations_id
          }
        ])
        .select()
        .single();

      if (itemError) {
        console.error('Items insert error:', itemError);
        setError(itemError.message);
        return;
      }

      const { data: lostItem, error: lostError } = await supabase
        .from('lost_items')
        .insert([
          {
            lost_item_id: item.item_id,
            secret_detail: form.secret_detail,
            status: 'open'
          }
        ])
        .select()
        .single();

      if (lostError) {
        console.error('Lost item insert error:', lostError);
        setError(lostError.message);
        return;
      }

      setSubmitted(lostItem);
    } catch (err) {
      console.error('Submit lost item crash:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="page">
        <div className="card">
          <h2 className="page-title">Item Reported!</h2>

          <p style={{ color: '#ccc', marginBottom: '0.5rem' }}>
            Your lost item ID is:
          </p>

          <p style={{ fontSize: '20px', fontWeight: '500', color: '#c8102e', marginBottom: '1rem' }}>
            {submitted.lost_item_id}
          </p>

          <p style={{ color: '#888', fontSize: '13px', marginBottom: '1.5rem' }}>
            Save this ID — you may need it to check for matches.
          </p>

          <button className="secondary" onClick={() => setSubmitted(null)}>
            Report Another
          </button>
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
            <select name="name" value={form.name} onChange={handleChange}>
              <option value="" disabled>
                Select item
              </option>
              {options.names.map((item) => (
                <option key={item.Item_Names_id} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Color:</label>
            <select name="color" value={form.color} onChange={handleChange}>
              <option value="" disabled>
                Select color
              </option>
              {options.colors.map((color) => (
                <option key={color.Colors_id} value={color.color}>
                  {color.color}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group full">
            <label className="form-label">Location:</label>
            <select name="location" value={form.location} onChange={handleChange}>
              <option value="" disabled>
                Select location
              </option>
              {options.locations.map((location) => (
                <option key={location.Locations_id} value={location.location}>
                  {location.location}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group full">
            <label className="form-label">Secret Detail:</label>
            <input
              name="secret_detail"
              placeholder="Example: cracked screen, sticker on back, initials inside..."
              value={form.secret_detail}
              onChange={handleChange}
            />
          </div>
        </div>

        {error && <p className="error">{error}</p>}

        <button className="primary" onClick={handleSubmit}>
          Submit Report
        </button>
      </div>
    </div>
  );
}

export default CreateLostItem;
