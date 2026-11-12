
function LeagueStandings() {
  const standings = [
    { position: 1, team: "City Rovers", played: 12, wins: 9, draws: 2, losses: 1, points: 29 },
    { position: 2, team: "FC United", played: 12, wins: 8, draws: 2, losses: 2, points: 26 },
    { position: 3, team: "Athletic Club", played: 12, wins: 7, draws: 2, losses: 3, points: 23 },
    { position: 4, team: "Greenfield FC", played: 12, wins: 5, draws: 3, losses: 4, points: 18 },
    { position: 5, team: "Westside FC", played: 12, wins: 3, draws: 2, losses: 7, points: 11 }
  ];

  return (
    <section className="league-standings">
      <div className="section-heading">
        <div>
          <h2>League Standings</h2>
          <p>Current Premier Division table</p>
        </div>

        <button className="view-all-btn">
          Full table
        </button>
      </div>

      <div className="standings-table-wrapper">
        <table className="standings-table">
          <thead>
            <tr>
              <th>Pos</th>
              <th>Team</th>
              <th>P</th>
              <th>W</th>
              <th>D</th>
              <th>L</th>
              <th>Pts</th>
            </tr>
          </thead>

          <tbody>
            {standings.map((team) => (
              <tr
                key={team.position}
                className={team.team === "FC United" ? "current-team" : ""}
              >
                <td>{team.position}</td>
                <td className="standings-team-name">{team.team}</td>
                <td>{team.played}</td>
                <td>{team.wins}</td>
                <td>{team.draws}</td>
                <td>{team.losses}</td>
                <td className="standings-points">{team.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default LeagueStandings;
