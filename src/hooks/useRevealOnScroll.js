import { useEffect } from 'react';

// Fades in every .reveal element the first time it scrolls into view (adds .visible).
// Also catches .reveal elements added later: gallery cards after loading or filtering,
// and sections React re-creates (e.g. on hot reload), which would otherwise stay invisible.
export default function useRevealOnScroll() {
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

    const mutations = new MutationObserver(observeHidden);
    mutations.observe(document.getElementById('root'), { childList: true, subtree: true });

    return () => {
      mutations.disconnect();
      observer.disconnect();
    };
  }, []);
}
