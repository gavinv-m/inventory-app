import { query, validationResult } from 'express-validator';
import dotenv from 'dotenv';
dotenv.config();

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${process.env.API_KEY}`,
  },
};

const validateQuery = [
  query('query')
    .notEmpty()
    .withMessage('Query cannot be empty')
    .isLength({ min: 1, max: 100 })
    .withMessage('Query must be 100 characters or fewer')
    .trim()
    .escape(),
];

const fetchMovies = [
  validateQuery,
  async (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty() === false) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Make the request
    const abortController = new AbortController();

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY}&query=${req.query.query}&include_adult=false&language=en-US`,
        { ...options, signal: abortController.signal }
      );
      if (response.ok === false)
        throw new Error('Failed to fetch data from API');

      const data = await response.json();
      res.json(data);
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Request was aborted');
        res.status(408).json({ error: 'Request timeout' });
      } else {
        console.error('Error fetching movie data:', error);
        res.status(500).json({ error: 'Failed to fetch movie data' });
      }
    }
  },
];

export default fetchMovies;
