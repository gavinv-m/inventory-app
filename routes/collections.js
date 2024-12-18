import { Router } from 'express';
import collectionsController from '../controllers/collections-controller.js';

const collectionsRouter = Router();

collectionsRouter.get('/create', collectionsController.renderCreateForm);
collectionsRouter.post('/create', collectionsController.createCollection);
collectionsRouter.get('/', collectionsController.renderCollections);

// Exports to app.js
export default collectionsRouter;
