
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

function PlayerPerformance() {
  const performanceData = [
    { match: "Match 1", goals: 2, assists: 1 },
    { match: "Match 2", goals: 1, assists: 0 },
    { match: "Match 3", goals: 0, assists: 2 },
    { match: "Match 4", goals: 3, assists: 1 },
    { match: "Match 5", goals: 1, assists: 1 }
  ];

  
const stats = [
  {
    title: "Goals",
    value: 7,
    icon: Target
  },
  {
    title: "Assists",
    value: 5,
    icon: Footprints
  },
  {
    title: "Appearances",
    value: 10,
    icon: CalendarDays
  },
  {
    title: "Goal Contributions",
    value: 12,
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

      <div className="performance-stats">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div className="performance-stat-card" key={stat.title}>
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
          <span>Last 5 matches</span>
        </div>

        <div className="performance-chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#292938"
              />

              <XAxis
                dataKey="match"
                stroke="#9292a5"
              />

              <YAxis stroke="#9292a5" />

              <Tooltip
                contentStyle={{
                  background: "#191925",
                  border: "1px solid #292938",
                  borderRadius: "8px"
                }}
              />

              <Legend />

              <Bar
                dataKey="goals"
                name="Goals"
                fill="#8b5cf6"
                radius={[5, 5, 0, 0]}
              />

              <Bar
                dataKey="assists"
                name="Assists"
                fill="#38bdf8"
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}

export default PlayerPerformance;
