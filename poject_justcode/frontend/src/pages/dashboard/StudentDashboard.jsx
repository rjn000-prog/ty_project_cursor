import { useEffect, useState } from "react";
import { getStudentDashboard } from "../../services/studentService";
import { useNavigate } from "react-router-dom";
import "./StudentDashboard.css";

export default function StudentDashboard() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getStudentDashboard()
      .then(setData)
      .catch(() => navigate("/login"));
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="dashboard">
      <h1>Welcome, {data.studentName}</h1>

      <section>
        <h2>Stats</h2>
        <p>Clubs joined: {data.stats.clubCount}</p>
        <p>Events participated: {data.stats.eventCount}</p>
      </section>

      <section>
        <h2>Your Clubs</h2>
        <ul>
          {data.clubs.map(club => (
            <li key={club.id}>
              {club.name} ({club.type})
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Your Events</h2>
        <ul>
          {data.events.map(event => (
            <li key={event.id}>
              {event.name} – {event.club.name}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Notices</h2>
        <ul>
          {data.notices.map(n => (
            <li key={n.id}>
              <strong>{n.title}</strong>: {n.message}
            </li>
          ))}
        </ul>
      </section>

      <button onClick={() => navigate("/login")}>Logout</button>
    </div>
  );
}
