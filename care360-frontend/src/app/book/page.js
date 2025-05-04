'use client'; // Directive for client-side hooks and interactivity

import React, { useState, //useEffect
 Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation'; // Hooks for reading URL params and navigation
import styles from './book.module.css'; // Import CSS module
import api from '../../services/api'; // Import Axios instance

// A wrapper component is needed to use useSearchParams because it relies on Suspense
function BookingForm() {
  const searchParams = useSearchParams(); // to read url parameters
  const router = useRouter(); // Hook for programmatic navigation

  // Get service details from URL query parameters
  const serviceId = searchParams.get('serviceId');
  const serviceName = searchParams.get('serviceName') ? decodeURIComponent(searchParams.get('serviceName')) : null;
  const category = searchParams.get('category') ? decodeURIComponent(searchParams.get('category')) : null;
  const price = searchParams.get('price'); 


  // State for date and time inputs
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState(''); 
  const [isLoading, setIsLoading] = useState(false);    // in this BookingForm component sets up a "memory box" called isLoading using React's useState hook.
  //It disables the date input, time input, and the submit button (disabled={isLoading}) while the request is being processed, 
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');


  //Handle Booking Submission 
  const handleBookingSubmit = async (event) => {
    event.preventDefault(); // Prevent default page reload on form submit
    setError(''); // Clear previous messages
    setSuccessMessage('');

    if (!serviceId || !selectedDate || !selectedTime) {
      setError('Please select a valid date and time.');
      return;
    }     
    setIsLoading(true); 
    // Combine date and time into a format the backend expects
    // Example: ISO 8601 format. Adjust if your backend needs something different.
    const bookingDateTime = `${selectedDate}T${selectedTime}:00`;

    try {      
      // The user ID should be automatically added by the backend's authMiddleware
      const response = await api.post('/bookings/create', { 
        serviceId: serviceId,
         date: bookingDateTime, 
        //department: category,      
            });
      console.log('Booking successful:', response.data);
      setSuccessMessage(`Booking for "${serviceName}" confirmed for ${selectedDate} at ${selectedTime}! Redirecting...`);      
      // Redirect to profile/dashboard after a delay
      setTimeout(() => {
        router.push('/profile'); 
      }, 3000); // Redirect after 3 seconds

    } catch (err) {
      console.error('Booking failed:', err.response?.data || err.message);
      // Handle specific errors, e.g., if the user is not logged in (401)
      if (err.response?.status === 401) {
         setError('You must be logged in to make a booking. Redirecting to login...');
         // Optionally redirect to login after a delay
         setTimeout(() => router.push('/auth'), 2500);
      } else {
        // Show generic error or specific error from backend
        setError(err.response?.data?.message || 'Booking failed. Please try again later.');
      }
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  // Function to get today's date in YYYY-MM-DD format for the min attribute
  const getTodayDate = () => {
    const today = new Date();
    // Adjust for timezone offset to prevent issues with min date being yesterday
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    return today.toISOString().split('T')[0];
  };
  // the main booking form 
  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Book Your Service</h1>

      {/* Display Selected Service Info */}
      <div className={styles.serviceInfo}>
        <p><strong>Category:</strong> {category}</p>
        <p><strong>Service:</strong> {serviceName}</p>
        <p><strong>Price:</strong> Rs {price}</p>
      </div>

      {/* Booking Form */}
      <form onSubmit={handleBookingSubmit}>
        {/* Date Input */}
        <div className={styles.formGroup}>
          <label htmlFor="booking-date">Select Date</label>
          <input
            type="date"
            id="booking-date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            required
            min={getTodayDate()} // Prevent booking past dates
            disabled={isLoading || !!successMessage} // Disable if loading or successful
          />
        </div>
        {/* Time Input */}
        <div className={styles.formGroup}>
          <label htmlFor="booking-time">Select Time</label>
          <input
            type="time"
            id="booking-time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            required
            disabled={isLoading || !!successMessage} 
          />
        </div>
        {/* Display Messages */}
        <div className={styles.messageArea}>
          {error && <p className={styles.errorMessage}>{error}</p>}
          {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
        </div>
        {/* Submit Button */}
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isLoading || !!successMessage} 
        >
          {isLoading ? 'Booking...' : 'Confirm Booking'}
        </button>
      </form>
    </div>
  );
}
export default function BookPage() {
  return (
    // Suspense provides a fallback UI while client components load or data is fetched
    <Suspense fallback={<div className="text-center p-10">Loading booking form...</div>}>
      <BookingForm /> 
    </Suspense>
  );
}
