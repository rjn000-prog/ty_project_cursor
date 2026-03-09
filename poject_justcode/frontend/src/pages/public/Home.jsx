import Navbar from "../../components/Navbar";
import Hero from "../../components/Hero";
import SportsSection from "../../components/SportsSection";
import ClubsSection from "../../components/ClubsSection";
import EventsMatches from "../../components/EventsMatches";
import NewsSection from "../../components/NewsSection";
import GallerySection from "../../components/GallerySection";
import Footer from "../../components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <SportsSection />
      <ClubsSection />
      <EventsMatches />
      <NewsSection />
      <GallerySection />
      <Footer />
    </>
  );
}
