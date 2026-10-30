export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <span className="logo-icon">✧</span>
          <span>Pinecone Art</span>
        </div>
        <p className="footer-text">
          &copy; {new Date().getFullYear()} Pinecone Art. All rights reserved. Handcrafted with love.
        </p>
      </div>
    </footer>
  );
}
