import { useState } from 'react';
import { User, Bell, Shield, Palette, Globe, Database, Smartphone, Mail, Lock, Eye, EyeOff, Save, RotateCcw, Download, Upload, Trash2, Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  // Profile state
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@smartwaste.com',
    phone: '+91 98765 43210',
    role: 'Waste Manager',
    department: 'Operations',
    location: 'North Sector',
    bio: 'Managing waste collection operations for North Sector with focus on efficiency and sustainability.'
  });

  // Notification preferences
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    weeklyReports: true,
    urgentAlerts: true,
    systemUpdates: false,
    assignmentUpdates: true,
    completionReports: true
  });

  // Appearance settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'light',
    language: 'en',
    timezone: 'Asia/Kolkata',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    compactMode: false,
    animationsEnabled: true
  });

  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
    sessionTimeout: '30min',
    loginNotifications: true
  });

  // System settings
  const [systemSettings, setSystemSettings] = useState({
    autoRefresh: true,
    refreshInterval: '30s',
    dataRetention: '90days',
    backupEnabled: true,
    backupFrequency: 'daily',
    logLevel: 'info',
    apiRateLimit: '1000'
  });

  const addNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    addNotification('Profile updated successfully!', 'success');
  };

  const handleSaveNotifications = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    addNotification('Notification preferences saved!', 'success');
  };

  const handleSaveAppearance = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    addNotification('Appearance settings updated!', 'success');
  };

  const handleChangePassword = async () => {
    if (securitySettings.newPassword !== securitySettings.confirmPassword) {
      addNotification('Passwords do not match!', 'error');
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    
    setSecuritySettings({
      ...securitySettings,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    
    addNotification('Password changed successfully!', 'success');
  };

  const handleExportData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      addNotification('Data exported successfully!', 'success');
    }, 2000);
  };

  const handleImportData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      addNotification('Data imported successfully!', 'success');
    }, 2000);
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        addNotification('All data cleared successfully!', 'success');
      }, 1500);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'system', label: 'System', icon: Database },
    { id: 'data', label: 'Data Management', icon: SettingsIcon }
  ];

  return (
    <div className="space-y-6">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg shadow-lg text-white ${
              notification.type === 'success' ? 'bg-green-600' : 
              notification.type === 'error' ? 'bg-red-600' : 'bg-blue-600'
            }`}
          >
            {notification.message}
          </div>
        ))}
      </div>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <div className="bg-white rounded-lg shadow p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === tab.id
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Profile Information</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <select
                      value={profile.role}
                      onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="Waste Manager">Waste Manager</option>
                      <option value="Driver">Driver</option>
                      <option value="Administrator">Administrator</option>
                      <option value="Operator">Operator</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                    <select
                      value={profile.department}
                      onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="Operations">Operations</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Management">Management</option>
                      <option value="Customer Service">Customer Service</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <select
                      value={profile.location}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="North Sector">North Sector</option>
                      <option value="East Zone">East Zone</option>
                      <option value="Central">Central</option>
                      <option value="West District">West District</option>
                      <option value="South End">South End</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    rows={4}
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Profile
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h2>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-md font-medium text-gray-900">Notification Channels</h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={notificationSettings.emailNotifications}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, emailNotifications: e.target.checked })}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700">Email Notifications</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={notificationSettings.smsNotifications}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, smsNotifications: e.target.checked })}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700">SMS Notifications</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={notificationSettings.pushNotifications}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, pushNotifications: e.target.checked })}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700">Push Notifications</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-md font-medium text-gray-900">Notification Types</h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={notificationSettings.weeklyReports}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, weeklyReports: e.target.checked })}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700">Weekly Reports</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={notificationSettings.urgentAlerts}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, urgentAlerts: e.target.checked })}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700">Urgent Alerts</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={notificationSettings.systemUpdates}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, systemUpdates: e.target.checked })}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700">System Updates</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={notificationSettings.assignmentUpdates}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, assignmentUpdates: e.target.checked })}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700">Assignment Updates</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={notificationSettings.completionReports}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, completionReports: e.target.checked })}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700">Completion Reports</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveNotifications}
                    disabled={isLoading}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Preferences
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Appearance Preferences</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                    <select
                      value={appearanceSettings.theme}
                      onChange={(e) => setAppearanceSettings({ ...appearanceSettings, theme: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <select
                      value={appearanceSettings.language}
                      onChange={(e) => setAppearanceSettings({ ...appearanceSettings, language: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="en">English</option>
                      <option value="hi">हिन्दी</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                    <select
                      value={appearanceSettings.timezone}
                      onChange={(e) => setAppearanceSettings({ ...appearanceSettings, timezone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="Asia/Kolkata">Asia/Kolkata</option>
                      <option value="America/New_York">America/New_York</option>
                      <option value="Europe/London">Europe/London</option>
                      <option value="Asia/Tokyo">Asia/Tokyo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                    <select
                      value={appearanceSettings.dateFormat}
                      onChange={(e) => setAppearanceSettings({ ...appearanceSettings, dateFormat: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time Format</label>
                    <select
                      value={appearanceSettings.timeFormat}
                      onChange={(e) => setAppearanceSettings({ ...appearanceSettings, timeFormat: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="24h">24 Hour</option>
                      <option value="12h">12 Hour</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={appearanceSettings.compactMode}
                      onChange={(e) => setAppearanceSettings({ ...appearanceSettings, compactMode: e.target.checked })}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 text-sm text-gray-700">Compact Mode</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={appearanceSettings.animationsEnabled}
                      onChange={(e) => setAppearanceSettings({ ...appearanceSettings, animationsEnabled: e.target.checked })}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 text-sm text-gray-700">Enable Animations</span>
                  </label>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveAppearance}
                    disabled={isLoading}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Settings
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h2>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-md font-medium text-gray-900">Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={securitySettings.currentPassword}
                          onChange={(e) => setSecuritySettings({ ...securitySettings, currentPassword: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                        >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={securitySettings.newPassword}
                          onChange={(e) => setSecuritySettings({ ...securitySettings, newPassword: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        value={securitySettings.confirmPassword}
                        onChange={(e) => setSecuritySettings({ ...securitySettings, confirmPassword: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-md font-medium text-gray-900">Security Options</h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={securitySettings.twoFactorEnabled}
                        onChange={(e) => setSecuritySettings({ ...securitySettings, twoFactorEnabled: e.target.checked })}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700">Enable Two-Factor Authentication</span>
                    </label>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout</label>
                      <select
                        value={securitySettings.sessionTimeout}
                        onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="15min">15 minutes</option>
                        <option value="30min">30 minutes</option>
                        <option value="1hour">1 hour</option>
                        <option value="4hours">4 hours</option>
                      </select>
                    </div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={securitySettings.loginNotifications}
                        onChange={(e) => setSecuritySettings({ ...securitySettings, loginNotifications: e.target.checked })}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700">Login Notifications</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={handleChangePassword}
                    disabled={isLoading}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Update Password
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* System Settings */}
          {activeTab === 'system' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">System Configuration</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Auto Refresh</label>
                    <select
                      value={systemSettings.autoRefresh}
                      onChange={(e) => setSystemSettings({ ...systemSettings, autoRefresh: e.target.value === 'true' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="true">Enabled</option>
                      <option value="false">Disabled</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Refresh Interval</label>
                    <select
                      value={systemSettings.refreshInterval}
                      onChange={(e) => setSystemSettings({ ...systemSettings, refreshInterval: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="30s">30 seconds</option>
                      <option value="1min">1 minute</option>
                      <option value="5min">5 minutes</option>
                      <option value="10min">10 minutes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Data Retention</label>
                    <select
                      value={systemSettings.dataRetention}
                      onChange={(e) => setSystemSettings({ ...systemSettings, dataRetention: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="30days">30 days</option>
                      <option value="90days">90 days</option>
                      <option value="180days">180 days</option>
                      <option value="1year">1 year</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
                    <select
                      value={systemSettings.backupFrequency}
                      onChange={(e) => setSystemSettings({ ...systemSettings, backupFrequency: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Log Level</label>
                    <select
                      value={systemSettings.logLevel}
                      onChange={(e) => setSystemSettings({ ...systemSettings, logLevel: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="debug">Debug</option>
                      <option value="info">Info</option>
                      <option value="warning">Warning</option>
                      <option value="error">Error</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">API Rate Limit</label>
                    <select
                      value={systemSettings.apiRateLimit}
                      onChange={(e) => setSystemSettings({ ...systemSettings, apiRateLimit: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="500">500 requests/hour</option>
                      <option value="1000">1000 requests/hour</option>
                      <option value="2000">2000 requests/hour</option>
                      <option value="5000">5000 requests/hour</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={systemSettings.backupEnabled}
                      onChange={(e) => setSystemSettings({ ...systemSettings, backupEnabled: e.target.checked })}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 text-sm text-gray-700">Enable Automatic Backups</span>
                  </label>
                </div>

                <div className="flex justify-end">
                  <button
                    disabled={isLoading}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save System Settings
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Data Management */}
          {activeTab === 'data' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Data Management</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-md font-medium text-gray-900 mb-3">Export Data</h3>
                    <p className="text-sm text-gray-600 mb-4">Download your data in various formats</p>
                    <div className="space-y-2">
                      <button
                        onClick={handleExportData}
                        disabled={isLoading}
                        className="w-full bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center disabled:opacity-50"
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Exporting...
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4 mr-2" />
                            Export Data
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-md font-medium text-gray-900 mb-3">Import Data</h3>
                    <p className="text-sm text-gray-600 mb-4">Import data from backup files</p>
                    <div className="space-y-2">
                      <button
                        onClick={handleImportData}
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50"
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Importing...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Import Data
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-md font-medium text-gray-900 mb-3">Clear Data</h3>
                    <p className="text-sm text-gray-600 mb-4">Remove all data from the system</p>
                    <div className="space-y-2">
                      <button
                        onClick={handleClearData}
                        disabled={isLoading}
                        className="w-full bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center justify-center disabled:opacity-50"
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Clearing...
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Clear All Data
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-md font-medium text-gray-900 mb-4">Storage Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">Total Storage Used</p>
                      <p className="text-2xl font-bold text-gray-900">245 MB</p>
                      <p className="text-xs text-gray-500 mt-1">of 1 GB available</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">Last Backup</p>
                      <p className="text-2xl font-bold text-gray-900">2 days ago</p>
                      <p className="text-xs text-gray-500 mt-1">Automatic backup enabled</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
