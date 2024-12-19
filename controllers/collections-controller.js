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

const renderCreateForm = (req, res) => {
  res.render('create-collection');
};

const renderCollections = async (req, res) => {
  const collections = await db.getCollections();
  const posters = await db.getFirstPoster();
  const collectionNameAndPosters = collections.map((collection, index) => {
    return { ...collection, poster: posters[index] };
  });
  res.render('collections', { collections: collectionNameAndPosters });
};

const renderCollection = async (req, res) => {
  const collectionName = decodeURIComponent(req.params.collection);
  const collectionDescription = await db.getCollectionDescription(
    collectionName
  );
  const collectionMovies = await db.getCollectionMovies(collectionName);

  // TODO: Render with collection movies
};

const collectionsController = {
  createCollection,
  renderCreateForm,
  renderCollections,
  renderCollection,
};

// Exports to collections.js
export default collectionsController;
