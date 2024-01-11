import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

// Custom hook to access the AuthContext
export function useAuth() {
  return useContext(AuthContext);
}

const baseURL = 'http://localhost:3001/v1';
// const baseURL = 'api.surebankstores.ng/v1';

export function AuthProvider({ children }) {
  const initialToken = localStorage.getItem('ACCESS_TOKEN_KEY');
  const [currentUser, setCurrentUser] = useState(null);
  
  useEffect(() => {
    if (initialToken) {
      const fetchUser = async () => {
        try {
          const userResponse = await axios.get(`${baseURL}/users/me`, {
            headers: {
              Authorization: `Bearer ${initialToken}`,
            },
          });
          setCurrentUser(userResponse.data);
        } catch (error) {
          console.error(error);
          setCurrentUser(null);
        }
      };
      fetchUser();
    }
  }, [initialToken]);

  const signup = async (userData) => {
    try {
      const response = await axios.post(
        `${baseURL}/auth/register`,
        userData
      );
      const accessToken = response.data.tokens.access.token;
      const refreshToken = response.data.tokens.refresh.token;
      // Store the JWT token in session storage
      localStorage.setItem('ACCESS_TOKEN_KEY', accessToken);
      localStorage.setItem('REFRESH_TOKEN_KEY', refreshToken);

      // Now, set the access token as the default authorization header for all axios requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      setCurrentUser(response.data.user);
    } catch (error) {
      console.error(error);
      throw new Error(error.response?.data?.message || 'An error occurred');
    }
  };

  const login = async (identifier, password) => {
    try {
      const response = await axios.post(`${baseURL}/auth/login`, {
        identifier,
        password,
      });
      const accessToken = response.data.tokens.access.token;
      const refreshToken = response.data.tokens.refresh.token;
      // Store the JWT token in session storage
      localStorage.setItem('ACCESS_TOKEN_KEY', accessToken);
      localStorage.setItem('REFRESH_TOKEN_KEY', refreshToken);

      // Now, set the access token as the default authorization header for all axios requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      setCurrentUser(response.data.user);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'An error occurred');
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('REFRESH_TOKEN_KEY');
      await axios.post(`${baseURL}/auth/logout`, {
        refreshToken,
      });
      localStorage.removeItem('ACCESS_TOKEN_KEY');
      setCurrentUser(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, setCurrentUser, signup, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
