import { Router } from 'express';

const collectionsRouter = Router();

collectionsRouter.get('/', (req, res) => {
  res.send('Collections router up');
});

// TODO: Create route to add new category
// TODO: Create route when category posted

export default collectionsRouter;
