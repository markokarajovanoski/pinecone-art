import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Gallery from './components/Gallery';
import About from './components/About';
import Delivery from './components/Delivery';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CatalogProvider from './context/CatalogProvider';
import CustomOrderProvider from './context/CustomOrderProvider';
import LanguageProvider from './i18n/LanguageProvider';
import useRevealOnScroll from './hooks/useRevealOnScroll';

export default function App() {
  useRevealOnScroll();

  return (
    <LanguageProvider>
      <CatalogProvider>
        <CustomOrderProvider>
          <Navbar />
          <Hero />
          <Gallery />
          <About />
          <Delivery />
          <Contact />
          <Footer />
        </CustomOrderProvider>
      </CatalogProvider>
    </LanguageProvider>
  );
}
