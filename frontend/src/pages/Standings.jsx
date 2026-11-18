
import LeagueStandings from "../components/LeagueStandings";

function Standings() {
  return (
    <div className="standings-page">
      <div className="page-heading">
        <h1>League Standings</h1>
        <p>View the current league table and team rankings.</p>
      </div>

      <LeagueStandings />
    </div>
  );
}

export default Standings;
