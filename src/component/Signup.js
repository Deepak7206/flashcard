// Signup.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
// import { GoogleLogin } from 'react-google-login';
import axios from 'axios';
import '../css/Signup.css'; // Import your CSS file
import backgroundImage from '../images/background.jpeg'; // Import your background image
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Signup = () => {
  const { register, handleSubmit, formState: { errors }, } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [signupError, setSignupError] = useState(null); // Add this line
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
    //   console.log("afsef");
      // Implement signup logic here using your backend API
      const response = await axios.post('http://localhost:5000/signup', data);
      // const response = await axios.post('http://18.207.213.145/api/signup', data);
      console.log(response);
    //   console.log('asdf');
     // Store the token in a secure way (e.g., in localStorage, secure cookie, etc.)
     if (response.status === 201) {
        localStorage.setItem('authToken', response.token);

        // Redirect to the dashboard
        navigate('/dashboard');
    } else if (response.status === 409) {
        // Handle user already exists error
        setSignupError("User already exist.");
      } else {
        setSignupError('Signup failed. Please try again.');
    }
 } catch (error) {
    if (error.response.status === 409) {
        console.log('test');
        // Handle user already exists error
        setSignupError("User already exist.");
      }
      else{
          setSignupError('Server error. Please try again later.');
      }
 }
};

  // const responseGoogle = async (googleData) => {
  //   try {
  //     // Implement Google signup logic here using your backend API
  //     const response = await axios.post('http://localhost:5000/google-login', {
  //       tokenId: googleData.tokenId,
  //     });
  //     console.log(response.data);

  //     // Handle successful Google login (e.g., store user data, redirect, etc.)
  //     if (response.data.success) {
  //       console.log('Google login successful!');
  //     } else {
  //       console.error('Google login failed. Please try again.');
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="login-form">
        <h2>Signup</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>Username:</label>
          <input type="text" {...register('username', { required: 'Username is required' })} />
          {errors.username && <p>{errors.username.message}</p>}

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

          <label>Phone Number:</label>
          <div className="phone-number-input">
            <select {...register('countryCode')}>
              <option value="+1">+1</option>
              {/* Add other country codes as needed */}
            </select>
            <input type="text" {...register('phoneNumber', { pattern: /^\d+$/ })} />
          </div>
          {errors.phoneNumber && <p>{errors.phoneNumber.message}</p>}

          {/* Other signup form fields here */}

          <button type="submit">Sign up</button>
        </form>
        {signupError && <p style={{ color: 'red' }}>{signupError}</p>}

        {/* Google Signup */}
        {/* <GoogleLogin
          clientId="your-google-client-id"
          buttonText="Sign up with Google"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          cookiePolicy={'single_host_origin'}
          className="google-signup-button"
        /> */}

        <Link to="/login" className="link-to-login">
          Already have an account? Login
        </Link>
      </div>
    </div>
  );
};

export default Signup;
