import express from 'express' ;
import { createLeague, addTeamToLeague } from '../controllers/leagueController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { organiserOrAdmin } from '../middleware/roleMiddleware.js';
import { validateRequest } from "../middleware/validateRequest.js";
import { createLeagueSchema, addTeamToLeagueSchema } from "../validators/leagueValidators.js";

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

export default router;
