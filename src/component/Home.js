// Home.js

import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Home.css'; // Import your CSS file
import backgroundImage from '../images/background.jpeg'; // Import your background image

const Home = () => {
  return (
    <div className="home-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      {/* <header>
        <h1>Flash Card App</h1>
      </header> */}

      <main>
        <h2>Welcome to the Flash Card App!</h2>
        <h2>Start your learning journey with flash cards.</h2>
        <div className="cta-buttons">
          <Link to="/login" className="cta-button">Login</Link>
          <Link to="/signup" className="cta-button">Sign Up</Link>
        </div>
      </main>

      <footer>
        <p>&copy; 2023 Flash Card App</p>
      </footer>
    </div>
  );
};

export default Home;
