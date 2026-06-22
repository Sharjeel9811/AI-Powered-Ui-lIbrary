import express from 'express';
import { getCurrentUser } from '../Controllers/UserController.js';


const userRouter=express.Router();


userRouter.get('/current', getCurrentUser)


export default userRouter;
