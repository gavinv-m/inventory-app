import express from 'express';
import collectionsRouter from './routes/collections.js';
import addMovieRouter from './routes/add-movie.js';
import path from 'node:path';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.set('views', path.join(process.cwd(), 'views'));
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));

app.use('/collections', collectionsRouter);
app.use('/add-movie', addMovieRouter);
app.get('/api/config', (req, res) => {
  res.json({
    apiKey: process.env.API_KEY, // Sending the API key from the server to the client
  });
});
app.get('/', (req, res) => {
  res.send('We up');
});

// TODO: Add error handler

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); // TODO: Remove
});
