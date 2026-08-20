import express from 'express'; 
import {addPlayerToTeam, createTeam, deleteTeam, getTeamPlayers, removeFromTeam, updateTeam} from '../controllers/teamController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { coachOrAdmin } from '../middleware/roleMiddleware.js';
import { validateRequest } from "../middleware/validateRequest.js";
import { createTeamSchema, addPlayerToTeamSchema, updateTeamSchema } from "../validators/teamValidators.js";

const router = express.Router();

router.use(authMiddleware);

router.post(
    "/:teamId/players", 
    validateRequest(addPlayerToTeamSchema),
    authMiddleware,
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
    validateRequest(updateTeamSchema),
    coachOrAdmin,
    updateTeam
)

router.delete(
    "/:teamId",
    coachOrAdmin,
    deleteTeam
);


export default router;