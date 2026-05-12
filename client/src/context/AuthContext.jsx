import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('study_tree_token');
    if (!token) { setLoading(false); return; }
    api.me()
      .then(({ user }) => setUser(user))
      .catch(() => localStorage.removeItem('study_tree_token'))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const { token, user } = await api.login({ email, password });
    localStorage.setItem('study_tree_token', token);
    setUser(user);
    return user;
  }, []);

  const register = useCallback(async (username, email, password) => {
    const { token, user } = await api.register({ username, email, password });
    localStorage.setItem('study_tree_token', token);
    setUser(user);
    return user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('study_tree_token');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
