import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NavBar.css'
import { FiSearch } from "react-icons/fi";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogOut = ()=>{
    localStorage.clear();
    navigate('/login')
  }


  return (
    <div className='m-box'>
       <nav>
        <div className='upper'>
        <Link to="/" style={{ textDecoration: 'none' }}> <div className='logo'>Chatterly</div></Link>
        
        <div className='pp'>
        {token && <><Link to="/profile" style={{ textDecoration: 'none' }}>   <img src='https://c.pxhere.com/photos/c7/42/young_man_portrait_beard_young_man_male_handsome_young_man_handsome-1046502.jpg!d' alt=''></img>  </Link>
        <Link to="/profile" style={{ textDecoration: 'none' }}>  <p>Deepak Kumar</p>  </Link></>}
       {token? <p onClick={()=> handleLogOut()} style={{cursor:"pointer"}}>Log Out</p>:
        <Link style={{textDecoration:"none"}} to={"/login"}><p>Log In</p></Link>}
          </div>
        
        </div>
        

       {token &&  <div className='main2'>
            <div className='p1'>
                <p style={{borderRight:"1.5px solid rgb(225, 225, 228)",color:"black",fontSize:"14px",fontWeight:"700"}}>Filters</p>
                <div className='boxes'>
                   <p style={{fontSize:"13px",fontWeight:"700",color:"rgb(124, 124, 128)",marginBottom:"0",padding:"0"}}>Created By</p>
                   <input
                   type='text'
                  placeholder='All'
                  style={{textDecoration:"none"}}
                  >
                  </input>
                </div>
                <div className='boxes'>
                  <p style={{fontSize:"13px",fontWeight:"700",color:"rgb(124, 124, 128)",marginBottom:"0",padding:"0"}}>Published By</p>
                  <input
                  type='text'
                  placeholder='Select Data'
                  style={{textDecoration:"none"}}
                  >
                  </input>
                </div>
            </div>
            <div className='p2'>
              <p style={{fontSize:"13px",fontWeight:"700",color:"rgb(124, 124, 128)",marginBottom:"0",padding:"0"}}>Search</p>
              <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
                <input type='text' placeholder='Type Here...'  style={{textDecoration:"none",border:"none"}}></input> <button style={{height:"30px",width:"50px",background:"#eeeded;",marginBottom:"10px",borderRadius:" 0 20px 20px 0",border:"none",cursor:"pointer"}}><FiSearch  /></button>
              </div>
            </div>
          </div>}
        </nav>
    </div>
  );
};

export default Navbar;
