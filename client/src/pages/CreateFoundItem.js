import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

function CreateFoundItem() {
  const [options, setOptions] = useState({
    names: [],
    colors: [],
    locations: []
  });

  const [form, setForm] = useState({
    name: '',
    color: '',
    location: ''
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

      if (!form.name || !form.color || !form.location) {
        setError('Please fill out every field.');
        return;
      }

      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData.user) {
        setError('You must be logged in to create a found item post.');
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

      const { data: foundItem, error: foundError } = await supabase
        .from('Found_Items')
        .insert([
          {
            found_item_id: item.item_id,
            status: 'unclaimed'
          }
        ])
        .select()
        .single();

      if (foundError) {
        console.error('Found item insert error:', foundError);
        setError(foundError.message);
        return;
      }

      setSubmitted(foundItem);
    } catch (err) {
      console.error('Submit found item crash:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="page">
        <div className="card">
          <h2 className="page-title">Item Reported!</h2>

          <p style={{ color: '#ccc', marginBottom: '1rem' }}>
            Thank you for reporting this found item.
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
      <h2 className="page-title">Report a Found Item:</h2>

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
        </div>

        {error && <p className="error">{error}</p>}

        <button className="primary" onClick={handleSubmit}>
          Submit Report
        </button>
      </div>
    </div>
  );
}

export default CreateFoundItem;
