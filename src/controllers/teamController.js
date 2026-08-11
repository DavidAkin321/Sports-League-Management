import { prisma } from "../config/db";


const addPlayerToTeam = async (req, res) => {
    try{


    const {userId, position, jerseyNumber } = req.body;

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

    //Verify user exists
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
    const exisitingInTeam = await prisma.teamMember.findUnique({
        where:{userId},
    });

    if (existingMembership){
        return res.status(400).json({
            error: "Player is already assigned to a team",
        });
    }

    //Create Team Membership
    const teamMember = await prisma.teamMember.create({
        data: {
            userId,
            teamId,
            playerPosition: position,
            jerseyNumber,
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

export {addPlayerToTeam};