import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">📊 Smart Stock</div>
      <div className="navbar-links">
        <NavLink to="/" className="nav-link" activeclassname="active">Home</NavLink>
        <NavLink to="/dashboard" className="nav-link" activeclassname="active">Dashboard</NavLink>
        <NavLink to="/track" className="nav-link" activeclassname="active">Track</NavLink>
        <NavLink to="/trades" className="nav-link" activeclassname="active">Trade</NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
