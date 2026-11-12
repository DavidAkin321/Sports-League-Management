
import UpcomingFixtures from "../components/UpcomingFixtures";
import RecentResults from "../components/RecentResults";
import LeagueStandings from "../components/LeagueStandings";
import PlayerPerformance from "../components/PlayerPerformance";

function PlayerDashboard() {
  return (
    <div className="player-dashboard">
      <h1>Welcome back!</h1>
      <p>Here's your performance overview.</p>

      <PlayerPerformance />

      <UpcomingFixtures />

      <RecentResults />

      <LeagueStandings />
    </div>
  );
}

export default PlayerDashboard;

