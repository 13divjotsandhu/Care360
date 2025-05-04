import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create an Axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL, // Set the base URL for all requests
  headers: {
    'Content-Type': 'application/json', // Default content type
  },
});

/* Use this to automatically attach the JWT token if it exists. */
api.interceptors.request.use(
  (config) => {
    // Check if running on the client-side before accessing localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken'); // Use the key you'll use to store the token
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`; // Add the token to the header
      }
    }
    return config; // Return the modified config
  },
  (error) => {
    // Handle request errors
    console.error('Axios Request Error:', error);
    return Promise.reject(error); // Propagate the error
  }
);

/*
 * Axios Response Interceptor: Runs after a response is received.
 * Use this for global error handling (e.g., 401 Unauthorized).
 */
api.interceptors.response.use(
  (response) => {
    // If the response is successful (status code 2xx), just return it
    return response;
  },
  (error) => {
    // Handle response errors
    console.error('Axios Response Error:', error.response?.data || error.message);

    // Example: Global handling for 401 Unauthorized
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized! Redirecting to login or clearing token...');
      // Check if running on client-side before redirecting or clearing storage
      if (typeof window !== 'undefined') {
        
      }
    }

    // Propagate the error so component-level .catch() can also handle it
    return Promise.reject(error);
  }
);
export default api;
