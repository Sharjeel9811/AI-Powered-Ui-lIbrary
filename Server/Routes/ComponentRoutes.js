import express from 'express';
import { GenerateComponent } from '../Controllers/ComponentController.js';
import { SaveComponet } from '../Controllers/SaveComponent.js';
import { ISAuth } from '../Middleware/IsAuth.js';

const componentRouter = express.Router();

componentRouter.post('/generate', ISAuth, GenerateComponent);
componentRouter.post('/save', ISAuth, SaveComponet);

export default componentRouter;
