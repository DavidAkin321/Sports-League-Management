
import { CalendarDays, Trophy } from "lucide-react";

function Results() {
  const results = [
    {
      id: 1,
      homeTeam: "FC United",
      awayTeam: "City Rovers",
      homeScore: 3,
      awayScore: 1,
      date: "8 November 2026",
      competition: "Premier Division",
      outcome: "Win"
    },
    {
      id: 2,
      homeTeam: "Greenfield FC",
      awayTeam: "FC United",
      homeScore: 2,
      awayScore: 2,
      date: "1 November 2026",
      competition: "Premier Division",
      outcome: "Draw"
    },
    {
      id: 3,
      homeTeam: "FC United",
      awayTeam: "Athletic Club",
      homeScore: 0,
      awayScore: 2,
      date: "25 October 2026",
      competition: "Premier Division",
      outcome: "Loss"
    },
    {
      id: 4,
      homeTeam: "Westside FC",
      awayTeam: "FC United",
      homeScore: 1,
      awayScore: 2,
      date: "18 October 2026",
      competition: "Premier Division",
      outcome: "Win"
    }
  ];

  return (
    <div className="results-page">
      <div className="page-heading">
        <h1>Match Results</h1>
        <p>View your team's completed matches and results.</p>
      </div>

      <div className="results-page-list">
        {results.map((result) => (
          <div className="result-card" key={result.id}>
            <div className="result-date">
              <CalendarDays size={15} />
              <span>{result.date}</span>
            </div>

            <div className="result-match">
              <span>{result.homeTeam}</span>

              <strong>
                {result.homeScore} - {result.awayScore}
              </strong>

              <span>{result.awayTeam}</span>
            </div>

            <div className="result-card-footer">
              <span>{result.competition}</span>

              <span className={`result-status ${result.outcome.toLowerCase()}`}>
                {result.outcome}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Results;
