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

    const getLeagueStandings = async (req, res) => {
        try {
            const {leagueId} = req.params;

            //Check if league exists
            const league = await prisma.league.findUnique({
                where : {
                    id: leagueId
                }
            });
            if(!league){
                return res.status(404).json({
                    error: "League not found"
                });
            }
            //Get all teams in the league
            const leagueTeams = await prisma.leagueTeam.findMany({
                where: {
                    leagueId: leagueId
                },
                include: {
                    team: true
                }
            });


            //Get all finished matches for this league
            const matches = await prisma.match.findMany({
                where: {
                    leagueId: leagueId,
                    status: "FINISHED"
                }
            });

            //Create intial standings
            const standings = {};

            for(const leagueTeam of leagueTeams) {
                standings[leagueTeam.team.id] = {
                    teamId: leagueTeam.team.id,
                    teamName: leagueTeam.teamName,
                    played: 0,
                    won: 0,
                    drawn: 0,
                    lost: 0,
                    goalsFor: 0,
                    goalsAgainst: 0,
                    goalDifference: 0,
                    points: 0
                };
            }
            //Process every finished match
            for(const match of matches) {
                const homeTeam = standings[match.homeTeamId];
                const awayTeam = standings[match.awayTeamId]

                homeTeam.played++;
                awayTeam.played++;

                homeTeam.goalsFor += match.homeScore;
                homeTeam.goalsAgainst += match.awayScore;

                awayTeam.goalsFor += match.awayScore;
                awayTeam.goalsAgainst += match.homeScore;

                //Home team wins
                if(match.homeScore > match.awayScore) {
                    homeTeam.won++;
                    homeTeam.points +=3;

                    awayTeam.lost++;
                }
                //Away team wins

                else if(match.awayScore > match.homeScore){
                    awayTeam.won++;
                    awayTeam.points +=3;

                    homeTeam.lost++;
                }
                //Draw
                else {
                    homeTeam.drawn++;
                    awayTeam.drawn++;

                    homeTeam.points++;
                    awayTeam.points++;
                }
            }

            //Calculate goal difference
            for (const team of Object.values(standings)) {
                team.goalDifference = 
                    team.goalsFor - team.goalsAgainst;
            }

            //Convert object to array
            const standingsTable = Object.values(standings);

            //Sort standings
            standingsTable.sort((a, b) =>{
                if (b.points !== a.points) {
                    return b.points - a.points;
                }

                if (b.goalDifference !== a.goalDifference) {
                    return b.goalDifference - a.goalDifference;
                }

                return b.goalsFor - a.goalsFor;
            });

            return res.status(200).json({
                status:"success",
                leagueId:leagueId,
                standings:standingsTable
            });

        }catch (error){
            console.error(error);

            return res.status(500).json({
                error: "Internal server error",
            });
        }
    };

    const getLeagueResults = async (req, res) => {
        try {
            const { leagueId } = req.params;

            //Find the league
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

            //Find the final 
            const final = await prisma.match.findFirst({
                where: {
                    leagueId: leagueId,
                    stage: "FINAL",
                },
                include: {
                    homeTeam: true,
                    awayTeam: true,
                },
            });

            //Make sure the final exists
            if(!final){
                return res.status(400).json({
                    error: "Final has not been generated yet",
                });
            }

            //Make sure the final has been completed
            if(final.status !== "FINISHED"){
                return res.status(400).json({
                    error: "Final has not yet been completed",
                });
            }

            //Make sure the final was not a draw
            if(final.homeScore === final.awayScore) {
                return res.status(400).json({
                    error: "Final can not be a draw",
                });
            }

            //Determine the champion
            let champion;

            if(final.homeScore > final.awayScore) {
                champion = final.homeTeam;
            } else {
                champion = final.awayTeam;
            }

            return res.status(200).json({
                status: "success",

                league: {
                    id: league.id,
                    name: league.name,
                    season: league.season,
                },

                champion: {
                    teamId: champion.id,
                    teamName: champion.name,
                },

                final: {
                    match: final.id,
                    homeTeam:final.homeTeam.name,
                    awayteam: final.awayTeam.name,
                    homeScore: final.homeScore,
                    awayScore: final.awayScore,
                    matchDate: final.matchDate,
                },
            });

        } catch (error) {
            console.error(error);

            return res.status(500).json({
                error:"Internal server error",
            });
        } 
    };


export { createLeague, addTeamToLeague, getLeagueTeams, getLeagues, updateLeague, deleteLeague, getLeagueStandings, getLeagueResults };