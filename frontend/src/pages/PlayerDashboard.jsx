
import {
  Trophy,
  Target,
  CalendarDays,
  Medal
} from "lucide-react";

import StatCard from "../components/StatCard";
import UpcomingFixtures from "../components/UpcomingFixtures";

function PlayerDashboard() {
  return (
    <div className="player-dashboard">

      <h1>Welcome back!</h1>
      <p>Here's your performance overview.</p>

      <div className="stats-grid">

        <StatCard
          title="Matches Played"
          value="12"
          description="This season"
          icon={CalendarDays}
        />

        <StatCard
          title="Wins"
          value="8"
          description="This season"
          icon={Trophy}
        />

        <StatCard
          title="Goals Scored"
          value="24"
          description="This season"
          icon={Target}
        />

        <StatCard
          title="League Position"
          value="#2"
          description="Current ranking"
          icon={Medal}
        />

      </div>

      <UpcomingFixtures />
    </div>
  );
}

export default PlayerDashboard;
