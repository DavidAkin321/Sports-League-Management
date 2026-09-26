import { z } from "zod";

const createLeagueSchema = z.object({
    name: z.string().min(2, "League name must be at least 2 characters"),
    season: z.string().min(4, "Season is required"),
});

const addTeamToLeagueSchema = z.object({
    teamId: z.string().uuid("Invalid team ID"),
});

const updateLeagueSchema = z.object({
    name: z.string().min(2, "League name must be at least 2 characters").optional(),
    season: z.string().min(4, "Season is required").optional(),
}) 
.refine(
    (data) => data.name !== undefined || data.season !== undefined,
    {
        message: "Atleast one field must be provided",
    }
);

export { 
    createLeagueSchema,
    addTeamToLeagueSchema,
    updateLeagueSchema
 };