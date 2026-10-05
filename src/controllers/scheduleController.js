import { prisma } from "../config/db.js";
import { generateRoundRobinFixtures } from "../services/scheduleService.js";

const generateSchedule = async (req, res) => {
    try {
        const { leagueId } = req.params;

        //Check that league exists
        const league = await prisma.league.findUnique({
            where: { id: leagueId },
        });

        if (!league) {
            return res.status(404).json({
                error: "League not found",
            });
        }

        //Check that the user owns the League or is an admin 
        if (
            league.createdBy !== req.user.id &&
            req.user.role !== "ADMIN"
        ) {
            return res.status(403).json({
                error: "You are not allowed to generate this league's schedule",
            });
        }

        //Get all the teams registered in the league
        const leagueTeams = await prisma.leagueTeam.findMany({
            where: {
                leagueId,
            },
            include: {
                team: true,
            },
        });

        //Make sure we have enough teams
        if(leagueTeams.length < 2){
            return res.status(400).json({
                error: "At least 2 teams are required to generate schedule",
            });
        }

        //Extract the actual teams
        const teams = leagueTeams.map((leagueTeam) => ({
            id: leagueTeam.team.id,
            name: leagueTeam.team.name,
        }));

        //Generate round-robin fixtures
        const fixtures = generateRoundRobinFixtures(teams);

        return res.status(200).json({
            status: "success",
            message: "Schedule generated succesfully",
            leagueId,
            fixtures,
        });
    } catch (error) {
        console.error(error);
        
        return res.status(500).json({
            error: "Internal server error",
        });
    }
};

export { generateSchedule };