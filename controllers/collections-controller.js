import db from '../db/queries.js';
import { body, matchedData, validationResult } from 'express-validator';

const validateCollectionForm = [
  body('collection-name')
    .trim()
    .notEmpty()
    .withMessage('Collection name is required.')
    .isLength({ max: 100 })
    .withMessage('Collection name cannot exceed 100 characters.')
    .escape(),

  body('collection-description')
    .optional()
    .trim()
    .isLength({ max: 140 })
    .withMessage('Collection description cannot exceed 140 characters.')
    .escape(),
];

const renderCreateForm = (req, res) => {
  res.render('create-collection');
};

const createCollection = [
  validateCollectionForm,
  async (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty() === false) {
      return res.status(400).json({ errors: errors.array() });
    }

    const data = matchedData(req);
    await db.createCollection({
      name: data['collection-name'],
      description: data['collection-description'],
    });
    res.redirect('/collections/create');
  },
];

const collectionsController = { renderCreateForm, createCollection };

// Exports to collections.js
export default collectionsController;
