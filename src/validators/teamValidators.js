import {z} from "zod"


const createTeamSchema = z.object({
    name: z.string().min(2, "Team name is required"),
    city: z.string().min(2, "City is required"),
    logo: z.string().url().optional()
})

const addPlayerToTeamSchema = z.object({
    userId: z.string().uuid(),
    position: z.enum([
        "GK", 
        "RB", "RWB", 
        "CB", "LCB", "RCB", 
        "LB", "LWB", 
        "CDM", "CM", "CAM", 
        "RW", "LW", "CF",
        "ST"
    ], { error : () => ({
        message:"Must be a specified position"
    }),
}),
    jerseyNumber: z
    .number()
    .int()
    .min(1, "Must give a jersey number")
    .max(99, "Jersey number cannot exceed 99")
});

const updateTeamSchema = z.object({
     name: z.string().min(2, "Team name must be at least 2 characters").optional(),
     city: z.string().min(2, "City must be at least 2 characters").optional(),
     logo: z.string().url("Logo must be a valid URL").optional()
});

export { createTeamSchema, addPlayerToTeamSchema, updateTeamSchema };