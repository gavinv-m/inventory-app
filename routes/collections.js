import { Router } from 'express';
import collectionsController from '../controllers/collections-controller.js';

const collectionsRouter = Router();

collectionsRouter.get('/create', collectionsController.renderCreateForm);
collectionsRouter.post('/create', collectionsController.createCollection);
collectionsRouter.get('/', (req, res) => {
  res.send('Collections router up');
});

// TODO: Create route to add new category
// TODO: Create route when category posted

// Exports to app.js
export default collectionsRouter;
