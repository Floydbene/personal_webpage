import { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import Wrapper from '../assets/wrappers/LoginPage';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin';

  if (user) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await signIn(email, password);
      toast.success('Signed in successfully');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.message || 'Failed to sign in');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Wrapper>
      <form onSubmit={handleSubmit} className="login-form">
        <h3>Login</h3>
        <div className="form-row">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-row">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn" disabled={submitting}>
          {submitting ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </Wrapper>
  );
};

export default Login;
