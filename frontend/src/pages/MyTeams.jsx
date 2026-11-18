
import { useEffect, useState } from "react";
import { Users, Shield, CalendarDays } from "lucide-react";
import api from "../services/api";

function MyTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyTeams = async () => {
      try {
        const response = await api.get("/team/my-teams");

        setTeams(response.data.data.teams);
      } catch (error) {
        console.error("Failed to fetch teams:", error);
        setError(
          error.response?.data?.error || "Unable to load your teams."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMyTeams();
  }, []);

  if (loading) {
    return <div className="my-teams">Loading your teams...</div>;
  }

  if (error) {
    return <div className="my-teams">{error}</div>;
  }

  return (
    <div className="my-teams">
      <div className="page-heading">
        <h1>My Teams</h1>
        <p>View the teams you are currently part of.</p>
      </div>

      {teams.length === 0 ? (
        <p>You are not currently a member of any teams.</p>
      ) : (
        <div className="teams-grid">
          {teams.map((team) => (
            <div className="team-card" key={team.id}>
              <div className="team-card-header">
                <div className="team-icon">
                  <Shield size={26} />
                </div>

                <span className="team-role">Team Member</span>
              </div>

              <h2>{team.name}</h2>

              <div className="team-information">
                <div>
                  <Users size={16} />
                  <span>Team ID: {team.id}</span>
                </div>

                <div>
                  <CalendarDays size={16} />
                  <span>
                    Created{" "}
                    {new Date(team.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyTeams;
