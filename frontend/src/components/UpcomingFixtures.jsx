
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FixtureCard from "./FixtureCard";
import api from "../services/api";

function UpcomingFixtures() {
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
          "Unable to load upcoming fixtures."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFixtures();
  }, []);

  return (
    <section className="upcoming-fixtures">
      <div className="section-heading">
        <div>
          <h2>Upcoming Fixtures</h2>
          <p>Your next scheduled matches</p>
        </div>

        <Link to="/fixtures" className="view-all-btn">
          View all
        </Link>
      </div>

      {loading ? (
        <p>Loading upcoming fixtures...</p>
      ) : error ? (
        <p>{error}</p>
      ) : fixtures.length === 0 ? (
        <p>You have no upcoming fixtures scheduled.</p>
      ) : (
        <div className="fixtures-list">
          {fixtures.slice(0, 3).map((fixture) => (
            <FixtureCard
              key={fixture.id}
              fixture={{
                id: fixture.id,
                homeTeam: fixture.homeTeam.name,
                awayTeam: fixture.awayTeam.name,
                date: new Date(fixture.matchDate).toLocaleDateString(
                  "en-IE",
                  {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
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
                location: fixture.homeTeamId ===
                  fixture.homeTeam.id
                  ? "Home"
                  : "Away",
                status: "upcoming",
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default UpcomingFixtures;
