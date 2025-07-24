import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { BsFillTelephoneFill, BsEnvelopeFill } from 'react-icons/bs';
import { IoIosHeart } from "react-icons/io";

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.section}>
          <h3>Tranning <span style={{color:"red"}}>Blog</span></h3>
          <p>Welcome to our Technical Blog, where we explore new technologies & explore their practical Applications.</p>
        </div>
        <div style={styles.section}>
          <h3>GET IN TOUCH</h3>
          <p><BsFillTelephoneFill /> +123 456 7890</p>
          <p><BsEnvelopeFill /> support@yourshop.com</p>
        </div>
        <div style={styles.section}>
          <h3>FOLLOW US ON</h3>
          <div style={styles.socialIcons}>
            <a href="/about" target="_blank" rel="noopener noreferrer">
              <FaFacebook size={30} style={styles.icon} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter size={30} style={styles.icon} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram size={30} style={styles.icon} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <FaLinkedin size={30} style={styles.icon} />
            </a>
          </div>
        </div>
      </div>
      <div style={styles.bottom}>
        <p style={{fontSize:"15px"}}>&copy; 2025 TRANINGBLOG</p>
        <p style={{fontSize:"15px"}}>MADE WITH <span style={{color:"red"}}><IoIosHeart /></span> MOHALI, INDIA</p>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: 'white',
    color: 'black',
    padding: '20px 0',
    fontFamily: 'Arial, sans-serif',
    fontSize: '14px',
    paddingBottom:'0',
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0 20px',
  },
  section: {
    flex: 1,
    marginRight: '20px',
  },
  socialIcons: {
    display: 'flex',
    gap: '15px',
    paddingLeft: '100px',
  },
  icon: {
    color: 'black',
    transition: 'color 0.3s',
  },
  bottom: {
    display:'flex',
    justifyContent:'space-between',
    alignItem:'center',
    width:'80%',
    hight:'20px',
    marginLeft:'10%',
    borderTop:'2.5px solid #e1dedc',
    textAlign: 'start',
    paddingTop:'20px',
    marginTop: '20px',
    fontSize: '12px',
  },
};

export default Footer;
