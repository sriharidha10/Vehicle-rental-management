import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../redux/actions/userActions';
import '../styles/Navbar.css';

function Navbar() {
  const { user } = useSelector(state => state.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-text">VehicleRent</span>
        </Link>

        <div className="nav-links">
          {user ? (
            <>
              <Link to="/bookings" className="nav-link">
                My Bookings
              </Link>
              <button onClick={handleLogout} className="nav-link logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-link register-btn">
                Register
              </Link>
              <Link to="/admin/login" className="nav-link admin-link">
                Admin
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;