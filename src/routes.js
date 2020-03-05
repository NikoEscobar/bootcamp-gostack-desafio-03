import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import deliverymanController from './app/controllers/DeliverymanController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.post('/recipients', RecipientController.store);
routes.put('/recipients', RecipientController.update);

routes.post('/deliverymans', deliverymanController.store);
routes.get('/deliverymans', deliverymanController.index);
routes.put('/deliverymans', deliverymanController.update);
routes.delete('/deliverymans', deliverymanController.delete);

export default routes;
