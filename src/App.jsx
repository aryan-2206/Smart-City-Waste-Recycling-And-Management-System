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
import ForgotPassword from './pages/ForgotPassword';
import './App.css';

function AuthWrapper({ children, requiredRole }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole) {
    const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!requiredRoles.includes(user?.role)) {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* App shell (header/nav) */}
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <AuthWrapper>
                <Dashboard />
              </AuthWrapper>
            }
          />

          <Route
            path="report"
            element={
              <AuthWrapper requiredRole={['admin', 'driver', 'user']}>
                <ReportBin />
              </AuthWrapper>
            }
          />

          <Route
            path="assignments"
            element={
              <AuthWrapper requiredRole="admin">
                <Assignments />
              </AuthWrapper>
            }
          />

          <Route
            path="routes"
            element={
              <AuthWrapper requiredRole="admin">
                <RoutesPage />
              </AuthWrapper>
            }
          />

          <Route
            path="analytics"
            element={
              <AuthWrapper requiredRole="admin">
                <Analytics />
              </AuthWrapper>
            }
          />

          <Route
            path="settings"
            element={
              <AuthWrapper requiredRole="admin">
                <Settings />
              </AuthWrapper>
            }
          />

          <Route
            path="inventory"
            element={
              <AuthWrapper requiredRole="admin">
                <Inventory />
              </AuthWrapper>
            }
          />

          <Route
            path="fleet"
            element={
              <AuthWrapper requiredRole={['admin', 'driver']}>
                <Fleet />
              </AuthWrapper>
            }
          />
        </Route>
        
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
