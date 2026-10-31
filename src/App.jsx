import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Gallery from './components/Gallery';
import About from './components/About';
import Delivery from './components/Delivery';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CatalogProvider from './context/CatalogProvider';
import LanguageProvider from './i18n/LanguageProvider';

export default function App() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );
    const observeHidden = () =>
      document.querySelectorAll('.reveal:not(.visible)').forEach((el) => observer.observe(el));
    observeHidden();

    // Also catch .reveal elements added later: gallery cards after loading or filtering,
    // and sections React re-creates (e.g. on hot reload), which would otherwise stay invisible.
    const mutations = new MutationObserver(observeHidden);
    mutations.observe(document.getElementById('root'), { childList: true, subtree: true });

    return () => {
      mutations.disconnect();
      observer.disconnect();
    };
  }, []);

  return (
    <LanguageProvider>
      <CatalogProvider>
        <Navbar />
        <Hero />
        <Gallery />
        <About />
        <Delivery />
        <Contact />
        <Footer />
      </CatalogProvider>
    </LanguageProvider>
  );
}
