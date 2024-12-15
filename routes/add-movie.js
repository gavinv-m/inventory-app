import { Router } from 'express';

const addMovieRouter = Router();

addMovieRouter.get('/', (req, res) => {
  res.send('Add movie router up');
});

// TODO: Create posting route

export default addMovieRouter;
