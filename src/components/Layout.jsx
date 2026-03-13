import { useState, useEffect } from 'react';
import { Link, useLocation, Outlet, NavLink } from 'react-router-dom';
import { Trash2, Home, FileText, Users, Map, Menu, X, Sun, Moon, Bell, Settings, LogOut, MapPin, ClipboardList, Truck, BarChart3, Package, Wrench, Database } from 'lucide-react';

export default function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + K for quick search (placeholder)
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        console.log('Quick search activated');
      }
      
      // Ctrl/Cmd + / for keyboard shortcuts help
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        alert('Keyboard Shortcuts:\n\nCtrl+K: Quick Search\nCtrl+/: Show Help\nEsc: Close modals\nTab: Navigate\nEnter: Select');
      }
      
      // Escape to close mobile menu
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  // Focus management for accessibility
  useEffect(() => {
    const handleFocusTrap = (e) => {
      if (e.key === 'Tab' && isMobileMenuOpen) {
        // Basic focus trapping for mobile menu
        const focusableElements = document.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener('keydown', handleFocusTrap);
    return () => document.removeEventListener('keydown', handleFocusTrap);
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // In a real app, this would apply dark mode styles
    console.log('Dark mode toggled:', !isDarkMode);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-green-600 text-white shadow-lg" role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <NavLink 
              to="/" 
              className="flex items-center space-x-2 text-white hover:text-green-100 transition-colors"
              aria-label="Smart Waste Management Home"
            >
              <Trash2 className="h-8 w-8" aria-hidden="true" />
              <span className="text-xl font-bold">Smart Waste Management</span>
            </NavLink>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8" role="navigation" aria-label="Main navigation">
              <NavLink 
                to="/" 
                end 
                className={({ isActive }) => 
                  `flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-green-700 text-white' 
                      : 'text-green-100 hover:bg-green-700 hover:text-white'
                  }`
                }
                aria-label="Dashboard"
              >
                <Home className="h-4 w-4" aria-hidden="true" />
                <span>Dashboard</span>
              </NavLink>
              <NavLink 
                to="/report" 
                className={({ isActive }) => 
                  `flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-green-700 text-white' 
                      : 'text-green-100 hover:bg-green-700 hover:text-white'
                  }`
                }
                aria-label="Report a full bin"
              >
                <MapPin className="h-4 w-4" aria-hidden="true" />
                <span>Report Bin</span>
              </NavLink>
              <NavLink 
                to="/assignments" 
                className={({ isActive }) => 
                  `flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-green-700 text-white' 
                      : 'text-green-100 hover:bg-green-700 hover:text-white'
                  }`
                }
                aria-label="Manage assignments"
              >
                <ClipboardList className="h-4 w-4" aria-hidden="true" />
                <span>Assignments</span>
              </NavLink>
              <NavLink 
                to="/routes" 
                className={({ isActive }) => 
                  `flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-green-700 text-white' 
                      : 'text-green-100 hover:bg-green-700 hover:text-white'
                  }`
                }
                aria-label="View truck routes"
              >
                <Truck className="h-4 w-4" aria-hidden="true" />
                <span>Routes</span>
              </NavLink>
              <NavLink 
                to="/analytics" 
                className={({ isActive }) => 
                  `flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-green-700 text-white' 
                      : 'text-green-100 hover:bg-green-700 hover:text-white'
                  }`
                }
                aria-label="View analytics"
              >
                <BarChart3 className="h-4 w-4" aria-hidden="true" />
                <span>Analytics</span>
              </NavLink>
              <NavLink 
                to="/inventory" 
                className={({ isActive }) => 
                  `flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-green-700 text-white' 
                      : 'text-green-100 hover:bg-green-700 hover:text-white'
                  }`
                }
                aria-label="Manage inventory"
              >
                <Package className="h-4 w-4" aria-hidden="true" />
                <span>Inventory</span>
              </NavLink>
              <NavLink 
                to="/fleet" 
                className={({ isActive }) => 
                  `flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-green-700 text-white' 
                      : 'text-green-100 hover:bg-green-700 hover:text-white'
                  }`
                }
                aria-label="Manage fleet"
              >
                <Wrench className="h-4 w-4" aria-hidden="true" />
                <span>Fleet</span>
              </NavLink>
            </nav>

            {/* Action Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={toggleNotifications}
                className="p-2 text-green-100 hover:text-white transition-colors"
                aria-label="View notifications"
              >
                <Bell className="h-5 w-5" />
              </button>
              <button
                onClick={toggleDarkMode}
                className="p-2 text-green-100 hover:text-white transition-colors"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-green-100 hover:text-white transition-colors"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-green-700 border-t border-green-800" role="navigation" aria-label="Mobile navigation">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <NavLink 
                to="/" 
                end 
                className={({ isActive }) => 
                  `flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                    isActive 
                      ? 'bg-green-800 text-white' 
                      : 'text-green-100 hover:bg-green-800 hover:text-white'
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Dashboard"
              >
                <Home className="h-4 w-4" aria-hidden="true" />
                <span>Dashboard</span>
              </NavLink>
              <NavLink 
                to="/report" 
                className={({ isActive }) => 
                  `flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                    isActive 
                      ? 'bg-green-800 text-white' 
                      : 'text-green-100 hover:bg-green-800 hover:text-white'
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Report a full bin"
              >
                <MapPin className="h-4 w-4" aria-hidden="true" />
                <span>Report Bin</span>
              </NavLink>
              <NavLink 
                to="/assignments" 
                className={({ isActive }) => 
                  `flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                    isActive 
                      ? 'bg-green-800 text-white' 
                      : 'text-green-100 hover:bg-green-800 hover:text-white'
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Manage assignments"
              >
                <ClipboardList className="h-4 w-4" aria-hidden="true" />
                <span>Assignments</span>
              </NavLink>
              <NavLink 
                to="/routes" 
                className={({ isActive }) => 
                  `flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                    isActive 
                      ? 'bg-green-800 text-white' 
                      : 'text-green-100 hover:bg-green-800 hover:text-white'
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="View truck routes"
              >
                <Truck className="h-4 w-4" aria-hidden="true" />
                <span>Routes</span>
              </NavLink>
              <NavLink 
                to="/analytics" 
                className={({ isActive }) => 
                  `flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                    isActive 
                      ? 'bg-green-800 text-white' 
                      : 'text-green-100 hover:bg-green-800 hover:text-white'
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="View analytics"
              >
                <BarChart3 className="h-4 w-4" aria-hidden="true" />
                <span>Analytics</span>
              </NavLink>
              <NavLink 
                to="/inventory" 
                className={({ isActive }) => 
                  `flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                    isActive 
                      ? 'bg-green-800 text-white' 
                      : 'text-green-100 hover:bg-green-800 hover:text-white'
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Manage inventory"
              >
                <Package className="h-4 w-4" aria-hidden="true" />
                <span>Inventory</span>
              </NavLink>
              <NavLink 
                to="/fleet" 
                className={({ isActive }) => 
                  `flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                    isActive 
                      ? 'bg-green-800 text-white' 
                      : 'text-green-100 hover:bg-green-800 hover:text-white'
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Manage fleet"
              >
                <Wrench className="h-4 w-4" aria-hidden="true" />
                <span>Fleet</span>
              </NavLink>
              <NavLink 
                to="/settings" 
                className={({ isActive }) => 
                  `flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                    isActive 
                      ? 'bg-green-800 text-white' 
                      : 'text-green-100 hover:bg-green-800 hover:text-white'
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Settings"
              >
                <Settings className="h-4 w-4" aria-hidden="true" />
                <span>Settings</span>
              </NavLink>
            </div>
          </div>
        )}
      </header>
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Outlet />
      </main>
      
      <footer className="bg-gray-800 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm">© 2024 Smart Waste Management System. Keeping cities clean and efficient.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
