import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import Layout from './components/Layout.jsx';
import TimerPage     from './pages/TimerPage.jsx';
import LoginPage     from './pages/LoginPage.jsx';
import RegisterPage  from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import GrovePage     from './pages/GrovePage.jsx';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/"          element={<Navigate to="/timer" replace/>}/>
            <Route path="/timer"     element={<TimerPage/>}/>
            <Route path="/login"     element={<LoginPage/>}/>
            <Route path="/register"  element={<RegisterPage/>}/>
            <Route path="/dashboard" element={<DashboardPage/>}/>
            <Route path="/grove"     element={<GrovePage/>}/>
            <Route path="*"          element={<Navigate to="/timer" replace/>}/>
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}
