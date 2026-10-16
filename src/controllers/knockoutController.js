import { prisma } from "../config/db.js";

const generateKnockoutStage = async (req, res) => {
    try {
        const { leagueId } = req.params;

        // Find the league
        const league = await prisma.league.findUnique({
            where: {
                id: leagueId,
            },
            include: {
                settings: true,
            },
        });

        if (!league) {
            return res.status(404).json({
                error: "League not found",
            });
        }

        if (!league.settings) {
            return res.status(400).json({
                error: "League settings must be created before generating the knockout stage",
            });
        }

        // Get group stage matches
        const groupMatches = await prisma.match.findMany({
            where: {
                leagueId: leagueId,
                stage: "GROUP",
            },
        });

        // Find unfinished matches
        const unfinishedMatches = groupMatches.filter(
            match => match.status !== "FINISHED"
        );

        // Don't allow knockout stage to start
        if (unfinishedMatches.length > 0) {
            return res.status(400).json({
                error: "All group stage matches must be completed before generating the knockout stage",
            });
        }

        // Get league teams
        const leagueTeams = await prisma.leagueTeam.findMany({
            where: {
                leagueId: leagueId,
            },
            include: {
                team: true,
            },
        });

        // Get finished group matches
        const matches = await prisma.match.findMany({
            where: {
                leagueId: leagueId,
                stage: "GROUP",
                status: "FINISHED",
            },
        });

        // Create standings
        const standings = {};

        for (const leagueTeam of leagueTeams) {
            standings[leagueTeam.team.id] = {
                teamId: leagueTeam.team.id,
                teamName: leagueTeam.team.name,
                played: 0,
                won: 0,
                drawn: 0,
                lost: 0,
                goalsFor: 0,
                goalsAgainst: 0,
                goalDifference: 0,
                points: 0,
            };
        }

        // Process matches
        for (const match of matches) {
            const homeTeam = standings[match.homeTeamId];
            const awayTeam = standings[match.awayTeamId];

            homeTeam.played++;
            awayTeam.played++;

            homeTeam.goalsFor += match.homeScore;
            homeTeam.goalsAgainst += match.awayScore;

            awayTeam.goalsFor += match.awayScore;
            awayTeam.goalsAgainst += match.homeScore;

            if (match.homeScore > match.awayScore) {

                homeTeam.won++;
                homeTeam.points += 3;
                awayTeam.lost++;

            } else if (match.awayScore > match.homeScore) {

                awayTeam.won++;
                awayTeam.points += 3;
                homeTeam.lost++;

            } else {

                homeTeam.drawn++;
                awayTeam.drawn++;

                homeTeam.points++;
                awayTeam.points++;
            }
        }

        // Calculate goal difference
        for (const team of Object.values(standings)) {
            team.goalDifference =
                team.goalsFor - team.goalsAgainst;
        }

        // Sort standings
        const standingsTable = Object.values(standings);

        standingsTable.sort((a, b) => {
            if (b.points !== a.points) {
                return b.points - a.points;
            }

            if (b.goalDifference !== a.goalDifference) {
                return b.goalDifference - a.goalDifference;
            }

            return b.goalsFor - a.goalsFor;
        });

        // Top 4 qualify
        const qualifiedTeams = standingsTable.slice(0, 4);

        if (qualifiedTeams.length < 4) {
            return res.status(400).json({
                error: "At least 4 teams are required for the knockout stage",
            });
        }

        // Get 4 qualified teams
        const firstPlace = qualifiedTeams[0];
        const secondPlace = qualifiedTeams[1];
        const thirdPlace = qualifiedTeams[2];
        const fourthPlace = qualifiedTeams[3];

        // Semi-final matchups
        // 1st vs 4th
        // 2nd vs 3rd

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Internal server error",
        });
    }
};

export { generateKnockoutStage };