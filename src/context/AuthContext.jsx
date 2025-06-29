import React, { createContext, useContext, useState, useCallback,useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);

 const fetchCartCountFromServer = useCallback(async () => {
  if (!user?.token) return;
  try {
    const res = await API.get('/cart', {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    const total = res.data.totalQuantity ?? 0;
    setCartCount(total);
  } catch (err) {
    console.error('❌ Failed to fetch cart count:', err.response?.data || err.message);
  }
}, [user]);



  // Run once on mount: restore user and fetch cart count
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser && typeof parsedUser === 'object') {
          setUser(parsedUser);
          fetchCartCountFromServer();
        } else {
          localStorage.removeItem('user');
        }
      }
    } catch (err) {
      console.error('Invalid user data in localStorage:', err);
      localStorage.removeItem('user');
    }

    // Sync cart updates
    window.addEventListener('cartUpdated', fetchCartCountFromServer);
    return () => {
      window.removeEventListener('cartUpdated', fetchCartCountFromServer);
    };
  }, []);

  // Handle login
  const login = (userData) => {
    const finalUser = { ...userData, role: userData.role || 'user' };
    localStorage.setItem('user', JSON.stringify(finalUser));
    setUser(finalUser);
    fetchCartCountFromServer();
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // Handle logout
  const logout = async () => {
    try {
      await API.post('/logout');
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      localStorage.removeItem('user');
      setUser(null);
      setCartCount(0);
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        setUser,
        cartCount,
        setCartCount,
     
        fetchCartCountFromServer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
