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
    const teamMember = await prisma.teamMember.create({
        data: {
            userId: userId,
            teamId,
            playerPosition: position,
            jerseyNumber,
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

    //Success
    return res.status(201).json({
        status: "success",
        message: "Player added succesfully",
        data: teamMember,
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
                ...(city !== undefined && { name }),
                ...(logo !== undefined && { name }),              
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

        //Check tht the team exists
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
export {
          createTeam, 
          addPlayerToTeam, 
          removeFromTeam, 
          getTeamPlayers, 
          updateTeam, 
          deleteTeam 
        };