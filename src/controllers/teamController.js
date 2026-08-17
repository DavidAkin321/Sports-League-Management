import { prisma } from "../config/db.js";

//Create Team to be created 

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

export {addPlayerToTeam, removeFromTeam};