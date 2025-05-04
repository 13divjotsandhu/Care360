'use client'; // This context will be used in client components

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter for redirection
import api from '../services/api'; 
// Create the context
const AuthContext = createContext(null);

// Create a provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // State to hold user data { id, name, email, role }
  const [token, setToken] = useState(null); // State to hold the JWT token
  const [isLoading, setIsLoading] = useState(true); // State to track initial loading
  const router = useRouter(); // Initialize router

  // Function to fetch user profile using the token
  const fetchUserProfile = useCallback(async (authToken) => {
    if (!authToken) {
        setIsLoading(false); // Ensure loading stops if no token
        return;
    }
    try {
      console.log("AuthContext: Fetching user profile...");
      // Backend endpoint to get profile info based on token
      const response = await api.get('/users/profile', {
        headers: { Authorization: `Bearer ${authToken}` } // Pass token explicitly
      });
      setUser(response.data); // Set user data in state
      console.log("AuthContext: User profile fetched:", response.data);
    } catch (error) {
      console.error('AuthContext: Failed to fetch user profile:', error.response?.data || error.message);
      logout(); 
    } finally {
        
    }
  }, []); 

  // Check for token in localStorage on initial application load (client-side only)
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      console.log("AuthContext: Token found in localStorage on initial load.");
      setToken(storedToken);
      fetchUserProfile(storedToken).finally(() => setIsLoading(false)); // Fetch profile and set loading false after fetch attempt
    } else {
      console.log("AuthContext: No token found in localStorage.");
      setIsLoading(false); // No token, so loading is finished
    }
  }, [fetchUserProfile]); 

  // Login function: Stores token, sets state, fetches profile ,111 come fisrt here
  const login = useCallback(async (newToken) => {
    if (newToken) {
      console.log("AuthContext: login function called.");
      localStorage.setItem('authToken', newToken); // Store token in localStorage under key authtoken
      setToken(newToken); 
      setIsLoading(true); 
      await fetchUserProfile(newToken); 
      setIsLoading(false); 
    }
  }, [fetchUserProfile]); 

  // Logout function: Clears state, removes token, redirects
  const logout = useCallback(() => {
    console.log("AuthContext: Logging out...");
    setUser(null); // Clear user state
    setToken(null); // Clear token state
    localStorage.removeItem('authToken'); // Remove token from storage
    // Redirect to auth page after logout using Next.js router
    router.push('/auth');
  }, [router]); 

  // The value provided to consuming components
  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user, // True if both token and user data exist
    isLoading, // Let components know if auth state is still loading
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Render children components */}
      {/* 
      The crucial part is value={value}. This takes the current state
       (user, token, isAuthenticated) and the functions (login, logout)
        stored inside AuthProvider and makes them available to any component 
        rendered inside the Provider (which is your whole app because you wrap
         it in layout.js).       
       Consider showing a global loading spinner based on isLoading */}
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for easy consumption of the context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Ensure the hook is used within the AuthProvider tree
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
