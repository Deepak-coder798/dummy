import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './NavBar.css'
import { FiSearch } from "react-icons/fi";
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");


  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const getUserData = async () => {
      const response = await axios.get(`http://localhost:5000/getUser/${userId}`);
      if (response && response.status == 200) {
        setUser(response.data.user);
      }
    }

    getUserData();
  }, [location.state])

  const handleLogOut = () => {
    setUser(null);
    localStorage.clear();
    navigate('/login', { state: { replace: true } })
  }


  return (
    <div className='m-box'>
      <nav>
        <div className='upper'>
          <Link to="/" style={{ textDecoration: 'none' }}> <div className='logo'>Chatterly</div></Link>

          <div className='pp'>
            {token && user && (
              <div className='user-info'>
                <Link to="/profile" style={{ textDecoration: 'none' }}>
                  <img src={user.profileImage} alt='' />
                </Link>
                <Link to="/profile" style={{ textDecoration: 'none' }}>
                  <strong>{user.name}</strong>
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
          </div>


        </div>

      </nav>
    </div>
  );
};

export default Navbar;
