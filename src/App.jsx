import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import DriverDashboard from './pages/DriverDashboard';
import UserDashboard from './pages/UserDashboard';
import ReportBin from './pages/ReportBin';
import Assignments from './pages/Assignments';
import RoutesPage from './pages/RoutesPage';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Inventory from './pages/Inventory';
import Fleet from './pages/Fleet';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';

function AuthWrapper({ children, requiredRole }) {
  const { user, isAuthenticated } = useAuth();
  
  // Debug logging
  console.log('AuthWrapper - User:', user, 'Authenticated:', isAuthenticated, 'Required Role:', requiredRole);
  
  if (!isAuthenticated) {
    console.log('Redirecting to login - not authenticated');
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && user?.role !== requiredRole) {
    console.log('Redirecting to login - role mismatch. User role:', user?.role, 'Required:', requiredRole);
    return <Navigate to="/login" replace />;
  }
  
  console.log('Rendering children for role:', user?.role);
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={
          <AuthWrapper requiredRole="admin">
            <Layout>
              <Route index element={<AdminDashboard />} />
              <Route path="report" element={<ReportBin />} />
              <Route path="assignments" element={<Assignments />} />
              <Route path="routes" element={<RoutesPage />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="settings" element={<Settings />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="fleet" element={<Fleet />} />
            </Layout>
          </AuthWrapper>
        } />
        
        {/* Driver Routes */}
        <Route path="/driver" element={
          <AuthWrapper requiredRole="driver">
            <Layout>
              <Route index element={<DriverDashboard />} />
              <Route path="report" element={<ReportBin />} />
              <Route path="fleet" element={<Fleet />} />
            </Layout>
          </AuthWrapper>
        } />
        
        {/* User Routes */}
        <Route path="/user" element={
          <AuthWrapper requiredRole="user">
            <Layout>
              <Route index element={<UserDashboard />} />
              <Route path="report" element={<ReportBin />} />
            </Layout>
          </AuthWrapper>
        } />
        
        {/* Default dashboard route - redirect based on role */}
        <Route path="/" element={<Dashboard />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function AppWithProvider() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

export default AppWithProvider;
