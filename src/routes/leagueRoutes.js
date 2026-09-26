import express from 'express' ;
import { createLeague, addTeamToLeague, getLeagueTeams, getLeagues, updateLeague, deleteLeague } from '../controllers/leagueController.js';
import { createLeagueSettings } from '../controllers/leagueSettingsController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { coachOrAdmin, organiserOrAdmin } from '../middleware/roleMiddleware.js';
import { validateRequest } from "../middleware/validateRequest.js";
import { leagueSettingsSchema } from '../validators/leagueSettingsValidators.js';
import { createLeagueSchema, addTeamToLeagueSchema, updateLeagueSchema } from "../validators/leagueValidators.js";

const router = express.Router();

router.use(authMiddleware)

router.post(
    "/",
    validateRequest(createLeagueSchema),
    organiserOrAdmin,
    createLeague
);

router.post(
    "/:leagueId/teams",
    validateRequest(addTeamToLeagueSchema),
    organiserOrAdmin,
    addTeamToLeague
);

router.get(
    "/:leagueId/teams",
    getLeagueTeams
);

router.get(
    "/",
    getLeagues
)

router.patch(
    "/:leagueId",
    validateRequest(updateLeagueSchema),
    organiserOrAdmin,
    updateLeague
)

router.delete(
    "/:leagueId",
    deleteLeague
)

router.post(
    "/:leagueId/settings",
    validateRequest(leagueSettingsSchema),
    organiserOrAdmin,
    createLeagueSettings
)

export default router;
