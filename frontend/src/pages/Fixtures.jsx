
import { useState } from "react";
import FixtureCard from "../components/FixtureCard";

function Fixtures() {
  const [filter, setFilter] = useState("all");

  // Temporary data until we connect the backend
  const fixtures = [
    {
      id: 1,
      homeTeam: "FC United",
      awayTeam: "City Rovers",
      date: "14 November 2026",
      time: "15:00",
      competition: "Premier Division",
      location: "Home",
      status: "upcoming"
    },
    {
      id: 2,
      homeTeam: "Greenfield FC",
      awayTeam: "FC United",
      date: "18 November 2026",
      time: "18:30",
      competition: "Premier Division",
      location: "Away",
      status: "upcoming"
    },
    {
      id: 3,
      homeTeam: "FC United",
      awayTeam: "Athletic Club",
      date: "8 November 2026",
      time: "14:00",
      competition: "Premier Division",
      location: "Home",
      status: "completed"
    }
  ];

  const filteredFixtures =
    filter === "all"
      ? fixtures
      : fixtures.filter((fixture) => fixture.status === filter);

  return (
    <div className="fixtures-page">
      <div className="page-heading">
        <h1>Fixtures</h1>
        <p>View your team's scheduled matches.</p>
      </div>

      <div className="fixture-filters">
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          All
        </button>

        <button
          className={filter === "upcoming" ? "active" : ""}
          onClick={() => setFilter("upcoming")}
        >
          Upcoming
        </button>

        <button
          className={filter === "completed" ? "active" : ""}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
      </div>

      <div className="fixtures-list">
        {filteredFixtures.map((fixture) => (
          <FixtureCard
            key={fixture.id}
            fixture={fixture}
          />
        ))}
      </div>
    </div>
  );
}

export default Fixtures;
