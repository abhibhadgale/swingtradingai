// /frontend/src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css'; // Assuming you have a CSS file for styling

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to Smart Stock Tracker 📈</h1>
      <p>Track, analyze, and trade smarter using moving average strategies.</p>
      <div className="home-buttons">
        <Link to="/dashboard"><button>Go to Dashboard</button></Link>
        <Link to="/track"><button>Track Stocks</button></Link>
        <Link to="/trade"><button>Trade Dashboard</button></Link>
      </div>
    </div>
  );
};

export default Home;
