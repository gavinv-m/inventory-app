import { Router } from 'express';

const addMovieRouter = Router();

addMovieRouter.get('/', (req, res) => {
  res.render('movie-search');
});

// TODO: Create posting route

export default addMovieRouter;
