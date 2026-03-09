import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* About */}
        <div className="footer-section">
          <h3>Sports Sphere</h3>
          <p>
            Official Sports & Events Portal of the College.  
            Promoting sportsmanship, teamwork, and excellence.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li>Home</li>
            <li>Sports</li>
            <li>Events</li>
            <li>Clubs</li>
            <li>Gallery</li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-section">
          <h4>Contact</h4>
          <p>Sports Department</p>
          <p>📧 sports@college.edu</p>
          <p>📞 +91 98765 43210</p>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Sports Sphere | All Rights Reserved
      </div>
    </footer>
  );
}
