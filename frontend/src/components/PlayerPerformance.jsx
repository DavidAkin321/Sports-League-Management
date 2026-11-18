import { useEffect, useState } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from "recharts";

import {
  Target,
  Footprints,
  CalendarDays,
  Trophy
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function PlayerPerformance() {
  const { user } = useAuth();

  const [playerStats, setPlayerStats] = useState({
    goals: 0,
    assists: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlayerStats = async () => {
      try {
        const response = await api.get(
          `/team/players/${user.id}/stats`
        );

        const stats = response.data.data.status;

        setPlayerStats({
          goals: stats.goals,
          assists: stats.assists
        });

      } catch (error) {
        console.error("Failed to fetch player statistics:", error);

        setError(
          error.response?.data?.error ||
          "Unable to load your statistics."
        );
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchPlayerStats();
    }
  }, [user?.id]);

  const stats = [
    {
      title: "Goals",
      value: playerStats.goals,
      icon: Target
    },
    {
      title: "Assists",
      value: playerStats.assists,
      icon: Footprints
    },
    {
      title: "Appearances",
      value: "—",
      icon: CalendarDays
    },
    {
      title: "Goal Contributions",
      value: playerStats.goals + playerStats.assists,
      icon: Trophy
    }
  ];

  return (
    <section className="player-performance">
      <div className="section-heading">
        <div>
          <h2>My Performance</h2>
          <p>Your individual statistics this season</p>
        </div>
      </div>

      {loading ? (
        <p>Loading your statistics...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <div className="performance-stats">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  className="performance-stat-card"
                  key={stat.title}
                >
                  <div className="performance-stat-icon">
                    <Icon size={20} />
                  </div>

                  <div>
                    <p>{stat.title}</p>
                    <h3>{stat.value}</h3>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="performance-chart-card">
            <div className="chart-heading">
              <h3>Goals & Assists</h3>
              <span>Match-by-match breakdown</span>
            </div>

            <div className="performance-chart">
              <p>
                Your overall goals and assists are available above.
                Match-by-match statistics will appear here once
                historical match data is connected.
              </p>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default PlayerPerformance;
