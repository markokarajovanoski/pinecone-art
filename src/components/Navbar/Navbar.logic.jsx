import { useEffect, useState } from 'react';
import { useCatalog } from '../../context/catalogContext';
import { socialLinks } from '../../lib/social';
import NavbarView from './Navbar.view';
import { NAV_SECTIONS } from './Navbar.props';

export default function Navbar() {
  const { settings } = useCatalog();
  const { instagramUrl, facebookUrl } = socialLinks(settings);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.3 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <NavbarView
      scrolled={scrolled}
      menuOpen={menuOpen}
      activeSection={activeSection}
      sections={NAV_SECTIONS}
      instagramUrl={instagramUrl}
      facebookUrl={facebookUrl}
      onToggleMenu={() => setMenuOpen((open) => !open)}
      onNavigate={() => setMenuOpen(false)}
    />
  );
}
