import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand / About */}
        <div className="footer-section">
          <div className="footer-logo-area">
            <img src="/logo.svg" alt="PCCAS Logo" />
            <div className="footer-brand-name">
              <a href="https://www.chowgules.ac.in/" target="_blank" rel="noopener noreferrer">
                Parvatibai Chowgule<br />College of Arts & Science
              </a>
            </div>
          </div>
          <p>
            Official Sports &amp; Events Portal — Promoting sportsmanship,
            teamwork, and excellence across all disciplines.
          </p>
          <div className="footer-social">
            <a className="footer-social-icon" href="#" title="Instagram">📸</a>
            <a className="footer-social-icon" href="#" title="Twitter/X">🐦</a>
            <a className="footer-social-icon" href="#" title="YouTube">▶️</a>
            <a className="footer-social-icon" href="#" title="LinkedIn">💼</a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#hero">Home</a></li>
            <li><a href="#sports">Sports</a></li>
            <li><a href="#events">Events</a></li>
            <li><a href="#clubs">Clubs</a></li>
            <li><a href="#gallery">Gallery</a></li>
            <li><a href="#news">News</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-section">
          <h4>Contact</h4>
          <div className="footer-contact-item">
            <span className="footer-contact-icon">🏛️</span>
            <span>Chowgule Sports Centre</span>
          </div>
          <div className="footer-contact-item">
            <span className="footer-contact-icon">📧</span>
            <span>sks003@chowgules.ac.in</span>
          </div>
          <div className="footer-contact-item">
            <span className="footer-contact-icon">👨‍🏫</span>
            <span>Faculty Adviser (Sports/Activities): dvb001@chowgules.ac.in</span>
          </div>
          <div className="footer-contact-item">
            <span className="footer-contact-icon">📞</span>
            <span>9373139610</span>
          </div>
          <div className="footer-contact-item">
            <span className="footer-contact-icon">🕙</span>
            <span>Mon – Fri &nbsp;|&nbsp; 9 AM – 5 PM</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span className="footer-bottom-copy">
          © {new Date().getFullYear()} Parvatibai Chowgule College of Arts and Science. All Rights Reserved.
        </span>
        <span className="footer-bottom-made">
          Made with ❤️ for PCCAS
        </span>
      </div>
    </footer>
  );
}
