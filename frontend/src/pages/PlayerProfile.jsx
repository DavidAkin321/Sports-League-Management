
import { User, Mail, Phone, Shield, CalendarDays } from "lucide-react";

function PlayerProfile() {
  const player = {
    name: "David Akintomide",
    email: "player@example.com",
    phone: "+353 85 000 0000",
    team: "FC United",
    position: "Forward",
    joined: "September 2026"
  };

  return (
    <div className="player-profile">
      <div className="profile-heading">
        <h1>My Profile</h1>
        <p>View your personal and team information.</p>
      </div>

      <div className="profile-card">
        <div className="profile-avatar">
          <User size={40} />
        </div>

        <h2>{player.name}</h2>
        <p className="profile-position">{player.position}</p>
        <span className="profile-team">{player.team}</span>
      </div>

      <div className="profile-details">
        <h2>Personal Information</h2>

        <div className="profile-detail">
          <Mail size={19} />
          <div>
            <span>Email address</span>
            <p>{player.email}</p>
          </div>
        </div>

        <div className="profile-detail">
          <Phone size={19} />
          <div>
            <span>Phone number</span>
            <p>{player.phone}</p>
          </div>
        </div>

        <div className="profile-detail">
          <Shield size={19} />
          <div>
            <span>Team</span>
            <p>{player.team}</p>
          </div>
        </div>

        <div className="profile-detail">
          <CalendarDays size={19} />
          <div>
            <span>Joined</span>
            <p>{player.joined}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayerProfile;
