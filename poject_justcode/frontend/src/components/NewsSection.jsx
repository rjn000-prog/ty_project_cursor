import "./NewsSection.css";

const newsList = [
  {
    title: "🏆 College Wins Inter-University Championship",
    date: "10 Feb 2026",
    desc: "Our college secured first place in the inter-university sports championship.",
  },
  {
    title: "📢 Registrations Open for Annual Sports Meet",
    date: "14 Feb 2026",
    desc: "Students can now register for various sports events through the portal.",
  },
  {
    title: "⚠️ Trials for Football Team",
    date: "20 Feb 2026",
    desc: "Football team selection trials will be held on the college ground.",
  },
];

export default function NewsSection() {
  return (
    <section className="news-section">
      <h2 className="section-title">News & Announcements</h2>
      <p className="section-subtitle">
        Latest updates from the sports department
      </p>

      <div className="news-grid">
        {newsList.map((news, index) => (
          <div className="news-card" key={index}>
            <h3>{news.title}</h3>
            <span className="news-date">{news.date}</span>
            <p>{news.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
