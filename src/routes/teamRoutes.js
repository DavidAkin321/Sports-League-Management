import express from 'express'; 
import {addPlayerToTeam, 
        createTeam,
        deleteTeam,
        getTeamPlayers, 
        removeFromTeam, 
        updateTeam, 
        getPlayerStats, 
        recordPlayerMatchStatistic} from '../controllers/teamController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { coachOrAdmin } from '../middleware/roleMiddleware.js';
import { validateRequest } from "../middleware/validateRequest.js";
import { createTeamSchema, addPlayerToTeamSchema, updateTeamSchema, playerMatchStatisticSchema } from "../validators/teamValidators.js";

const router = express.Router();

router.use(authMiddleware);

router.post(
    "/:teamId/players", 
    validateRequest(addPlayerToTeamSchema),
    coachOrAdmin,
    addPlayerToTeam
);

router.post(
    "/",
    validateRequest(createTeamSchema),
    coachOrAdmin,
    createTeam
)

router.delete(
    "/players/:id",
    coachOrAdmin,
    removeFromTeam
);

router.get(
    "/:teamId/players",
    getTeamPlayers
);


router.patch(
    "/:teamId",
    validateRequest(updateTeamSchema),
    coachOrAdmin,
    updateTeam
)

router.delete(
    "/:teamId",
    coachOrAdmin,
    deleteTeam
);

router.get(
    "/players/:userId/stats",
    getPlayerStats
);

router.post(
    "/matches/:matchId/player-stats",
    validateRequest(playerMatchStatisticSchema),
    coachOrAdmin,
    recordPlayerMatchStatistic
);

export default router;