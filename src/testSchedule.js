import {
  generateRoundRobinFixtures,
  generateTimeSlots,
  scheduleTournament,
  canScheduleMatch,
  findAvailableSlots,
  validateSchedule
} from "./services/scheduleService.js";

const teams = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
];

const fixtures = generateRoundRobinFixtures(teams);

const timeSlots = [
  "10:00",
  "10:25",
  "10:50",
  "11:15",
  "11:40",
  "12:05",
  "12:30",
  "12:55",
  "13:20",
  "13:45",
  "14:10",
  "14:35",
  "15:00",
  "15:25",
];

const scheduledTournament = scheduleTournament(
  fixtures,
  timeSlots,
  2
);

console.log("SCHEDULED TOURNAMENT:");
console.log(
  JSON.stringify(scheduledTournament, null, 2)
);

const validationResult =
  validateSchedule(scheduledTournament);

console.log("VALIDATION RESULT:");
console.log(validationResult);