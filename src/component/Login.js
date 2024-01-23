import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';
import '../css/Login.css'; // Import your CSS file
import backgroundImage from '../images/background.jpeg'; // Import your background image
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const { register, handleSubmit, formState: { errors },} = useForm();
  const [loginError, setLoginError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [flashMessage, setFlashMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleSuccessfulLogin = async (user) => {
    console.log('Login successful', user);

    try {
      const authToken = user.data && user.data.token ? user.data.token : (user);

      sessionStorage.setItem('authToken', authToken);
      
      setFlashMessage('Login successful! Welcome to the dashboard.');
      navigate('/dashboard', { state: { flashMessage: 'Login successful! Welcome to the dashboard.' } });
      
      // Set the flash message for successful login
    } catch (error) {
      console.log('Error fetching authentication token', error);
      setLoginError('Error fetching authentication token');
    }
  };

  const handleLoginFailure = (errorMessage) => {
    console.log('Login failed', errorMessage);
    setLoginError(errorMessage);
  };

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost:5000/login', data);
      // const response = await axios.post('http://18.207.213.145/api/login', data);

      if (response.status === 200) {
        handleSuccessfulLogin(response);
      } else {
        handleLoginFailure('Invalid email or password. Please try again.');
      }
    } catch (error) {
      (error.response.status === 401) ?
        handleLoginFailure('Invalid email or password. Please try again.') :
        handleLoginFailure('Server error. Please try again later.');
    }
  };

  const responseGoogle = async (googleData) => {
    try {
      console.log("Google Data", googleData);

      const response = await axios.post('http://localhost:5000/google-login', {
        body: googleData,
      });
      // const response = await axios.post('http://18.207.213.145/api/google-login', {
      //   body: googleData,
      // });

      console.log('response:', response.data.token);

      if (response.status === 200) {
        handleSuccessfulLogin(response.data.token);
      } else {
        handleLoginFailure('Google login failed. Please try again.');
      }
    } catch (error) {
      console.log(error);
      handleLoginFailure('Server error. Please try again later.');
    }
  };

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="login-form">
        <h2>Login</h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <label>Email:</label>
            <input type="email" {...register('email', { required: 'Email is required', pattern: /^\S+@\S+$/i })} />
            {errors.email && <p>{errors.email.message}</p>}

            <label>Password:</label>
            <div className="password-input">
              <input type={showPassword ? 'text' : 'password'} {...register('password', { required: 'Password is required' })} />
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                className="toggle-password-icon"
                onClick={handlePasswordVisibility}
              />
            </div>
            {errors.password && <p>{errors.password.message}</p>}

            <button type="submit">Login</button>
          </form>
        )}

        {loginError && <p className="error-message">{loginError}</p>}

        {flashMessage && <p className="flash-message">{flashMessage}</p>}

        <GoogleOAuthProvider clientId="995931197559-2j4knhg95qbapup7gde5l8quba96jon7.apps.googleusercontent.com">
          <GoogleLogin
            buttonText="Login with Google"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy={'single_host_origin'}
            className="google-login-button"
          />
        </GoogleOAuthProvider>

        <Link to="/signup">Don't have an account? Sign up</Link>
      </div>
    </div>
  );
};

export default Login;
