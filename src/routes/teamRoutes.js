import express from 'express'; 
import {addPlayerToTeam, createTeam, getTeamPlayers, removeFromTeam, updateTeam} from '../controllers/teamController.js';
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

router.post(
    "/",
    coachOrAdmin,
    createTeam
)

router.delete(
    "/players/:id",
    authMiddleware,
    coachOrAdmin,
    removeFromTeam
);

router.get(
    "/:teamId/players",
    getTeamPlayers
);


router.patch(
    "/:teamId",
    coachOrAdmin,
    updateTeam
)

//router.post("/login", login);

//router.post("/logout", logout);


export default router;