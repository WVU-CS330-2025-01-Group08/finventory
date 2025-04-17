
/**
 * The Home component serves as the main page of the application.
 * It includes a header with navigation links, a container displaying a map component,
 * and a footer with copyright information.
 * 
 * Uses information from the Map component to display a map of fish species.
 * @component
 * @returns {JSX.Element} The rendered Home component.
 *
 * @example
 * // Usage in a React application
 * import Home from './Home';
 * 
 * function App() {
 *   return <Home />;
 * }
 */
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'
import { WVMap as Map } from './components/Map/Map.js';

function Home() {
  return (
    <>
      <header>
            <Link to="/" className="logo">
              <img src="/fishCartoon.png" alt="Logo" className="logo" />
              Finventory
            </Link>
        <ul>
            <li><Link to="/home">Map</Link></li>
            <li><Link to="/account">Account</Link></li>
        </ul>
      </header>

      <div className="container">
        
        <Map />
        
      </div>


      <footer>
          <p className="footer-bottom">&copy; 2025 Finventory. All Rights Reserved.</p>
      </footer>
          
    </>
  );
}

export default Home;