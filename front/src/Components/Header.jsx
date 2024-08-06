import React from 'react';
import "./css/Header.css"
import { FiShoppingCart, FiHeart, FiUser  } from "react-icons/fi";

function Header() {
    return (
      <header className="header">
        <nav className="navigation">
          <ul className="nav-list">
            <li  className="nav-item">Home</li>
            <li  className="nav-item">Game Store</li>
            <li  className="nav-item">News</li>
          </ul>
        </nav>
        <div className="icons">
            <div className='icon'>
            <i><FiShoppingCart/></i>
            </div>
            <div className='icon'>
            <i><FiHeart/></i>
            </div>
            <div className='icon'>
            <i><FiUser/></i>
            </div>
        </div>
      </header>
    );
  }
  
  export default Header;