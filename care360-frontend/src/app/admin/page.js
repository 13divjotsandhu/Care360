'use client'; // Directive for client-side hooks and interactivity

import React, { useState, useEffect } from 'react';
import Link from 'next/link'; // For linking to chat pages
import styles from './admin.module.css';
import api from '../../services/api'; 


// Admin Dashboard Page Component
export default function AdminDashboardPage() {
  // State for bookings, loading, and errors
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
// State to track which booking is currently being updated
const [updatingStatusId, setUpdatingStatusId] = useState(null);
  
  const isAdmin = true; // !!(user && user.role === 'admin'); // Example logic
  const authLoading = false; 

  //Fetch All Bookings
  useEffect(() => {
    // Don't fetch if auth is still loading or user is not admin
    if (authLoading) {
      return;
    }
    if (!isAdmin) {
      // If auth loaded but user is not admin, set error
      setError('Access Denied. Admin privileges required.');
      setIsLoading(false);
      return; // Exit if not authorized
    }

    const fetchBookings = async () => {
      setIsLoading(true);
      setError('');
      try {
        // Use the root '/bookings' endpoint which maps to getBookingDetails for admins
        console.log("Fetching all bookings from /api/bookings...");
        const response = await api.get('/bookings');

        // Ensure the response data is an array (as expected for 'find()')
        if (Array.isArray(response.data)) {
          console.log("Bookings received:", response.data.length); 
          setBookings(response.data);
        } else {
           // Handle cases where the endpoint might return something else unexpectedly
           console.warn("Received non-array response for all bookings:", response.data);
           setError('Received unexpected data format from server.');
           setBookings([]); 
        }

      } catch (err) {
        console.error('Failed to fetch bookings:', err.response?.data || err.message);
        // Handle specific errors (like 401/403 if token is invalid/missing or user is not admin)
        if (err.response?.status === 401 || err.response?.status === 403) {
          setError('Authentication failed or access denied. Please log in as an admin.');
          // TODO: Redirect to login or show appropriate message
        } else {
          setError(err.response?.data?.message || 'Failed to fetch bookings. Is the backend server running?');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();

  }, [authLoading, isAdmin]); // Re-run effect if auth state changes



  // --- Handle Status Change ---
  const handleStatusChange = async (bookingId, newStatus) => {
    // Prevent changing if already updating or status is the same
    if (updatingStatusId === bookingId || !newStatus) return;

    setUpdatingStatusId(bookingId); // Set loading state for this specific booking row
    setError(''); // Clear previous errors

    try {
      console.log(`Updating booking ${bookingId} status to ${newStatus}...`);
      // Make API call to the backend endpoint to update status
      const response = await api.patch(`/bookings/${bookingId}/status`, {
        status: newStatus // Send the new status in the request body
      });

      console.log("Status update successful:", response.data);

      // Update the status in the local state to reflect the change immediately
      setBookings(currentBookings =>
        currentBookings.map(booking =>
          booking._id === bookingId ? { ...booking, status: newStatus.toLowerCase() } : booking // Ensure consistent casing
        )
      );
      alert(`Booking ${bookingId.substring(0,6)}... status updated to ${newStatus}.`); // Simple feedback

    } catch (err) {
      console.error(`Failed to update status for booking ${bookingId}:`, err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to update status.');
     
      alert(`Error updating status: ${err.response?.data?.message || 'Please try again.'}`); // Simple alert for error
    } finally {
      setUpdatingStatusId(null); // Clear loading state for this row
    }
  };





  
  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      // Options for formatting date and time
      const options = {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true
      };
      return new Date(dateString).toLocaleString('en-US', options);
    } catch (e) {
      console.error("Error formatting date:", e); // Log formatting errors
      return 'Invalid Date';
    }
  };

  // --- Helper function to get status badge style ---
   const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return styles.statusPending;
      case 'confirmed': return styles.statusConfirmed; 
      case 'completed': return styles.statusCompleted;
      default: return ''; // Default styling if status is unknown
    }
  };


  //Render Loading State 
  if (isLoading || authLoading) {
    return <div className={`${styles.pageContainer} ${styles.loadingMessage}`}>Loading dashboard...</div>;
  }

  // Render Error State
  if (error) {
    return <div className={`${styles.pageContainer} ${styles.errorMessage}`}>{error}</div>;
  }

  //Render Main Dashboard
  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Admin Dashboard - All Bookings</h1>
      {bookings.length === 0 ? (
        <p className="text-center text-gray-500 italic">No bookings found.</p>
      ) : (
        // Add horizontal scroll on small screens if table is wide
        <div className="overflow-x-auto">
          <table className={styles.bookingsTable}>           
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>User</th>
                <th>Service</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            {/* Table Body */}
            <tbody>
              {/* Map over the bookings array to create a row for each booking */}
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  {/* Display Booking ID */}
                  <td className="font-mono text-xs">{booking._id}</td>
                  {/* Display User Info (handle potential missing data) */}
                  <td>{booking.user?.name || 'N/A'} ({booking.user?.email || 'N/A'})</td>
                  {/* Display Service Info (handle potential missing data) */}
                  <td>{booking.service?.name || 'N/A'}</td>
                  {/* Display Formatted Date */}
                  <td>{formatDate(booking.date)}</td>
                  {/* Display Status Badge */}
                  <td data-label="Status:">
                    {/* Status Dropdown */}
                    <select
                      value={booking.status || 'pending'} // Controlled component
                      onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                      // Apply badge styles based on current status for appearance
                      className={`${styles.statusBadge} ${getStatusClass(booking.status)}`}
                      disabled={updatingStatusId === booking._id} // Disable while updating this row
                      aria-label={`Update status for booking ${booking._id}`} // Accessibility
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                    </select>
                    {updatingStatusId === booking._id && <span className="ml-2 animate-spin">⏳</span>}
                  </td>
                  
                  <td>
                    
                    <Link
                      href={`/chat/${booking._id}`} // Dynamic route for chat page
                      className={styles.chatButton}
                    >
                      View Chat
                    </Link>
                   
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
