import express from "express";
import { generateKnockoutStage, generateFinal } from "../controllers/knockoutController.js";
import { organiserOrAdmin } from "../middleware/roleMiddleware.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router()

router.post(
    "/:leagueId",
    authMiddleware,
    organiserOrAdmin,
    generateKnockoutStage
);

router.post(
    "/:leagueId/final",
    authMiddleware,
    organiserOrAdmin,
    generateFinal
);

export default router;