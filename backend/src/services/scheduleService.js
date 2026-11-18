import { hostname } from "zod";


//Who plays who
const generateRoundRobinFixtures = (teams) => {

    //We need at least 2 teams
    if(teams.length < 2) {
        throw new Error("At least 2 teams are required");
    }

    //Work with a copy so we dont modify the original array
    let teamList = [...teams];

    //Add a bye so everyone still has a round even if its an odd number of temas
    if (teamList.length % 2 !== 0) {
        teamList.push(null);
    }

    const numberOfRounds = teamList.length - 1;
    const matchesPerRound = teamList.length / 2;

    const rounds = [];

    for(let round = 1; round <= numberOfRounds; round++){
        const matches = [];

        for (let i = 0; i < matchesPerRound; i++){
            const homeTeam = teamList[i];
            const awayTeam = teamList[teamList.length - 1 - i];

            //Dont create a match against a BYE
        if (homeTeam !== null && awayTeam !==null) {
            matches.push({
                homeTeam,
                awayTeam,
            });
        }
        }

        rounds.push({
            round,
            matches,
        });
        
        //Rotate teams for the next round 
        const fixedTeam = teamList[0];

        const rotatingTeams = teamList.slice(1);

        rotatingTeams.unshift(rotatingTeams.pop());

        teamList = [fixedTeam, ...rotatingTeams];
    }

    return rounds;
};

//Generates available times 
const generateTimeSlots = (
    startTime,
    endTime,
    matchDuration,
    breakDuration

) => {
    const slots = [];

    const[startHour, startMinute] = startTime.split(":").map(Number);
    const[endHour, endMinute] = endTime.split(":").map(Number);

    let currentMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    const slotDuration = matchDuration + breakDuration;

    while ( currentMinutes + matchDuration <= endMinutes ){
        const hours = Math.floor(currentMinutes / 60);
        const minutes = currentMinutes % 60;

        const formattedTime =
        `${String(hours).padStart(2,"0")}:`+
        `${String(minutes).padStart(2,"0")}`;

        slots.push(formattedTime);

        currentMinutes += slotDuration;
    }

    return slots;
};

const scheduleRound = (
  round,
  timeSlots,
  surfaces,
  scheduledMatches = []
) => {
  const scheduledRound = [];

  for (const match of round.matches) {
    const availableSlot = findAvailableSlots(
      match,
      timeSlots,
      surfaces,
      scheduledMatches
    );

    if (!availableSlot) {
      throw new Error(
        `No available slot found for ${match.homeTeam} vs ${match.awayTeam}`
      );
    }

    const scheduledMatch = {
      round: round.round,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      time: availableSlot.time,
      surface: availableSlot.surface,
    };

    scheduledRound.push(scheduledMatch);
    scheduledMatches.push(scheduledMatch);
  }

  return scheduledRound;
};

const canScheduleMatch = (
  match,
  time,
  timeSlots,
  scheduledMatches
) => {
  const currentIndex = timeSlots.indexOf(time);
  const previousTime = timeSlots[currentIndex - 1];

  // Check if either team is already playing at this time
  const teamAlreadyPlaying = scheduledMatches.some(
    scheduledMatch =>
      scheduledMatch.time === time &&
      (
        scheduledMatch.homeTeam === match.homeTeam ||
        scheduledMatch.awayTeam === match.homeTeam ||
        scheduledMatch.homeTeam === match.awayTeam ||
        scheduledMatch.awayTeam === match.awayTeam
      )
  );

  // If this is the first time slot,
  // there is no previous slot to worry about.
  if (previousTime === undefined) {
    return !teamAlreadyPlaying;
  }

  // Check if either team played in the previous slot
  const teamPlayedPreviousSlot = scheduledMatches.some(
    scheduledMatch =>
      scheduledMatch.time === previousTime &&
      (
        scheduledMatch.homeTeam === match.homeTeam ||
        scheduledMatch.awayTeam === match.homeTeam ||
        scheduledMatch.homeTeam === match.awayTeam ||
        scheduledMatch.awayTeam === match.awayTeam
      )
  );

  return !teamAlreadyPlaying && !teamPlayedPreviousSlot;
};

//Finds time and surface
const findAvailableSlots = (
  match,
  timeSlots,
  surfaces,
  scheduledMatches
) => {
  for (const time of timeSlots) {
    for (let surface = 1; surface <= surfaces; surface++) {

      const surfaceOccupied = scheduledMatches.some(
        scheduledMatch =>
          scheduledMatch.time === time &&
          scheduledMatch.surface === surface
      );

      if (
        !surfaceOccupied &&
        canScheduleMatch(
          match,
          time,
          timeSlots,
          scheduledMatches
        )
      ) {
        return { time, surface };
      }
    }
  }

  return null;
};

const scheduleTournament = (
  rounds,
  timeSlots,
  surfaces
) => {
  const scheduledMatches = [];

  let timeIndex = 0;

  for (const round of rounds) {
    const matches = [...round.matches];

    while (matches.length > 0) {

      if (timeIndex >= timeSlots.length) {
        throw new Error(
          `Not enough time slots to schedule round ${round.round}`
        );
      }

      const time = timeSlots[timeIndex];

      for (
        let surface = 1;
        surface <= surfaces && matches.length > 0;
        surface++
      ) {
        const match = matches.shift();

        scheduledMatches.push({
          round: round.round,
          homeTeam: match.homeTeam,
          awayTeam: match.awayTeam,
          time,
          surface,
        });
      }

      timeIndex++;
    }

    // Leave one time slot between rounds
    timeIndex++;
  }

  return scheduledMatches;
};

const validateSchedule = (scheduledMatches) => {
    //Check total matches
    const expectedMatches =
    scheduledMatches.length;

    if (expectedMatches === 0) {
        return {
            valid: false,
            error: "Schedule contains no matches",
        };
    }

    //Check for surface conflicts
    for (let i = 0; i < scheduledMatches.length; i++){
        for (let j = i + 1; j < scheduledMatches.length; j++) {
            const matchA = scheduledMatches[i];
            const matchB = scheduledMatches[j];

            if (
                matchA.time === matchB.time &&
                matchA.surface === matchB.surface
            ) {
                return {
                    valid: false,
                    error: `Surface conflict at ${matchA.time} on surface ${matchA.surface}`,
                };
            }

        }
    }

    // Check teams aren't playing at the same time 
    for (let i = 0; i < scheduledMatches.length; i++) {
        for (let j = i + 1; j < scheduledMatches.length; j++) {
            const matchA = scheduledMatches[i];
            const matchB = scheduledMatches[j];

            if (matchA.time !== matchB.time) {
                continue;
            }

            const teamsA = [
                matchA.homeTeam,
                matchA.awayTeam,
            ];

            const teamsB = [
                matchB.homeTeam,
                matchB.awayTeam,
            ];

            const teamConflict = teamsA.some(
                team => teamsB.includes(team)
            );

            if (teamConflict) {
                return {
                    valid: false,
                    error: `Team conflict at ${matchA.time}`,
                };
            }
        }
    }

    return {
        valid: true,
    };
};

export { 
    generateRoundRobinFixtures, 
    generateTimeSlots,
    scheduleRound,
    canScheduleMatch,
    findAvailableSlots,
    scheduleTournament,
    validateSchedule
 };