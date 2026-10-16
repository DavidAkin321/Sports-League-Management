import express from "express";
import { generateKnockoutStage } from "../controllers/knockoutController.js";
import { organiserOrAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router()

router.post(
    "/:leagueId",
    organiserOrAdmin,
    generateKnockoutStage
);

export default router;