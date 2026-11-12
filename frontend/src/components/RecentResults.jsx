
import { Trophy, CalendarDays } from "lucide-react";

function RecentResults() {
  const results = [
    {
      id: 1,
      homeTeam: "FC United",
      awayTeam: "City Rovers",
      homeScore: 3,
      awayScore: 1,
      date: "8 November",
      outcome: "Win"
    },
    {
      id: 2,
      homeTeam: "Greenfield FC",
      awayTeam: "FC United",
      homeScore: 2,
      awayScore: 2,
      date: "1 November",
      outcome: "Draw"
    },
    {
      id: 3,
      homeTeam: "FC United",
      awayTeam: "Athletic Club",
      homeScore: 0,
      awayScore: 2,
      date: "25 October",
      outcome: "Loss"
    }
  ];

  return (
    <section className="recent-results">
      <div className="section-heading">
        <div>
          <h2>Recent Results</h2>
          <p>How your team has performed recently</p>
        </div>
      </div>

      <div className="results-list">
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

            <span className={`result-status ${result.outcome.toLowerCase()}`}>
              {result.outcome}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default RecentResults;
