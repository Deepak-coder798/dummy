import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './NavBar.css';
import axios from 'axios';
import { AiFillMessage } from "react-icons/ai";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


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
  }, [location.state, location.pathname]);

  const handleLogOut = () => {
    setUser(null);
    localStorage.clear();
    navigate('/login', { state: { replace: true } });
  };


  return (
    <div className={`m-box `} >
      <nav>
        <div className='upper' >
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div className='logo' >Chatterly</div>
          </Link>

          <div className='pp'>
            {token && user && (
              <div className='user-info'>
                <Link to="/direct" style={{ textDecoration: 'none' }}>
                  <AiFillMessage size={30} color='#747474cc' />
                </Link>
                <img
                  src={user.profileImage}
                  alt="Profile"
                  style={{ cursor: "pointer", borderRadius: "50%", width: "40px", height: "40px" }}
                  onClick={() => setOpen((prev) => !prev)}
                />
                {/* <Link to="/profile" style={{ textDecoration: 'none' }}>
                  <strong style={{color: theme === 'light' ? 'black' : 'white' }}>{user.name}</strong>
                </Link> */}
              </div>
            )}

            {open && (
              <div
                style={{
                  position: "absolute",
                  top: "50px",
                  right: 0,
                  background: "#ffffff",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                  borderRadius: "10px",
                  overflow: "hidden",
                  zIndex: 10,
                  minWidth: "160px",
                  border: "1px solid #e6e6e6",
                  animation: "fadeIn 0.2s ease-in-out"
                }}
              >
                <Link
                  to="/profile"
                  style={{
                    display: "block",
                    padding: "12px 20px",
                    textDecoration: "none",
                    color: "#333",
                    transition: "background 0.2s ease",
                    fontSize: "14px",
                    fontWeight: "500"
                  }}
                  onMouseEnter={(e) => (e.target.style.background = "#f5f5f5")}
                  onMouseLeave={(e) => (e.target.style.background = "transparent")}
                  onClick={() => setOpen(false)}
                >
                  My Profile
                </Link>

                <button
                  onClick={() => {
                    setOpen(false);
                    handleLogOut();
                  }}
                  style={{
                    display: "block",
                    padding: "12px 20px",
                    width: "100%",
                    textAlign: "left",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#333",
                    transition: "background 0.2s ease",
                    fontSize: "14px",
                    fontWeight: "500"
                  }}
                  onMouseEnter={(e) => (e.target.style.background = "#f5f5f5")}
                  onMouseLeave={(e) => (e.target.style.background = "transparent")}
                >
                  Log Out
                </button>
              </div>
            )}


            {!token && (
              <Link to="/login" style={{ textDecoration: "none" }}>
                <b>Log In</b>
              </Link>
            )}

            {/* 🌗 Theme toggle button */}
            {/* <button onClick={()=>toggleTheme()} className="theme-btn">
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </button> */}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
