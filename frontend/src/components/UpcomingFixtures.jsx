
import FixtureCard from "./FixtureCard";

function UpcomingFixtures() {

  const fixtures = [
    {
      id: 1,
      homeTeam: "FC United",
      awayTeam: "City Rovers",
      date: "Saturday, 14 November",
      time: "15:00",
      competition: "Premier Division",
      location: "Home"
    },
    {
      id: 2,
      homeTeam: "Greenfield FC",
      awayTeam: "FC United",
      date: "Wednesday, 18 November",
      time: "18:30",
      competition: "Premier Division",
      location: "Away"
    },
    {
      id: 3,
      homeTeam: "FC United",
      awayTeam: "Athletic Club",
      date: "Saturday, 21 November",
      time: "14:00",
      competition: "Premier Division",
      location: "Home"
    }
  ];

  return (
    <section className="upcoming-fixtures">

      <div className="section-heading">
        <div>
          <h2>Upcoming Fixtures</h2>
          <p>Your next scheduled matches</p>
        </div>

        <button className="view-all-btn">
          View all
        </button>
      </div>

      <div className="fixtures-list">
        {fixtures.map((fixture) => (
          <FixtureCard
            key={fixture.id}
            fixture={fixture}
          />
        ))}
      </div>

    </section>
  );
}

export default UpcomingFixtures;
