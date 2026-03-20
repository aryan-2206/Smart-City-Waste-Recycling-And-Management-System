import { useState, useEffect, createContext } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Trash2, Home, FileText, Users, Map, Menu, Sun, Moon, Bell, Settings, LogOut, MapPin, ClipboardList, Truck, BarChart3, Package, Wrench, Database, AlertCircle, CheckCircle, Info, X as CloseIcon } from 'lucide-react';

// Notification Context
const NotificationContext = createContext();

const initialDemoNotifications = [
  {
    id: 1,
    type: 'urgent',
    title: 'Urgent: Bin Overflow',
    message: 'Bin B-042 in North Sector reported as overflowing',
    time: '2 mins ago',
    icon: AlertCircle,
    read: false
  },
  {
    id: 2,
    type: 'success',
    title: 'Route Completed',
    message: 'Driver Raj Kumar completed Route A successfully',
    time: '15 mins ago',
    icon: CheckCircle,
    read: false
  },
  {
    id: 3,
    type: 'info',
    title: 'New Assignment',
    message: '3 new waste collection assignments created',
    time: '1 hour ago',
    icon: Info,
    read: true
  },
  {
    id: 4,
    type: 'warning',
    title: 'Low Fuel Alert',
    message: 'Vehicle TRK-002 fuel level below 25%',
    time: '2 hours ago',
    icon: AlertCircle,
    read: true
  }
];

export default function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(initialDemoNotifications);
  const { user, logout } = useAuth();
  const role = user?.role;
  const isAdmin = role === 'admin';
  const isDriver = role === 'driver';
  const navigate = useNavigate();

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      ...notification,
      time: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setShowNotifications(false);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

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
      
      // Escape to close mobile menu and notifications
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setShowNotifications(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'urgent': return AlertCircle;
      case 'success': return CheckCircle;
      case 'warning': return AlertCircle;
      case 'info': return Info;
      default: return Info;
    }
  };

  return (
    <NotificationContext.Provider value={{ addNotification, notifications, unreadCount }}>
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
                {isAdmin && (
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
                )}
                {isAdmin && (
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
                )}
                {isAdmin && (
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
                )}
                {isAdmin && (
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
                )}
                {(isAdmin || isDriver) && (
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
                )}
              </nav>

              {/* Action Buttons */}
              <div className="hidden md:flex items-center space-x-4">
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={toggleNotifications}
                    className="p-2 text-green-100 hover:text-white transition-colors relative"
                    aria-label="View notifications"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  
                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900">Notifications</h3>
                          <div className="flex items-center space-x-2">
                            {unreadCount > 0 && (
                              <button
                                onClick={markAllAsRead}
                                className="text-sm text-blue-600 hover:text-blue-800"
                              >
                                Mark all read
                              </button>
                            )}
                            <button
                              onClick={clearAllNotifications}
                              className="text-sm text-red-600 hover:text-red-800"
                            >
                              Clear all
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-gray-500">
                            <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                            <p>No notifications</p>
                          </div>
                        ) : (
                          notifications.map((notification) => {
                            const Icon = getNotificationIcon(notification.type);
                            return (
                              <div
                                key={notification.id}
                                className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                                  !notification.read ? 'bg-blue-50' : ''
                                }`}
                                onClick={() => markAsRead(notification.id)}
                              >
                                <div className="flex items-start space-x-3">
                                  <div className={`p-2 rounded-full ${
                                    notification.type === 'urgent' ? 'bg-red-100' :
                                    notification.type === 'success' ? 'bg-green-100' :
                                    notification.type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
                                  }`}>
                                    <Icon className={`h-4 w-4 ${
                                      notification.type === 'urgent' ? 'text-red-600' :
                                      notification.type === 'success' ? 'text-green-600' :
                                      notification.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                                    }`} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900">
                                      {notification.title}
                                    </p>
                                    <p className="text-sm text-gray-500 truncate">
                                      {notification.message}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                      {notification.time}
                                    </p>
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeNotification(notification.id);
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                  >
                                    <CloseIcon className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={toggleDarkMode}
                  className="p-2 text-green-100 hover:text-white transition-colors"
                  aria-label="Toggle dark mode"
                >
                  {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>

                <button
                  onClick={async () => {
                    await logout();
                    navigate('/login', { replace: true });
                  }}
                  className="p-2 text-green-100 hover:text-white transition-colors"
                  aria-label="Log out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 text-green-100 hover:text-white transition-colors"
                aria-label="Toggle mobile menu"
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <CloseIcon className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
                {isAdmin && (
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
                )}
                {isAdmin && (
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
                )}
                {isAdmin && (
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
                )}
                {isAdmin && (
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
                )}
                {(isAdmin || isDriver) && (
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
                )}
                {isAdmin && (
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
                )}

                <button
                  onClick={async () => {
                    await logout();
                    navigate('/login', { replace: true });
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-green-100 hover:bg-green-800"
                  aria-label="Log out"
                >
                  <div className="flex items-center space-x-2">
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    <span>Log out</span>
                  </div>
                </button>
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
    </NotificationContext.Provider>
  );
}
