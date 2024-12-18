import express from 'express';
import collectionsRouter from './routes/collections.js';
import addMovieRouter from './routes/add-movie.js';
import fetchMovies from './controllers/fetch-movies.js';
import path from 'node:path';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.set('views', path.join(process.cwd(), 'views'));
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.use('/collections', collectionsRouter);
app.use('/add-movie', addMovieRouter);
app.get('/api/fetch-movies', fetchMovies);
app.get('/', (req, res) => {
  res.render('homepage');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); // TODO: Remove
});
