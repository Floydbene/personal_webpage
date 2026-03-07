import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { FaListUl, FaArrowLeft, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import Wrapper from '../assets/wrappers/AdminLayout';

const AdminLayout = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <Wrapper>
      <aside className="sidebar">
        <div className="sidebar-header">
          <p className="user-email">{user?.email}</p>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/admin" end className="sidebar-link">
            <FaListUl /> Todos
          </NavLink>
          <NavLink to="/" className="sidebar-link">
            <FaArrowLeft /> Back to Site
          </NavLink>
        </nav>
        <button onClick={handleSignOut} className="sign-out-btn">
          <FaSignOutAlt /> Sign Out
        </button>
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>
    </Wrapper>
  );
};

export default AdminLayout;
