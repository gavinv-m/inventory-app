import db from '../db/queries.js';
import { body, matchedData, validationResult } from 'express-validator';

const renderAddForm = async (req, res) => {
  const collections = await db.getCollections();
  res.render('movie-search', { collections: collections });
};

const validateAddRequest = [
  body('select-collection')
    .notEmpty()
    .withMessage('Please select a collection'),

  body('database-id')
    .notEmpty()
    .withMessage('Database ID cannot be empty')
    .customSanitizer((value) => Number(value))
    .isNumeric()
    .withMessage('Database ID must be a numeric value'),
];

const addMovie = [
  validateAddRequest,
  async (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty() === false) {
      return res.status(400).json({ errors: errors.array() });
    }

    const data = matchedData(req);
    try {
      await db.addMovie(data);
      res.status(201).redirect('/add-movie');
    } catch (error) {
      res.status(500).redirect('/add-movie');
    }
  },
];

const addMovieController = { addMovie, renderAddForm };

// Exports to add-movie.js
export default addMovieController;
