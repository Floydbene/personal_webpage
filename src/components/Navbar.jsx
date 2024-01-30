import { NavLink } from 'react-router-dom';
import Wrapper from '../assets/wrappers/Navbar';
const Navbar = () => {
  return (
    <Wrapper>
      <div className='nav-center'>
        <span className='logo'>floyd benedikter</span>
        <div className='nav-links'>
          <NavLink to='/' className='nav-link'>
            About me
          </NavLink>
          <NavLink to='/portfolio' className='nav-link'>
            Portfolio
          </NavLink>
          <NavLink to='/resume' className='nav-link'>
            Resume
          </NavLink>
        </div>
      </div>
    </Wrapper>
  );
};

export default Navbar;
