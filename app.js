import express from 'express';
import collectionsRouter from './routes/collections.js';
import addMovieRouter from './routes/add-movie.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use('/collections', collectionsRouter);
app.use('/add-movie', addMovieRouter);
app.get('/', (req, res) => {
  res.send('We up');
});

// TODO: Add error handler

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); // TODO: Remove
});
