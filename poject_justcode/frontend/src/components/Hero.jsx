import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Welcome to Sports Sphere</h1>
        <p>
          Official Sports & Events Portal of Our College <br />
          Empowering Students Through Sports & Team Spirit
        </p>

        <div className="hero-buttons">
          <button className="primary-btn">View Events</button>
          <button className="secondary-btn">Explore Sports</button>
        </div>
      </div>
    </section>
  );
}
