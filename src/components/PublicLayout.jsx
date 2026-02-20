import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HomePage } from '../pages/PublicPages';
import MotionLayer from './MotionLayer';

const links = [
  ['#home', 'Home'],
  ['#skills', 'Skills'],
  ['#projects', 'Projects'],
  ['#education', 'Education'],
  ['#contact', 'Contact']
];

export default function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="site">
      <MotionLayer />
      <header className="topbar">
        <Link to="/" className="brand">
          Portfolio
        </Link>
        <button
          type="button"
          className="menu-btn"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <nav className={`nav ${menuOpen ? 'open' : ''}`}>
          {links.map(([to, label]) => (
            <a key={to} href={to} className="nav-link" onClick={() => setMenuOpen(false)}>
              {label}
            </a>
          ))}
        </nav>
      </header>
      <main>
        <HomePage />
      </main>
    </div>
  );
}
