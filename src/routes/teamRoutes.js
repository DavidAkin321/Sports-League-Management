import express from 'express'; 
import {addPlayerToTeam, removeFromTeam} from '../controllers/teamController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { coachOrAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post(
    "/:teamId/players", 
    authMiddleware,
    coachOrAdmin,
    addPlayerToTeam
);


router.delete(
    "/players/:id",
    authMiddleware,
    coachOrAdmin,
    removeFromTeam
);

//router.post("/login", login);

//router.post("/logout", logout);


export default router;