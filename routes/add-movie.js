import { Router } from 'express';
import db from '../db/queries.js';

const addMovieRouter = Router();

addMovieRouter.get('/', async (req, res) => {
  const collections = await db.getCollections();
  res.render('movie-search', { collections: collections });
});

// TODO: Create posting route

export default addMovieRouter;
