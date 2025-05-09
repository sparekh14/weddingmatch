import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [vendorId, setVendorId] = useState(null);
  const [token, setToken]       = useState(null);

  // On mount, load from storage
  useEffect(() => {
    const storedToken = localStorage.getItem('vendorToken');
    const storedVendorId = localStorage.getItem('vendorId');
    if (storedToken && storedVendorId) {
      setToken(storedToken);
      setVendorId(storedVendorId);
    }
  }, []);

  const login = ({ vendorId, token }) => {
    localStorage.setItem('vendorToken', token);
    localStorage.setItem('vendorId', vendorId);
    setToken(token);
    setVendorId(vendorId);
    // TODO: Potentially navigate to a vendor dashboard or redirect
  };

  const logout = () => {
    localStorage.removeItem('vendorToken');
    localStorage.removeItem('vendorId');
    setToken(null);
    setVendorId(null);
    // TODO: Potentially navigate to a login page or home page
  };

  return (
    <AuthContext.Provider value={{ vendorId, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for components to access auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 