import { z } from "zod";

const createLeagueSchema = z.object({
    name: z.string().min(2, "League name must be at least 2 characters"),
    season: z.string().min(4, "Season is required"),
});

const addTeamToLeagueSchema = z.object({
    teamId: z.string().uuid("Invalid team ID"),
});

export { 
    createLeagueSchema,
    addTeamToLeagueSchema,
 };