import "./GallerySection.css";

const images = [
  "/gallery1.jpg",
  "/gallery2.webp",
  "/gallery3.webp",
  "/gallery4.png",
  "/gallery4.png",
  "/gallery2.webp",
];

export default function GallerySection() {
  return (
    <section className="gallery-section">
      <h2 className="section-title">Gallery</h2>
      <p className="section-subtitle">
        Moments from sports events and tournaments
      </p>

      <div className="gallery-grid">
        {images.map((img, index) => (
          <div className="gallery-card" key={index}>
            <img src={img} alt={`Gallery ${index + 1}`} />
          </div>
        ))}
      </div>

      <button className="view-gallery-btn">View Full Gallery</button>
    </section>
  );
}
