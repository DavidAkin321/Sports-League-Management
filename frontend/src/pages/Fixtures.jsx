
import { useEffect, useState } from "react";
import FixtureCard from "../components/FixtureCard";
import api from "../services/api";

function Fixtures() {
  const [filter, setFilter] = useState("all");
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        const response = await api.get("/team/my-fixtures");

        setFixtures(response.data.data.fixtures);
      } catch (error) {
        console.error("Failed to fetch fixtures:", error);

        setError(
          error.response?.data?.error ||
          "Unable to load fixtures."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFixtures();
  }, []);

  const filteredFixtures =
    filter === "all"
      ? fixtures
      : filter === "upcoming"
        ? fixtures.filter(
            (fixture) => fixture.status === "SCHEDULED"
          )
        : [];

  const formatFixture = (fixture) => ({
    id: fixture.id,
    homeTeam: fixture.homeTeam.name,
    awayTeam: fixture.awayTeam.name,
    date: new Date(fixture.matchDate).toLocaleDateString(
      "en-IE",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    ),
    time: new Date(fixture.matchDate).toLocaleTimeString(
      "en-IE",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    ),
    competition: fixture.league.name,
    location: "Home",
    status: "upcoming",
  });

  return (
    <div className="fixtures-page">
      <div className="page-heading">
        <h1>Fixtures</h1>
        <p>View your team's scheduled matches.</p>
      </div>

      <div className="fixture-filters">
        {["all", "upcoming", "completed"].map((option) => (
          <button
            key={option}
            className={filter === option ? "active" : ""}
            onClick={() => setFilter(option)}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading fixtures...</p>
      ) : error ? (
        <p>{error}</p>
      ) : filteredFixtures.length === 0 ? (
        <p>
          {filter === "completed"
            ? "No completed matches available yet."
            : "No upcoming fixtures found."}
        </p>
      ) : (
        <div className="fixtures-list">
          {filteredFixtures.map((fixture) => (
            <FixtureCard
              key={fixture.id}
              fixture={formatFixture(fixture)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Fixtures;

