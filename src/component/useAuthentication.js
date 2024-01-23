// useAuthentication.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuthentication = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check the authentication status here (e.g., by verifying the token)
    const authToken = sessionStorage.getItem('authToken');

    if (!authToken) {
      // Session expired, redirect to login page
      navigate('/login');
    }
  }, [navigate]);

  return null; // You can customize the return value based on your needs
};

export default useAuthentication;
