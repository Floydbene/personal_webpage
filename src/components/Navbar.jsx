import { NavLink } from "react-router-dom";
import { FaLock, FaSignInAlt } from "react-icons/fa";
import Wrapper from "../assets/wrappers/Navbar";
import ThemeSelector from "./ThemeSelector";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user } = useAuth();

  return (
    <Wrapper>
      <div className="nav-center">
        <span className="logo">floyd benedikter</span>
        <div className="nav-links">
          <NavLink to="/" className="nav-link">
            About me
          </NavLink>
          <NavLink to="/resume" className="nav-link">
            Resume
          </NavLink>
          {user ? (
            <NavLink to="/admin" className="nav-link">
              <FaLock /> Admin
            </NavLink>
          ) : (
            <NavLink to="/login" className="nav-link">
              <FaSignInAlt /> Login
            </NavLink>
          )}
          <ThemeSelector />
        </div>
      </div>
    </Wrapper>
  );
};

export default Navbar;
