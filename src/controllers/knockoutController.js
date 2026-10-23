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

        // Make sure league settings exist
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
        // until every group match is finished
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

            // Home team wins
            if (match.homeScore > match.awayScore) {
                homeTeam.won++;
                homeTeam.points += 3;
                awayTeam.lost++;

            // Away team wins
            } else if (match.awayScore > match.homeScore) {
                awayTeam.won++;
                awayTeam.points += 3;
                homeTeam.lost++;

            // Draw
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
            // First: points
            if (b.points !== a.points) {
                return b.points - a.points;
            }

            // Second: goal difference
            if (b.goalDifference !== a.goalDifference) {
                return b.goalDifference - a.goalDifference;
            }

            // Third: goals scored
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

        // Find the latest group stage match
        const latestGroupMatch = groupMatches.reduce(
            (latest, match) => {
                return match.matchDate > latest.matchDate
                    ? match
                    : latest;
            }
        );

        // Calculate the first semi-final time
        // using match duration + break duration
        const firstSemiFinalTime = new Date(
            latestGroupMatch.matchDate.getTime() +
            (
                league.settings.matchDuration +
                league.settings.breakDuration
            ) * 60 * 1000
        );

        // Both semi-finals happen at the same time
        // because they are played on different surfaces
        const secondSemiFinalTime = firstSemiFinalTime;

        // Create both semi-finals in one transaction
        const semiFinals = await prisma.$transaction([

            // Semi-final 1
            prisma.match.create({
                data: {
                    leagueId: leagueId,
                    homeTeamId: firstPlace.teamId,
                    awayTeamId: fourthPlace.teamId,
                    status: "SCHEDULED",
                    stage: "SEMI_FINAL",
                    round: 1,
                    matchDate: firstSemiFinalTime,
                    surface: 1,
                    createdBy: req.user.id,
                },
            }),

            // Semi-final 2
            prisma.match.create({
                data: {
                    leagueId: leagueId,
                    homeTeamId: secondPlace.teamId,
                    awayTeamId: thirdPlace.teamId,
                    status: "SCHEDULED",
                    stage: "SEMI_FINAL",
                    round: 1,
                    matchDate: secondSemiFinalTime,
                    surface: 2,
                    createdBy: req.user.id,
                },
            }),
        ]);

        // Return the qualified teams and semi-finals
        return res.status(201).json({
            status: "success",
            message: "Semi-finals generated successfully",
            qualifiedTeams,
            semiFinals,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Internal server error",
        });
    }
};


const generateFinal = async (req, res) => {
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

        // Make sure league settings exist
        if (!league.settings) {
            return res.status(400).json({
                error: "League settings must be created before generating the final",
            });
        }

        // Check if final already exists
        const existingFinal = await prisma.match.findFirst({
            where: {
                leagueId: leagueId,
                stage: "FINAL",
            },
        });

        if (existingFinal) {
            return res.status(409).json({
                error: "Final has already been generated",
            });
        }

        // Get semi-finals
        const semiFinals = await prisma.match.findMany({
            where: {
                leagueId: leagueId,
                stage: "SEMI_FINAL",
            },
        });

        // Make sure both semi-finals exist
        if (semiFinals.length !== 2) {
            return res.status(400).json({
                error: "Both semi-finals must exist before generating the final",
            });
        }

        // Make sure both semi-finals are finished
        const unfinishedSemiFinals = semiFinals.filter(
            match => match.status !== "FINISHED"
        );

        if (unfinishedSemiFinals.length > 0) {
            return res.status(400).json({
                error: "Both semi-finals must be completed before generating the final",
            });
        }

        // Make sure neither semi-final was a draw
        const drawnSemiFinal = semiFinals.find(
            match => match.homeScore === match.awayScore
        );

        if (drawnSemiFinal) {
            return res.status(400).json({
                error: "Semi-finals cannot end in a draw",
            });
        }

        // Determine the finalists
        const finalists = semiFinals.map(match => {
            if (match.homeScore > match.awayScore) {
                return match.homeTeamId;
            }

            return match.awayTeamId;
        });

        // Find the latest semi-final
        const latestSemiFinal = semiFinals.reduce(
            (latest, match) => {
                return match.matchDate > latest.matchDate
                    ? match
                    : latest;
            }
        );

        // Calculate final time
        const finalTime = new Date(
            latestSemiFinal.matchDate.getTime() +
            (
                league.settings.matchDuration +
                league.settings.breakDuration
            ) * 60 * 1000
        );

        // Create final
        const final = await prisma.match.create({
            data: {
                leagueId: leagueId,
                homeTeamId: finalists[0],
                awayTeamId: finalists[1],
                status: "SCHEDULED",
                stage: "FINAL",
                round: 1,
                matchDate: finalTime,
                surface: 1,
                createdBy: req.user.id,
            },
        });

        // Return the final
        return res.status(201).json({
            status: "success",
            message: "Final generated successfully",
            final,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Internal server error",
        });
    }
};


export {
    generateKnockoutStage,
    generateFinal
};