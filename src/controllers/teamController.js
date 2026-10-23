import { MatchStatus } from "@prisma/client";
import { prisma } from "../config/db.js";

//Create Team 
const createTeam = async (req, res) => {
    try {
        const { name, city, logo} = req.body;

        const team = await prisma.teams.create({
            data: {
                name,
                city,
                logo,
                createdBy: req.user.id,
            },
        });

        return res.status(201).json({
            status:"success",
            message:"Team created sucessfully",
            data: team,
        });
    } catch (error){
        console.error(error);

        return res.status(500).json({
            error: "Internal server error",
        });
    }
};

const addPlayerToTeam = async (req, res) => {
    try{


    const { userId, position, jerseyNumber } = req.body;

    const {teamId} = req.params;

    //Verify team exists
    const team = await prisma.teams.findUnique({
        where: {
            id: teamId,
        },
    });

    if (!team){
        return res.status(404).json({
            error: "Team not found",
        });
    }

    //Check if logged in user owns the team
    if(
        team.createdBy !== req.user.id &&
        req.user.role !== "ADMIN"
    ) {
        return res.status(403).json({
            error: "You are not allowed to add players to this team",
        });
    }

    //Verify player exists
    const user = await prisma.user.findUnique({
        where:{ id:userId},
    });

    if(!user){
        return res.status(404).json({error: "Player not found"});
    }

    //Verify user is a PLAYER
    if(user.role !=="PLAYER"){
        return res.status(400).json({
            error: "Only players can be added to teams",
        });
    }

    //Check if already added
    const existingInTeam = await prisma.teamMember.findUnique({
        where:{userId: userId},
    });

    if (existingInTeam){
        return res.status(400).json({
            error: "Player is already assigned to a team",
        });
    }

    //Create Team Membership
   const result = await prisma.$transaction(async (tx) => {

    const teamMember = await tx.teamMember.create({
        data: {
            userId: userId,
            teamId: teamId,
            playerPosition: position,
            jerseyNumber: jerseyNumber,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });

    const playerStats = await tx.playerStatistic.create({
        data: {
            playerId: userId,
        },
    });

    return {
        teamMember,
        playerStats,
    };
});
    //Success
    return res.status(201).json({
        status: "success",
        message: "Player added succesfully",
        data: result,
    });

} catch (error) {

    console.error(error);

    return res.status(500).json({
        error: "Internal server error",
    });

}
};

//Get Team players
const getTeamPlayers = async (req, res) => {
    try{
        const { teamId } = req.params;

        //Check that the team exists
        const team = await prisma.teams.findUnique({
            where: {
                id: teamId,
            },
        });
        if (!team) {
            return res.status(404).json({
                error:"Team not found",
            });
        }
        //Find all players belonging to the team
        const players = await prisma.teamMember.findMany({
            where: {
                teamId: teamId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        return res.status(200).json({
            status: "success",
            data: {
                team:team,
                players:players,
            },
        });

    } catch (error){
        console.error(error);

        return res.status(500).json({
            error:"Internal server error",
        });
    }
    };


    //Get player stats
const getPlayerStats = async (req, res) => {
    try {
        const { userId } = req.params;

        //Check that the player exists
        const player = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if(!player) {
            return res.status(404).json({
                error: "Player not found",
            });
        }

        //Make sure the user is actually a player 
        if (player.role !== "PLAYER") {
            return res.status(400).json({
                error: "User is not a player",
            });
        }

        //Find the player's statistics
        const stats = await prisma.playerStatistic.findUnique({
            where: {
                playerId: userId
            },
        });

        if (!stats) {
            return res.status(404).json({
                error:"Player statistics not found",
            });
        }

        return res.status(200).json({
            status: "success",
            data: {
                player: {
                    id: player.id,
                    name: player.name
                },
                status: {
                    goals: stats.goals,
                    assists: stats.assists,
                },
            },
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error:"Internal server error",
        });
    }
};


const removeFromTeam = async (req, res) => {
    try {
    //Find the team membership
    const teamMember = await prisma.teamMember.findUnique({
        where: {
            id: req.params.id,
        },
    });

    if(!teamMember) {
        return res.status(404).json({ error:"Player is not a member of this team"});
    }

    //Find the team 
    const team = await prisma.teams.findUnique({
        where: {
            id: teamMember.teamId,
        },
    });

    if (!team) {
        return res.status(404).json({
            error: "Team not found",
        });
    }

    console.log("Team created by:", team.createdBy);
    console.log("Logged in user:", req.user.id);
    console.log("Logged in role:", req.user.role);

    //Only the team creator/coach or an admin can remove players
    if (
        team.createdBy !== req.user.id &&
        req.user.role !== "ADMIN"
    ){
        return res.status(403).json({
            error: "Not allowed to perform this action",
        });
    }

    //Remove player from team
    await prisma.teamMember.delete({
        where: {
            id: teamMember.id,
        },
    });
    return res.status(200).json({
        status: "success",
        message: "Player removed from team successfully",
    });
} catch (error) {
    console.error(error);

    return res.status(500).json({
        error: "Internal server error",
    });
    }

};

//Update Team
 const updateTeam = async (req, res) => {
    try {
        const { teamId } = req.params;
        const { name, city, logo} = req.body;

        //Check that the team exists
        const team = await prisma.teams.findUnique({
            where: {
                id:teamId,
            },
        });

        if(!team) {
            return res.status(404).json({
                error:"Team not found",
            });
        }

        //Check if user is team creator or admin 
        if (
            team.createdBy !== req.user.id &&
            req.user.role !== "ADMIN"
        ) {
            return res.status(403).json({
                error: "Not allowed to perform this action",
            });
        }

        //Update the team 
        const updatedTeam = await prisma.teams.update({
            where: {
                id: teamId,
            },
            data: {
                ...(name !== undefined && { name }),
                ...(city !== undefined && { city }),
                ...(logo !== undefined && { logo }),              
            },
        });

        return res.status(200).json({
            status: "success",
            message: "Team updated successfully",
            data: updatedTeam
        });
    } catch (error){
        console.error(error);

        return res.status(500).json({
            error: "Internal server error",
        });
    }

 };

 const deleteTeam = async (req, res) => {
    try {
        const { teamId } = req.params;

        //Check that the team exists
        const team = await prisma.teams.findUnique({
            where: {
                id: teamId,
            },
        });
        if (!team) {
            return res.status(404).json({
                error: "Team not found",
            });
        }

        //Only team creator or admin can delete the team 
        if (
            team.createdBy !== req.user.id &&
            req.user.role !== "ADMIN"
        ) {
            return res.status(403).json({
                error: "Not allowed to perform this action",
            });
        }

        //Delete the team
        await prisma.teams.delete({
            where: {
                id: teamId,
            },
        });

        return res.status(200).json({
            status: "success",
            message: "Team deleted succesfully",
        });
    } catch (error){
        console.error(error);

        return res.status(500).json({
            error: "Internal server error",
        });
    }
 };

const recordPlayerMatchStatistic = async (req, res) => {
    try {
        const { matchId } = req.params;
        const { playerId, goals, assists } = req.body;

        //Find the match 
        const match = await prisma.match.findUnique({
            where: {
                id: matchId,
            },
        });

        if (!match){
            return res.status(404).json({
                error: "Match not found",
            });
        }

        //Match must be complete before recording statistics
        if (match.status !== "FINISHED") {
            return res.status(400).json({
                error: "Player statistics can only be recorded for completed matches",
            });
        }

        //Find the players team membership
        const teamMember = await prisma.teamMember.findUnique({
            where:{
                userId: playerId,
            },
        });

        if(!teamMember){
            return res.status(404).json({
                error: "Player is not assigned to a team",
            });
        }

        //Check that players team participated in the match
        const playerIsInMatch =
        teamMember.teamId === match.homeTeamId ||
        teamMember.teamId === match.awayTeamId;

        if(!playerIsInMatch){
            return res.status(404).json({
                error: "Player did not participate in this match",
            });
        }

        //Check if statistics have already been recorded
        const existingStats = await prisma.playerMatchStatistic.findUnique({
            where:{
                matchId_playerId: {
                    matchId: matchId,
                    playerId: playerId,
                },
            },
        });

        if(existingStats) {
            return res.status(409).json({
                error: "Statistics have already been recorded for this player in this match"
            });
        }

        //Create match statistics
       const result = await prisma.$transaction(async (tx) => {

    // Create the player's statistics for this match
    const playerMatchStats =
        await tx.playerMatchStatistic.create({
            data: {
                matchId: matchId,
                playerId: playerId,
                goals: goals,
                assists: assists,
            },
        });

    // Update the player's overall statistics
    const playerStats =
        await tx.playerStatistic.update({
            where: {
                playerId: playerId,
            },
            data: {
                goals: {
                    increment: goals,
                },
                assists: {
                    increment: assists,
                },
            },
        });

    return {
        playerMatchStats,
        playerStats,
    };
});

        return res.status(201).json({
            status: "success",
            messgae: "Player match statistics recorded succesfully",
            data: result,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Internal server error",
        });
    }
};

export {
          createTeam, 
          addPlayerToTeam, 
          removeFromTeam, 
          getTeamPlayers, 
          updateTeam, 
          deleteTeam,
          getPlayerStats,
          recordPlayerMatchStatistic
        };