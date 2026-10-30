export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <p className="hero-subtitle">Handcrafted with Love</p>
        <h1 className="hero-title">
          Nature Transformed<br />Into Art
        </h1>
        <p className="hero-description">
          Each piece is uniquely crafted from pinecones, transforming nature's gifts into
          stunning floral arrangements and decorative art.
        </p>
        <a href="#gallery" className="hero-btn">
          Explore the Collection
        </a>
      </div>
      <div className="hero-scroll">
        <span>Scroll</span>
        <div className="scroll-line"></div>
      </div>
    </section>
  );
}
