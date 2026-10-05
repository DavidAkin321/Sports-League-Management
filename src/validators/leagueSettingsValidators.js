import { z } from "zod";

const leagueSettingsSchema = z.object({
  tournamentDate: z.coerce.date(),

  startTime: z.string().regex(
    /^([01]\d|2[0-3]):([0-5]\d)$/,
    "Start time must be in HH:MM format"
  ),

  endTime: z.string().regex(
    /^([01]\d|2[0-3]):([0-5]\d)$/,
    "End time must be in HH:MM format"
  ),

  matchDuration: z.number().int().positive(),

  breakDuration: z.number().int().min(0),

  surfaces: z.number().int().positive(),
});

export { leagueSettingsSchema };