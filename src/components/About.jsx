export default function About() {
  return (
    <section className="about-section" id="about">
      <div className="about-container">
        <div className="about-text reveal">
          <p className="section-subtitle">The Story</p>
          <h2 className="section-title">
            Crafted by Hand,<br />Inspired by Nature
          </h2>
          <p>
            Every piece begins with a simple pinecone — foraged, cleaned, and carefully
            deconstructed. Each scale is shaped, painted, and assembled petal by petal to
            create flowers that look remarkably real yet carry the unmistakable texture of
            nature.
          </p>
          <p>
            Combined with natural elements like birch bark, twigs, burlap, and moss, each
            composition tells its own story. No two pieces are ever alike.
          </p>
          <div className="about-stats">
            <div className="stat">
              <span className="stat-number">100%</span>
              <span className="stat-label">Handmade</span>
            </div>
            <div className="stat">
              <span className="stat-number">Natural</span>
              <span className="stat-label">Materials</span>
            </div>
            <div className="stat">
              <span className="stat-number">Unique</span>
              <span className="stat-label">Every Piece</span>
            </div>
          </div>
        </div>
        <div className="about-visual reveal">
          <div className="about-image-grid">
            <img
              src="/images/3f3e9e01-5da5-4831-82cb-fb66bc2fde16.jpg"
              alt="Pinecone art detail"
              className="about-img about-img-1"
            />
            <img
              src="/images/35b5e998-89de-49dc-b5fa-99f6db6087a2.jpg"
              alt="Pinecone wreath detail"
              className="about-img about-img-2"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
