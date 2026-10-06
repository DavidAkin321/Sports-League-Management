import { prisma } from "../config/db.js";
import { 
    generateRoundRobinFixtures,
    generateTimeSlots,
    scheduleTournament,
    validateSchedule
 } from "../services/scheduleService.js";

const generateSchedule = async (req, res) => {
    try {
        const { leagueId } = req.params;

        //Find the league
        const league = await prisma.league.findUnique({
            where: { id: leagueId },
            include: {
                settings: true,
                leagueTeams: {
                    include: {
                        team : true,
                    },
                },
            },
        });

        const existingMatches = await prisma.match.count({
            where: {
                leagueId,
            },
        });

        if (existingMatches > 0) {
            return res.status(409).json({
                error: "A schedule has already been generated for this league",
            });
        }

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
        
        //Make sure settings exist
        if (!league.settings) {
            return res.status(400).json({
                error: "League settings must be created before generating a schedule",
            });
        }

        //Make sure there are enough teams
        if (league.leagueTeams.length < 2) {
            return res.status(400).json({
                error: "AT least 2 teams are required to generate a schedule",
            });
        }

        //Get the teams
        const teams = league.leagueTeams.map((leagueTeam) => ({
            id: leagueTeam.team.id,
            name: leagueTeam.team.name,
        }));

        //Generate round robin fixtures
        const fixtures = generateRoundRobinFixtures(teams);

        //Generate Time slots
        const timeSlots = generateTimeSlots(
            league.settings.startTime,
            league.settings.endTime,
            league.settings.matchDuration,
            league.settings.breakDuration,
        );

        //Schedule the fixtures
        const scheduledMatches = scheduleTournament(
            fixtures,
            timeSlots,
            league.settings.surfaces
        );

        //Validate the generated schedule
        const validationResult = validateSchedule(scheduledMatches);

        if(!validationResult.valid) {
            return res.status(400).json({
                error: "Generated schedule is invalid",
                details: validationResult.error,
            });
        }

        //Save matches to database
        const matches = await prisma.$transaction(
            scheduledMatches.map((match) =>
                prisma.match.create({
                    data: {
                        leagueId: league.id,
                        homeTeamId: match.homeTeam.id,
                        awayTeamId: match.awayTeam.id,

                        status: "SCHEDULED",
                        stage: "GROUP",
                        round: match.round,

                        surface: match.surface,

                        matchDate: new Date(
                            `${league.settings.tournamentDate
                                .toISOString()
                                .split("T")[0]}T${match.time}:00`
                        ),

                        createdBy: req.user.id,
                    },
                }) 
            )
        );

        //Return the generated shedule
        return res.status(201).json({
            status: "success",
            message: "Schedule generated successfully",
            leagueId: league.id,
            matches,
        });

    } catch (error){
        console.error(error);

        return res.status(500).json({
            error:"Internal server error",
        });
    }
};

export { generateSchedule };