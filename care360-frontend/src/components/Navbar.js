'use client'; // Navbar needs client-side interaction for logout and reading context

import React from 'react';
import Link from 'next/link'; // Import Next.js Link component
import styles from './Navbar.module.css'; // Import the CSS module
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook


// Functional component for the Navigation Bar
function Navbar() {
  // Get authentication state and logout function from the context
  const { isAuthenticated, user, logout, isLoading } = useAuth();

  // Handler for the logout button click
  const handleLogout = () => {
    logout(); // Call the logout function from the context
  };

  // Render a simplified loading state or nothing while auth is loading
  if (isLoading) {
    return (
       <nav className={styles.navbar}>
         <div className={styles.container}>
            <Link href="/" className={styles.brand}>Care360</Link>
            {/* Basic loading indicator */}
            <div className="text-sm text-gray-300">Loading...</div>
         </div>
       </nav>
    );
  }

  // Render the full navbar based on authentication state
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Logo/Brand Name */}
        <Link href="/" className={styles.brand}>
          Care360 - Protect, Repair, Inspect 
        </Link>
        

        {/* Navigation Links */}
        <div className={styles.navLinks}>
          <Link href="/" className={styles.navLink}>
            Home
          </Link>
          {/* Add link to services page */}
          <Link href="/services" className={styles.navLink}>
            Services
          </Link>

          {/* Conditional Rendering based on Login Status */}
          {isAuthenticated ? (
            // Links/buttons shown when the user IS logged in
            <>
              {/* Link to user profile/dashboard */}
              <Link href="/profile" className={styles.navLink}>
                Profile
              </Link>
              {/* Show Admin link only if the logged-in user has the 'admin' role */}
              {user?.role === 'admin' && (
                 <Link href="/admin" className={styles.navLink}>
                   Admin
                 </Link>
              )}
              {/* Welcome message (optional) */}
              <span className="text-sm hidden md:inline text-gray-200 mr-2">
                Welcome, {user?.name || 'User'}!
              </span>
              {/* Logout Button */}
              <button
                onClick={handleLogout} // Call logout handler on click
                className={`${styles.button} ${styles.logoutButton}`}
              >
                Logout
              </button>
            </>
          ) : (
            // Links/buttons shown when the user IS NOT logged in
            <>
              {/* Link to combined Auth Page */}
              <Link
                href="/auth" // Link to the combined auth page
                className={`${styles.button} ${styles.loginButton}`}
              >
                Login / Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
