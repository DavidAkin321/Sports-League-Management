import { success } from "zod";
import { prisma } from "../config/db.js";
import { leagueSettingsSchema } from "../validators/leagueSettingsValidators.js";

const createLeagueSettings = async (req, res) => {
    try {
        const { leagueId } = req.params;

        const {
            tournamentDate,
            startTime,
            endTime,
            matchDuration,
            breakDuration,
            surfaces
        } = req.body;

        //Check that league exists
        const league = await prisma.league.findUnique({
            where: {
                id: leagueId,
            }
        });
        if (!league){
            return res.status(404).json({
                error: "league not found",
            });
            }

        //Check its an admin or organiser
        if(
            league.createdBy !== req.user.id &&
            req.user.role !== "ADMIN"
        ){
            return res.status(403).json({
                error: "You are not allowed to configure this league",
            });
        }  
        const existingSetting = await prisma.leagueSettings.findUnique({
            where: { leagueId },
        });

        if(existingSetting){
            return res.status(409).json({
                error: "League settings already exist",
            });
        }
        //Create the settings
        const settings = await prisma.leagueSettings.create({
            data:{
                leagueId,
                tournamentDate,
                startTime,
                endTime,
                matchDuration,
                breakDuration,
                surfaces,
            },
        });

        return res.status(201).json({
            status: "success",
            message: "League settings created succesfully",
            settings,
        });
    } catch(error){
        console.error(error);

        return res.status(500).json({
            error:"Internal server error",
        });
    }
};

export { createLeagueSettings };