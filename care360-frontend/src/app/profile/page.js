'use client'; // Directive for client-side hooks and interactivity

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './profile.module.css'; // Import CSS module
import api from '../../services/api'; // Import Axios instance
import { useAuth } from '../../context/AuthContext'; // Import auth context hook

export default function ProfilePage() {
  // Get user info and auth state from context
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();

  // State for user's bookings
  const [bookings, setBookings] = useState([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [error, setError] = useState('');

  // Fetch User's Bookings ---
  useEffect(() => {
    // Wait for auth loading to finish and ensure user is authenticated
    if (authLoading) {
      return; 
    }
    if (!isAuthenticated || !user) {
      // If not authenticated after loading, redirect to auth page
      router.push('/auth');
      return;
     }

    const fetchUserBookings = async () => {
      setIsLoadingBookings(true);
      setError('');
      try {
        //  Make API call to backend endpoint to get user's bookings        
        // This endpoint return bookings for req.user.id

        console.log("Fetching user bookings from /api/bookings/my...");
        const response = await api.get('/bookings/my'); 
        if (Array.isArray(response.data)) {
          console.log("User bookings received:", response.data.length);
          setBookings(response.data);
        } else {
          console.warn("Received non-array response for user bookings:", response.data);
          setError('Received unexpected data format from server.');
          setBookings([]);
        }
      } catch (err) {
        console.error('Failed to fetch user bookings:', err.response?.data || err.message);
        if (err.response?.status === 401 || err.response?.status === 403) {
          setError('Authentication failed. Please log in again.');
        } else {
          setError(err.response?.data?.message || 'Failed to load your bookings.');
        }
      } finally {
        setIsLoadingBookings(false);
      }
    };

    fetchUserBookings();

  }, [isAuthenticated, authLoading, user, router, logout]); 

  // Helper function to format date 
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
      return new Date(dateString).toLocaleString('en-US', options);
    } catch (e) {
      return 'Invalid Date';
    }
  };

   // Helper function to get status badge style 
   const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return styles.statusPending;
      case 'confirmed': return styles.statusConfirmed; 
      case 'completed': return styles.statusCompleted;
      default: return '';
    }
  };


  // Show loading state while checking auth or fetching data
  if (authLoading || isLoadingBookings) {
    return <div className={`${styles.pageContainer} ${styles.loadingMessage}`}>Loading profile...</div>;
  }

  // If not authenticated after loading (should have been redirected, but check again)
  if (!isAuthenticated || !user) {
     return <div className={`${styles.pageContainer} ${styles.errorMessage}`}>Please log in to view your profile.</div>;
  }

  //Profile Page
  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Your Profile</h1>

      {/* User Information Section */}
      <section className={styles.userInfo}>
        <h2>Welcome, {user.name}!</h2>
        <p><strong>Email:</strong> {user.email}</p>
        {/* Add other user details if available */}
      </section>

      {/* Bookings Section */}
      <section className={styles.bookingsSection}>
        <h2 className={styles.bookingsTitle}>Your Bookings</h2>
        {error && <p className={styles.errorMessage}>{error}</p>}

        {!error && bookings.length === 0 && (
          <p className={styles.noBookingsMessage}>You haven't made any bookings yet.</p>
        )}

        {!error && bookings.length > 0 && (
          <ul className={styles.bookingsList}>
            {bookings.map((booking) => (
              <li key={booking._id} className={styles.bookingCard}>
                {/* Display Service Name (requires population on backend) */}
                <h3>{booking.service?.name || 'Service Details Unavailable'}</h3>
                <p><strong>Booking ID:</strong> <span className="font-mono text-xs">{booking._id}</span></p>
                <p><strong>Date:</strong> {formatDate(booking.date)}</p>
                <p>
                  <strong>Status:</strong>
                  <span className={`${styles.statusBadge} ${getStatusClass(booking.status)}`}>
                    {booking.status || 'N/A'}
                  </span>
                </p>
                 {/* Add other booking details if needed */}

                 {/* Actions for the booking */}
                 <div className={styles.bookingActions}>
                    {/* Show chat button only for relevant statuses (e.g., not completed) */}
                    {booking.status !== 'completed' && (
                         <Link
                            href={`/chat/${booking._id}`} // Dynamic route to chat page
                            className={styles.chatButton}
                         >
                           Chat Now
                         </Link>
                    )}
                    {/* Placeholder for other actions */}
                 </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
