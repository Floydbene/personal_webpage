import { useState, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FaBars, FaTimes, FaEllipsisH, FaPaw } from 'react-icons/fa';
import Wrapper from '../assets/wrappers/Navbar';
import ThemeSelector from './ThemeSelector';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

const Navbar = () => {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const tapCount = useRef(0);
  const tapTimer = useRef(null);

  const { data: dogAccess } = useQuery({
    queryKey: ['dog-access'],
    queryFn: async () => {
      const { data } = await api.get('/api/dog/access');
      return data;
    },
    enabled: !!user,
    staleTime: 60 * 1000,
  });

  const handleLogoTap = () => {
    if (user) return;
    tapCount.current += 1;
    if (tapCount.current === 3) {
      tapCount.current = 0;
      clearTimeout(tapTimer.current);
      navigate('/login');
      return;
    }
    clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => {
      tapCount.current = 0;
    }, 600);
  };

  return (
    <Wrapper>
      <div className="nav-center">
        <div className="nav-top">
          <span className="logo" onClick={handleLogoTap}>floyd benedikter</span>
          <button
            className="hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        <div className={`nav-links ${menuOpen ? 'show' : ''}`}>
          <NavLink to="/" className="nav-link" onClick={() => setMenuOpen(false)}>
            About me
          </NavLink>
          <NavLink to="/resume" className="nav-link" onClick={() => setMenuOpen(false)}>
            Resume
          </NavLink>
          <ThemeSelector />
          {dogAccess?.hasAccess && (
            <NavLink to="/dog" className="dots-btn" onClick={() => setMenuOpen(false)} aria-label="Your pup">
              <FaPaw />
            </NavLink>
          )}
          {user && (
            <NavLink to="/admin" className="dots-btn" onClick={() => setMenuOpen(false)} aria-label="Open tickets">
              <FaEllipsisH />
            </NavLink>
          )}
        </div>
      </div>
    </Wrapper>
  );
};

export default Navbar;
