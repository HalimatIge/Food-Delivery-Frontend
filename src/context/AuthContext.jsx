import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config/constants';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false); 

  useEffect(() => {
    checkAuthStatus();
  }, []);


const checkAuthStatus = async () => {
  try {
    
    const response = await axios.get(`${API_URL}/api/auth/me`, {
      withCredentials: true,
    });
    
  
    
    if (response.data.success) {
      setUser(response.data.user);
    } else {
    
      setUser(null);
    }
  } catch (error) {
  
    setUser(null);
  } finally {
    setAuthLoading(false);
    setIsInitialized(true);

  }
};

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/signin`,
        { email, password },
        { withCredentials: true }
      );

    

      if (response.data.success) {
        setUser(response.data.user);
        return { success: true, user: response.data.user };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/api/auth/logout`, {}, {
        withCredentials: true,
      });
    
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
     
    }
  };

  const value = {
    user,
    authLoading,
    isInitialized, 
    login,
    logout,
    checkAuthStatus,
    setUser, 
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;