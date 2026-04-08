const express = require('express');
const router = express.Router();
const supabase = require('../db');

router.get('/:lostItemId', async (req, res) => {
  const { lostItemId } = req.params;
  try {
    const { data: lostItem, error: lostError } = await supabase
      .from('lost_items')
      .select(`
        lost_item_id,
        Items (
          Item_Names ( name ),
          Colors ( color ),
          Locations ( location )
        )
      `)
      .eq('lost_item_id', lostItemId)
      .single();
    if (lostError) return res.status(404).json({ error: 'Lost item not found' });

    const name = lostItem.Items.Item_Names.name;
    const location = lostItem.Items.Locations.location;

    const { data: matches, error: matchError } = await supabase
      .from('Found_Items')
      .select(`
        found_item_id,
        status,
        Items (
          Item_Names ( name ),
          Colors ( color ),
          Locations ( location )
        )
      `)
      .eq('status', 'unclaimed')
      .eq('Items.Item_Names.name', name)
      .eq('Items.Locations.location', location);
    if (matchError) throw matchError;

    res.json(matches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/verify', async (req, res) => {
  const { lost_item_id, found_item_id, guess } = req.body;
  try {
    const { data: lostItem, error: lostError } = await supabase
      .from('lost_items')
      .select('secret_detail')
      .eq('lost_item_id', lost_item_id)
      .single();
    if (lostError) return res.status(404).json({ error: 'Lost item not found' });

    const { data: match, error: matchInsertError } = await supabase
      .from('Matches')
      .insert([{
        lost_item_id,
        found_item_id,
        status: 'pending'
      }])
      .select()
      .single();
    if (matchInsertError) throw matchInsertError;

    const isCorrect = guess.toLowerCase() === lostItem.secret_detail.toLowerCase();

    await supabase
      .from('verification')
      .insert([{
        match_id: match.match_id,
        provided_answer: guess,
        is_correct: isCorrect
      }]);

    if (isCorrect) {
      await supabase
        .from('lost_items')
        .update({ status: 'resolved' })
        .eq('lost_item_id', lost_item_id);
      await supabase
        .from('Found_Items')
        .update({ status: 'claimed' })
        .eq('found_item_id', found_item_id);
      res.json({ success: true, message: 'Ownership verified! Item marked as returned.' });
    } else {
      res.json({ success: false, message: 'Incorrect detail. Verification failed.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
