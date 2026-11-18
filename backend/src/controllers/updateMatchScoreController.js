import { prisma } from "../config/db.js";

const updateMatchScore = async (req, res) => {
    try {

        const { leagueId, matchId } = req.params;

        // Check if league exists
        const league = await prisma.league.findUnique({
            where: {
                id: leagueId,
            }
        });

        if (!league) {
            return res.status(404).json({
                error: "League not found"
            });
        }

        // Check if match exists
        const match = await prisma.match.findUnique({
            where: {
                id: matchId,
            }
        });

        if (!match) {
            return res.status(404).json({
                error: "Match not found"
            });
        }

        // Check if match belongs to this league
        if (match.leagueId !== leagueId) {
            return res.status(400).json({
                error: "Match does not belong to this league"
            });
        }

        // Check if user is admin or league organiser
        if (
            league.createdBy !== req.user.id &&
            req.user.role !== "ADMIN"
        ) {
            return res.status(403).json({
                error: "You are not authorised to perform this action"
            });
        }

        //Get scores from request body
        const { homeScore, awayScore } = req.body;

        //Update match
        const updatedMatch = await prisma.match.update({
            where: {
                id: matchId,
            },
            data: {
                homeScore,
                awayScore,
                status:"FINISHED",
            }
        });

        return res.status(200).json({
            status: "success",
            message: "Match score successfully updated",
            match: updatedMatch,
        });


    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Internal server error"
        });
    }
};

export { updateMatchScore };