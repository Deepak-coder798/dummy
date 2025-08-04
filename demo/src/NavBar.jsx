import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './NavBar.css';
import { FiSearch } from "react-icons/fi";
import axios from 'axios';
import { ThemeContext } from './ThemeContext'; 

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  const { theme, toggleTheme } = useContext(ThemeContext); 

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const getUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/getUser/${userId}`);
        if (response && response.status === 200) {
          setUser(response.data.user);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    getUserData();
  }, [location.state]);

  const handleLogOut = () => {
    setUser(null);
    localStorage.clear();
    navigate('/login', { state: { replace: true } });
  };

  console.log(theme);

  return (
    <div className={`m-box `} >
      <nav>
        <div className='upper'  style={{ background: theme === 'light' ? 'white' : 'black' , color: theme === 'light' ? 'black' : 'white' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div className='logo' style={{color: theme === 'light' ? 'black' : 'white' }}>Chatterly</div>
          </Link>

          <div className='pp'>
            {token && user && (
              <div className='user-info'>
                <Link to="/profile" style={{ textDecoration: 'none' }}>
                  <img src={user.profileImage} alt='' />
                </Link>
                <Link to="/profile" style={{ textDecoration: 'none' }}>
                  <strong style={{color: theme === 'light' ? 'black' : 'white' }}>{user.name}</strong>
                </Link>
              </div>
            )}

            {token ? (
              <b onClick={handleLogOut} style={{ cursor: "pointer" }}>Log Out</b>
            ) : (
              <Link to="/login" style={{ textDecoration: "none" }}>
                <b>Log In</b>
              </Link>
            )}

            {/* 🌗 Theme toggle button */}
            <button onClick={()=>toggleTheme()} className="theme-btn">
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
