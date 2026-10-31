// Sections the menu links to, in page order. Labels come from translations (nav.<id>).
export const NAV_SECTIONS = ['home', 'gallery', 'about', 'contact'];

/**
 * @typedef {object} NavbarViewProps
 * @property {boolean} scrolled  page has scrolled: the navbar turns solid
 * @property {boolean} menuOpen  the mobile menu is open
 * @property {string} activeSection  id of the section currently in view
 * @property {string[]} sections  section ids to link to
 * @property {() => void} onToggleMenu
 * @property {() => void} onNavigate  a menu link was clicked
 */
