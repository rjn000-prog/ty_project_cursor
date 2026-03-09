import "./Hero.css";

export default function Hero({ scrollToSection }) {
  const scroll = (id) => {
    if (scrollToSection) scrollToSection(id);
    else document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="hero">
      <div className="hero-content">
        {/* Badge */}
        <div className="hero-badge">
          <span>🏆</span>
          <span>Official Sports & Events Portal</span>
        </div>

        <h1>
           CES's Parvatibai Chowgule College{" "}
          <span className="highlight">of Arts & Science</span>
        </h1>

        <p>
          Empowering students through sport, teamwork & excellence.
          <br />
          Discover tournaments, clubs, events and live match updates.
        </p>

        <div className="hero-buttons">
          <button className="hero-btn hero-btn--primary" onClick={() => scroll("events")}>
            <span>📅</span> View Events
          </button>
          <button className="hero-btn hero-btn--secondary" onClick={() => scroll("sports")}>
            <span>⚽</span> Explore Sports
          </button>
          <button className="hero-btn hero-btn--secondary" onClick={() => scroll("clubs")}>
            <span>🎭</span> Explore Clubs
          </button>
        </div>

        {/* Stats strip */}
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-num">12+</div>
            <div className="hero-stat-label">Sports</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-num">30+</div>
            <div className="hero-stat-label">Clubs</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-num">500+</div>
            <div className="hero-stat-label">Athletes</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-num">50+</div>
            <div className="hero-stat-label">Events/Year</div>
          </div>
        </div>
      </div>
    </section>
  );
}
