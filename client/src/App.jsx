import React from 'react'; 
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import { Auth } from './pages/Auth';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import CitizenDashboard from './pages/citizen/Dashboard';
import SubmitReport from './pages/citizen/SubmitReport';
import MyReports from './pages/citizen/MyReports';
import CitizenProfile from './pages/citizen/Profile';
import Badges from './pages/citizen/Badges';
import CollectorDashboard from './pages/collector/Dashboard';
import CollectorPickups from './pages/collector/Pickups';
import CollectorBadges from './pages/collector/Badges';
import AdminDashboard from './pages/admin/Dashboard';
import AdminReports from './pages/admin/Reports';
import AdminUsers from './pages/admin/Users';
import ProtectedRoute from './components/ProtectedRoute';
import { useLocation } from 'react-router-dom';

import ModuleLayout from './components/layout/ModuleLayout';
import { Toaster } from 'react-hot-toast';

const AppContent = () => {
  const location = useLocation();
  const hideNavbar = 
    location.pathname === '/login' || 
    location.pathname === '/signup' || 
    location.pathname === '/forgot-password' || 
    location.pathname.startsWith('/reset-password') || 
    location.pathname.startsWith('/citizen/') ||
    location.pathname.startsWith('/admin/') ||
    location.pathname.startsWith('/collector/');

  return (
    <div className="flex flex-col min-h-screen">
      {!hideNavbar && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<Home />} />
          <Route path="/signup" element={<Auth />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          
          {/* Unified Routes with ModuleLayout */}
          <Route 
            element={
              <ProtectedRoute>
                <ModuleLayout />
              </ProtectedRoute>
            }
          >
            {/* Citizen */}
            <Route path="/citizen/dashboard" element={<CitizenDashboard />} />
            <Route path="/citizen/report" element={<SubmitReport />} />
            <Route path="/citizen/my-reports" element={<MyReports />} />
            <Route path="/citizen/profile" element={<CitizenProfile />} />
            <Route path="/citizen/badges" element={<Badges />} />
            <Route path="/citizen/notification" element={<CitizenDashboard />} />
            <Route path="/citizen/edit-report/:id" element={<SubmitReport isEdit={true} />} />
            
            {/* Collector */}
            <Route path="/collector/dashboard" element={<CollectorDashboard />} />
            <Route path="/collector/pickups" element={<CollectorPickups />} />
            <Route path="/collector/badges" element={<CollectorBadges />} />
            
            {/* Admin */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/users" element={<AdminUsers />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <ThemeProvider>
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
