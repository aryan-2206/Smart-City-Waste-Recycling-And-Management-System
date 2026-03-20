import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
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

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="report" element={<ReportBin />} />
            <Route path="assignments" element={<Assignments />} />
            <Route path="routes" element={<RoutesPage />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="fleet" element={<Fleet />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
