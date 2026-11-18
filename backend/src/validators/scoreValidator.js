import { z } from "zod";

const scoreSchema = z.object({
    homeScore: z.number().int().min(0),
    awayScore: z.number().int().min(0)
});

export { scoreSchema }