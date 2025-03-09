import React from 'react';
import { Link } from 'react-router-dom';
import './index.css'

function Home() {
  return (
    <>
        <header>
          <h1>Finventory</h1>
          <ul>
              <li><Link to="/fishing-regulation">Fishing Regulation</Link></li>
              <li><Link to="/resources">Resources</Link></li>
              <li><Link to="/news">News and Updates</Link></li>
              <li><Link to="/account">Account</Link></li>
              <li><Link to="/contact">Contact</Link></li>
          </ul>
        </header>

        <div class = "title">
            <h1>Welcome to Finventory!</h1>
            <p>Your go-to platform for tracking trout stocking across West Virginia's rivers and streams.</p>
        </div>


        <footer>
            <p>&copy; 2025 Finventory. All rights reserved.</p>
        </footer>
          
    </>
  );
}

export default Home;