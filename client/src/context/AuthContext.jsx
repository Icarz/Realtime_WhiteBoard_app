import  { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('whiteboard_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error loading user:', error);
        localStorage.removeItem('whiteboard_user');
      }
    }
  }, []);

  const login = (username, cursorColor = null) => {
    const userData = {
      username,
      cursorColor: cursorColor || `#${Math.floor(Math.random()*16777215).toString(16)}`,
      joinedAt: Date.now(),
    };

    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('whiteboard_user', JSON.stringify(userData));

    return userData;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('whiteboard_user');
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('whiteboard_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};