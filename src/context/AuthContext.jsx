import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  
  const getCartQuantity = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      return cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    } catch (err) {
      return 0;
    }
  };

  useEffect(() => {
  
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser && typeof parsedUser === 'object') {
          setUser(parsedUser);
        } else {
          localStorage.removeItem('user');
        }
      }
    } catch (err) {
      console.error('Invalid user data in localStorage:', err);
      localStorage.removeItem('user');
    }

    
    setCartCount(getCartQuantity());

  
    const updateCart = () => {
      setCartCount(getCartQuantity());
    };

    
    window.addEventListener('cartUpdated', updateCart);
    return () => {
      window.removeEventListener('cartUpdated', updateCart);
    };
  }, []);

  const login = (userData) => {
     const finalUser = { ...userData, role: userData.role || 'user' };
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setCartCount(getCartQuantity());
  };

  const logout = async () => {
    try {
      await API.post('/logout'); 
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      localStorage.removeItem('user');
      localStorage.removeItem('cart');
      setUser(null);
      setCartCount(0);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser, cartCount, setCartCount }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
