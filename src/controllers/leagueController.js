import { id } from "zod/locales";
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

const getLeagueTeams = async (req, res) => {
    try {
        const { leagueId } = req.params;

        const league = await prisma.league.findUnique({
            where: {
                id: leagueId,
            },
        });

        if (!league){
            return res.status(404).json({
                error: "League not found",
            });
        }
    

    const leagueTeams = await prisma.leagueTeam.findMany({
        where: {
            leagueId,
        },
        include: {
            team: true,
        },
    });

    return res.status(200).json({
        status: "success",
        league: {
            id: league.id,
            name: league.name,
            season: league.season,
        },
        teams: leagueTeams.map((leagueTeam) => leagueTeam.team),
    });
} catch (error) {
    console.error(error);

    return res.status(500).json({
        error:"Internal server error",
    });
}
};

const getLeagues = async (req, res) => {
    try {
        const leagues = await prisma.league.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });

        return res.status(200).json({
            status:"success",
            count: leagues.length, 
            leagues,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Internal server error",
        });
    }
};

const getLeague = async (req, res) => {
    try {
        const { leagueId } = req.params;

        const league = await prisma.league.findUnique({
            where: {
                id: leagueId,
            },
            include: {
                leagueTeams: {
                    include: {
                        team: true,
                    },
                },
            },
        });

        if (!league) {
            return res.status(404).json({
                error: "League not found",
            });
        }

        return res.status(404).json({
            status: "success",
            league: {
                id: league.id,
                name: league.name,
                season: league.season,
                createdAt: league.createdAt,
            },
            teams: league.leagueTeams.map(
                (leagueTeam) => leagueTeam.team
            ),
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Internal server error",
        });
    }
};

const updateLeague = async (req, res) => {
    try {
        const { leagueId } = req.params;
        const { name, season } = req.body;

        //find League

        const league = await prisma.league.findUnique({
            where: {
                id: leagueId,
            },
        });
        if(!league){
            return res.status(403).json({
                error:"League not found",
            });
        }

        if (
            league.createdBy !== req.user.id &&
            req.user.role !== "ADMIN"
        ){
            return res.status(403).json({
                error:"You are not allowed to update this league",
            });
        }

        const updatedLeague = await prisma.league.update ({
            where: {
                id: leagueId,
            },
            data: {
                ...(name !== undefined && { name }),
                ...(season !== undefined && { season }),
            },
        });

        return res.status(200).json({
            status: "success",
            message: "League updated successfully",
            league: updatedLeague,
    });
 } catch (error) {
    console.error(error);

    return res.status(500).json({
        error: "Internal server error", 
 });

        }

    };

    const deleteLeague = async (req, res) => {
        try {
            const { leagueId } = req.params;

            const league = await prisma.league.findUnique({
                where: {
                    id: leagueId,
                }
            });
            if(!league){
                    return res.status(404).json({
                        error:"League not found",
                    });
                }

        if (
            req.user.role !== "ADMIN"
        ) {
            return res.status(403).json({
                error:"Not allowed to perform this action"
            });
        }

        //Delete League
        await prisma.league.delete({
            where:{
                id: leagueId,
            },
        });
        return res.status(200).json({
            status:"success",
            message:"League succesfully deleted",
        });
    }catch(error){
        console.error(error);

        return res.status(500).json({
            error:"Internal server error",
        });
    }

    };


export { createLeague, addTeamToLeague, getLeagueTeams, getLeagues, updateLeague, deleteLeague };