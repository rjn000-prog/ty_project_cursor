import Navbar from "../../components/Navbar";   // 👈 ADD THIS

import Hero from "../../components/Hero";
import SportsSection from "../../components/SportsSection";
import ClubsSection from "../../components/ClubsSection";
import EventsMatches from "../../components/EventsMatches";
import NewsSection from "../../components/NewsSection";
import GallerySection from "../../components/GallerySection";
import Footer from "../../components/Footer";
import FeaturedClubs from "../../components/clubs/FeaturedClubs";
import "./Home.css";

export default function Home() {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Navbar />   {/* 👈 ADD THIS */}

      <div className="home-page">
        <section id="hero">
          <Hero scrollToSection={scrollToSection} />
        </section>

        <section id="sports">
          <SportsSection />
        </section>

        <section id="clubs" className="home-clubs-section">
          <FeaturedClubs scrollToSection={scrollToSection} />
          <div id="clubs-all">
            <ClubsSection />
          </div>
        </section>

        <section id="events">
          <EventsMatches scrollToSection={scrollToSection} />
        </section>

        <section id="news">
          <NewsSection />
        </section>

        <section id="gallery">
          <GallerySection />
        </section>

        <Footer />
      </div>
    </>
  );
}