const express = require('express');
const cors = require('cors');
require('dotenv').config();

const lostItemsRouter = require('./routes/lostItems');
const foundItemsRouter = require('./routes/foundItems');
const matchesRouter = require('./routes/matches');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/lost-items', lostItemsRouter);
app.use('/found-items', foundItemsRouter);
app.use('/matches', matchesRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
