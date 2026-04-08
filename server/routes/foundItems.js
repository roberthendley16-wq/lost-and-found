const express = require('express');
const router = express.Router();
const supabase = require('../db');

async function getOrCreate(table, matchColumn, matchValue, idColumn) {
  let { data } = await supabase
    .from(table)
    .select()
    .eq(matchColumn, matchValue)
    .single();
  if (!data) {
    const { data: newData, error } = await supabase
      .from(table)
      .insert([{ [matchColumn]: matchValue }])
      .select()
      .single();
    if (error) throw error;
    data = newData;
  }
  return data[idColumn];
}

router.post('/', async (req, res) => {
  const { user_id, name, color, location } = req.body;
  try {
    const Item_Names_id = await getOrCreate('Item_Names', 'name', name, 'Item_Names_id');
    const Colors_id = await getOrCreate('Colors', 'color', color, 'Colors_id');
    const Locations_id = await getOrCreate('Locations', 'location', location, 'Locations_id');

    const { data: item, error: itemError } = await supabase
      .from('Items')
      .insert([{ user_id, Item_Names_id, Colors_id, Locations_id }])
      .select()
      .single();
    if (itemError) throw itemError;

    const { data: foundItem, error: foundError } = await supabase
      .from('Found_Items')
      .insert([{ found_item_id: item.item_id, status: 'unclaimed' }])
      .select()
      .single();
    if (foundError) throw foundError;

    res.json({ ...foundItem, name, color, location });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('Found_Items')
      .select(`
        found_item_id,
        status,
        created_at,
        Items (
          item_id,
          created_at,
          Item_Names ( name ),
          Colors ( color ),
          Locations ( location ),
          Users ( username, email )
        )
      `);
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
