import { Link, useNavigate } from 'react-router-dom';
import '../css/Dashboard.css';
import useAuthentication from './useAuthentication';

const DashboardHeader = () => {
    useAuthentication();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the authentication token or session-related information
    localStorage.removeItem('authToken');
    sessionStorage.setItem('isToastDisplayed', '');

    // Redirect the user to the login page
    navigate('/login');
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <h1>Flash Card App</h1>
        <div className="menu">
          <ul>
            <li><Link to="/dashboard/home">Home</Link></li>
            <li><Link to="/dashboard/add-flash-card">Add Flash Card</Link></li>
            <li><Link to="/dashboard/add-gallery">Add Gallery</Link></li>
            <li><Link to="/dashboard/gallery">Gallery</Link></li>
            <li><Link to="/dashboard/profile">Profile</Link></li>
            <li><Link to="/login" onClick={handleLogout}>Logout</Link></li>
          </ul>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
