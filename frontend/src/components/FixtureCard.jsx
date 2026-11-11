
import { CalendarDays, Clock, MapPin } from "lucide-react";

function FixtureCard({ fixture }) {
  return (
    <div className="fixture-card">

      <div className="fixture-card-top">
        <div>
          <span className="fixture-date">
            <CalendarDays size={14} />
            {fixture.date}
          </span>

          <span className="fixture-time">
            <Clock size={14} />
            {fixture.time}
          </span>
        </div>

        <span className="fixture-status">
          Upcoming
        </span>
      </div>

      <div className="fixture-teams">

        <div className="fixture-team">
          <div className="team-badge home-badge">
            {fixture.homeTeam.substring(0, 2).toUpperCase()}
          </div>
          <h3>{fixture.homeTeam}</h3>
        </div>

        <span className="fixture-vs">VS</span>

        <div className="fixture-team">
          <div className="team-badge away-badge">
            {fixture.awayTeam.substring(0, 2).toUpperCase()}
          </div>
          <h3>{fixture.awayTeam}</h3>
        </div>

      </div>

      <div className="fixture-card-bottom">
        <span>{fixture.competition}</span>

        <span className="fixture-location">
          <MapPin size={14} />
          {fixture.location}
        </span>
      </div>

    </div>
  );
}

export default FixtureCard;
