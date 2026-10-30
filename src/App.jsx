import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Gallery from './components/Gallery';
import About from './components/About';
import Delivery from './components/Delivery';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CatalogProvider from './context/CatalogProvider';

export default function App() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );
    const revealEls = document.querySelectorAll('.reveal');
    revealEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <CatalogProvider>
      <Navbar />
      <Hero />
      <Gallery />
      <About />
      <Delivery />
      <Contact />
      <Footer />
    </CatalogProvider>
  );
}
