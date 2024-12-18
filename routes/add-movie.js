import { Router } from 'express';
import addMovieController from '../controllers/add-movie-controller.js';

const addMovieRouter = Router();

addMovieRouter.get('/', addMovieController.renderAddForm);
addMovieRouter.post('/', addMovieController.addMovie);

// Exports to app.js
export default addMovieRouter;
