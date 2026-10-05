import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import Wrapper from '../assets/wrappers/Navbar';
import Settings from './Settings';
import { useShell } from '../context/ShellContext';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isOpen: shellOpen, toggleShell } = useShell();
  const menuButtonRef = useRef(null);
  const { pathname } = useLocation();
  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <Wrapper aria-label="Main navigation" onKeyDown={(event) => {
      if (event.key === "Escape" && menuOpen) {
        event.stopPropagation();
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }}>
      <div className="nav-center">
        <div className="nav-top">
          <NavLink to="/" className="logo" onClick={() => setMenuOpen(false)}>
            floyd<span className="logo-dim">.benedikter</span>
          </NavLink>
          <button
            type="button"
            ref={menuButtonRef}
            className="hamburger"
            aria-controls="main-navigation"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        <div id="main-navigation" className={`nav-links ${menuOpen ? 'show' : ''}`}>
          <NavLink to="/" className="nav-link" onClick={() => setMenuOpen(false)}>
            home
          </NavLink>
          <NavLink to="/posts" className="nav-link" onClick={() => setMenuOpen(false)}>
            posts
          </NavLink>
          <NavLink to="/resume" className="nav-link" onClick={() => setMenuOpen(false)}>
            resume
          </NavLink>

          <span className="nav-divider" aria-hidden="true" />

          {/* Appearance controls stay separate from the primary CLI action. */}
          <div className="nav-controls">
            <Settings />
          </div>
        </div>
        <button
          type="button"
          className="nav-cli"
          aria-expanded={shellOpen}
          aria-controls="portfolio-cli"
          onClick={() => {
            setMenuOpen(false);
            toggleShell();
          }}
        >
          <span aria-hidden="true">&gt;_</span> CLI
        </button>
      </div>
    </Wrapper>
  );
};

export default Navbar;
