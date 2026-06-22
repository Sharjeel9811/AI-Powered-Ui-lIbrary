import express from 'express';
import { Googleuth, logout } from '../Controllers/AuthController.js';


const AuthRouter=express.Router();


AuthRouter.post("/google",Googleuth);

AuthRouter.get('/logout',logout);

export default AuthRouter;

