import { useEffect, useState } from 'react';
import AuthContext from './AuthContext';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (error) {
        console.error('Failed to load user:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }

    return null;
  });

  useEffect(() => {
    const handleExpiredToken = () => {
      setUser(null);
    };

    window.addEventListener('auth:expired', handleExpiredToken);
    return () => window.removeEventListener('auth:expired', handleExpiredToken);
  }, []);

  const login = (data) => {
    if (!data?.token) {
      console.error('Login response does not contain token');
      return;
    }

    localStorage.setItem('token', data.token);

    const userData = {
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
    };

    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading: false,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};