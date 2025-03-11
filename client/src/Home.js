import React from 'react';
import { Link } from 'react-router-dom';
import './index.css'

function Home() {
  return (
    <>
      <header>
        <ul>
            <li><Link to="/fishing-regulation">Fishing Regulation</Link></li>
            <li><Link to="/resources">Resources</Link></li>
            <li><Link to="/news">News and Updates</Link></li>
            <li><Link to="/account">Account</Link></li>
            <li><Link to="/contact">Contact</Link></li>
        </ul>
      </header>

      <h1>Welcome to Finventory</h1>
      <div className="container">
        <p>Track trout stocking across West Virginia with ease.</p>
        <Link to="/begin" className="button">Click to Begin</Link>
      </div>
      <div className="background">
        <div className="wave"></div>
        <img src="/fishCartoon.png" alt="Fish" className="fish" />
        <img src="/fishCartoon.png" alt="Fish small" className="fish-small" />
      </div>


      <footer>
          <p>&copy; 2025 Finventory. All rights reserved.</p>
      </footer>
          
    </>
  );
}

export default Home;