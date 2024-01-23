// Dashboard.js

import React, { useEffect } from 'react';
// import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import '../css/Dashboard.css'; // Import your CSS file
import CardFlipper from './CardFlipper';
// import AddCard from './AddCard';
import DashboardHeader from './DashboardHeader';
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Dashboard = () => {
  const location = useLocation();
  const flashMessage = location.state?.flashMessage || '';
  

  useEffect(() => {
    // Display a toast if there's a flash message and it hasn't been shown before
    const isToastDisplayed = sessionStorage.getItem('isToastDisplayed');

    if (flashMessage && !isToastDisplayed) {
      toast.success(flashMessage, {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Set the flag in the session storage to indicate that the toast has been displayed
      sessionStorage.setItem('isToastDisplayed', 'true');
    }

    // Clear the flash message in the state
    location.state = {};
  }, [flashMessage, location]);

  return (
    
    <div className="dashboard-container">
     <DashboardHeader />

      <main>
     
        <CardFlipper />
      </main>

      <footer>
        <p>&copy; 2023 Flash Card App</p>
      </footer>
      {/* {flashMessage && <p className="flash-message">{flashMessage}</p>} */}
          {/* Toast container for displaying notifications */}
          <ToastContainer />
    </div>
  );
};

export default Dashboard;
