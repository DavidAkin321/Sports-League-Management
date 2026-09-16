import { prisma } from "../config/db.js";

const createLeague = async (req, res) => {
    try {
        const { name, season } = req.body;

        const league = await prisma.league.create({
          data: {
            name,
            season,
            createdBy: req.user.id,
          },
        });

        return res.status(201).json({
            status: "success",
            message: "League created successfully",
            league,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Internal server error",
        });
    }
};

const addTeamToLeague = async (req, res) => {
    try{
        const { leagueId } = req.params;
        const { teamId } = req.body;

        //Check League exists
        const league = await prisma.league.findUnique({
            where: {
                id: leagueId,
            },
        });

        if (!league) {
            return res.status(404).json({
                error:"League not found",
            });
        }

        //Check team exists
        const team = await prisma.teams.findUnique({
            where: {
                id: teamId,
            },
        });

        if(!team) {
            return res.status(404).json({
                error:"Team not found",
            });
        }

        //Check if team is already in league
        const existingLeagueTeam = await prisma.leagueTeam.findUnique({
            where: {
                leagueId_teamId: {
                    leagueId,
                    teamId,
                },
            },
        });
        if(existingLeagueTeam){
            return res.status(409).json({
                error:"Team is already in this league",
            });
        }

        const leagueTeam = await prisma.leagueTeam.create({
            data: {
                leagueId,
                teamId,
            },
        });

        return res.status(201).json({
            status:"success",
            message:"Team added to league successfully",
            leagueTeam,
        });
    } catch (error){
        console.error(error);

        return res.status(500).json({
            error: "Internal server error",
        });
    }
};

export { createLeague, addTeamToLeague };