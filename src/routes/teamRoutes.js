import express from 'express'; 
import {addPlayerToTeam} from '../controllers/teamController.js';

const router = express.Router();

router.post("/", addPlayerToTeam);

//router.post("/login", login);

//router.post("/logout", logout);


export default router;