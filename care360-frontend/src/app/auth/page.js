'use client'; // Directive for client-side interactivity

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 
import styles from './auth.module.css'; 
import api from '../../services/api'; // Import the Axios instance
import { useAuth } from '../../context/AuthContext'; // Import the useAuth hook

// Combined Authentication Page Component
export default function AuthPage() {
  const [activeForm, setActiveForm] = useState('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Get the login function and router from context/hooks
  const { login } = useAuth();
  const router = useRouter();

  //Login 
  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await api.post('/users/login', {
        email: loginEmail,
        password: loginPassword,
      });
      console.log('Login successful:', response.data);  
       //The response data ({ token: 'xxxxxxxxxxxxx' }) is stored in the response variable.// to send email pass to backend

      //login function from AuthContext
      if (response.data.token) {         //response.data.token Checks if the response actually contains a token.
        await login(response.data.token); // Pass the token to the  login function in authcontext.js and wait for response
        setSuccessMessage('Login Successful! Redirecting...');
        // Redirect to dashboard/profile after context updates user state
        router.push('/profile'); // Redirect to profile page   
      } else {
        setError('Login successful, but no token received.');
      }    

    } catch (err) {
      console.error('Login failed:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  //  Registration 
  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    if (registerPassword !== registerConfirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post('/users/register', {
        name: registerName,
        email: registerEmail,
        password: registerPassword,
      });
      console.log('Registration successful:', response.data);
      setSuccessMessage('Registration successful! Please log in.');
      // Clear register form
      setRegisterName('');
      setRegisterEmail('');
      setRegisterPassword('');
      setRegisterConfirmPassword('');
      // Switch to login tab after successful registration
      setActiveForm('login');
      

    } catch (err) {
      console.error('Registration failed:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Render Component 
  return (
    <div className={styles.authContainer}>
      <div className={styles.authBox}>
        {/* Tabs to switch between Login and Sign Up */}
        <div className={styles.tabContainer}>
          <button
            type="button"
            className={`${styles.tabButton} ${activeForm === 'login' ? styles.tabButtonActive : ''}`}
            onClick={() => { setActiveForm('login'); setError(''); setSuccessMessage(''); }}
            disabled={isLoading}
          >
            Login
          </button>
          <button
            type="button"
            className={`${styles.tabButton} ${activeForm === 'signup' ? styles.tabButtonActive : ''}`}
            onClick={() => { setActiveForm('signup'); setError(''); setSuccessMessage(''); }}
            disabled={isLoading}
          >
            Sign Up
          </button>
        </div>

        {/* Form Content Area */}
        <div className={styles.formContent}>
          {activeForm === 'login' ? (
            // Login Form 
            <form onSubmit={handleLoginSubmit}>
              {/* Email Input */}
              <div className={styles.inputBox}>
                <label htmlFor="login-email">Email Address</label>
                <input
                  type="email"
                  id="login-email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              {/* Password Input */}
              <div className={styles.inputBox}>
                <label htmlFor="login-password">Password</label>
                <input
                  type="password"
                  id="login-password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              
              
              {/* Login Button */}
              <button
                type="submit"
                className={`${styles.submitButton} ${styles.loginBtn}`}
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          ) : (
            // Register Form 
            <form onSubmit={handleRegisterSubmit}>
              {/* Name Input */}
              <div className={styles.inputBox}>
                <label htmlFor="register-name">Full Name</label>
                <input
                  type="text"
                  id="register-name"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
               {/* Email Input */}
              <div className={styles.inputBox}>
                <label htmlFor="register-email">Email Address</label>
                <input
                  type="email"
                  id="register-email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
               {/* Password Input */}
              <div className={styles.inputBox}>
                <label htmlFor="register-password">Password</label>
                <input
                  type="password"
                  id="register-password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              {/* Confirm Password Input */}
              <div className={styles.inputBox}>
                <label htmlFor="register-confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="register-confirmPassword"
                  value={registerConfirmPassword}
                  onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              {/* Register Button */}
              <button
                type="submit"
                className={`${styles.submitButton} ${styles.registerBtn}`}
                disabled={isLoading}
              >
                {isLoading ? 'Registering...' : 'Register'}
              </button>
            </form>
          )}
        </div>

        {/* Display Error or Success Messages */}
        <div className={styles.messageArea}>
          {error && <p className={styles.errorMessage}>{error}</p>}
          {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
        </div>

      </div>
    </div>
  );
}

