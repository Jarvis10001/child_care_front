import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../../services/axiosConfig';

const Settings = () => {
  const navigate = useNavigate();
  
  // User profile state
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    language: 'english'
  });
  
  // Settings state
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      sms: true,
      app: true
    },
    privacy: {
      shareData: false,
      locationServices: false
    },
    appearance: {
      darkMode: false,
      fontSize: 'medium'
    }
  });
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // New state for additional settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    sessionTimeout: '30',
    lastPasswordChange: null,
    loginNotifications: true
  });

  const [childSync, setChildSync] = useState({
    autoSync: true,
    syncFrequency: 'daily',
    lastSync: null,
    syncWith: ['doctor', 'school']
  });

  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', relation: '', phone: '' });

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        // In a real app, fetch from API
        const userData = JSON.parse(localStorage.getItem('user')) || {};
        setProfile({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          language: userData.language || 'english'
        });
        
        // Simulate API delay
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Failed to load settings:', error);
        toast.error('Failed to load settings');
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, []);
  
  // Handle profile form changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle settings toggle
  const handleSettingChange = (category, setting) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting]
      }
    }));
  };
  
  // Handle dropdown changes
  const handleSelectChange = (category, field, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };
  
  // Save settings
  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // In a real app, send to API
      // await api.post('/settings', { profile, settings });
      
      // Update local storage for demo
      const userData = JSON.parse(localStorage.getItem('user')) || {};
      localStorage.setItem('user', JSON.stringify({
        ...userData,
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        language: profile.language
      }));
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle account deletion
  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // In a real app, send API request
      toast.success('Account deletion request submitted');
    }
  };
  
  // Log out user
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  // Handle password change
  const handlePasswordChange = async () => {
    try {
      setIsSaving(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.success('Password change email sent');
    } catch (error) {
      toast.error('Failed to initiate password change');
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle 2FA
  const handleToggle2FA = async () => {
    try {
      setIsSaving(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600));
      setSecuritySettings(prev => ({
        ...prev,
        twoFactorEnabled: !prev.twoFactorEnabled
      }));
      toast.success(
        securitySettings.twoFactorEnabled 
          ? '2FA disabled successfully' 
          : '2FA enabled successfully'
      );
    } catch (error) {
      toast.error('Failed to update 2FA settings');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle emergency contact actions
  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone) {
      toast.error('Please fill in all required fields');
      return;
    }
    setEmergencyContacts(prev => [...prev, { ...newContact, id: Date.now() }]);
    setNewContact({ name: '', relation: '', phone: '' });
    setShowAddContact(false);
    toast.success('Emergency contact added');
  };

  const handleRemoveContact = (contactId) => {
    setEmergencyContacts(prev => prev.filter(contact => contact.id !== contactId));
    toast.success('Emergency contact removed');
  };

  // Export user data
  const handleExportData = async () => {
    try {
      setIsSaving(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = {
        profile,
        settings,
        childSync,
        emergencyContacts
      };

      const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `user_data_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Data exported successfully');
    } catch (error) {
      toast.error('Failed to export data');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div>Loading settings...</div>;
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center mb-2">
            <div className="bg-[#4CAF50]/10 p-4 rounded-full mr-4">
              <i className="ri-settings-4-line text-3xl text-[#4CAF50]"></i>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#333333]">Settings</h1>
              <p className="text-[#6C757D] mt-1">Manage your account preferences</p>
            </div>
          </div>
        </div>

        {/* Profile Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-semibold text-[#333333] mb-6">Profile Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/30 focus:border-[#4CAF50]"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/30 focus:border-[#4CAF50]"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={profile.phone}
                onChange={handleProfileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/30 focus:border-[#4CAF50]"
              />
            </div>

            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">Language</label>
              <select
                id="language"
                name="language"
                value={profile.language}
                onChange={handleProfileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/30 focus:border-[#4CAF50]"
              >
                <option value="english">English</option>
                <option value="hindi">Hindi</option>
                <option value="marathi">Marathi</option>
                <option value="tamil">Tamil</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-semibold text-[#333333] mb-6">Notifications</h2>
          <div className="space-y-4">
            {Object.entries(settings.notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100">
                <div>
                  <h3 className="font-medium text-gray-900">{key.charAt(0).toUpperCase() + key.slice(1)} Notifications</h3>
                  <p className="text-sm text-gray-500">Receive updates via {key}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() => handleSettingChange('notifications', key)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#4CAF50]/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4CAF50]"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-semibold text-[#333333] mb-6">Privacy</h2>
          <div className="space-y-4">
            {Object.entries(settings.privacy).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100">
                <div>
                  <h3 className="font-medium text-gray-900">
                    {key === 'shareData' ? 'Share Data with Healthcare Providers' : 'Enable Location Services'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {key === 'shareData' 
                      ? 'Allow sharing of relevant medical data with authorized healthcare providers'
                      : 'Enable location services for better local recommendations'}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() => handleSettingChange('privacy', key)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#4CAF50]/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4CAF50]"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Appearance Section */}
        {/* <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-semibold text-[#333333] mb-6">Appearance</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100">
              <div>
                <h3 className="font-medium text-gray-900">Dark Mode</h3>
                <p className="text-sm text-gray-500">Use dark theme for better visibility in low light</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.appearance.darkMode}
                  onChange={() => handleSettingChange('appearance', 'darkMode')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#4CAF50]/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4CAF50]"></div>
              </label>
            </div>

            <div className="p-4 rounded-lg bg-gray-50">
              <label className="block font-medium text-gray-900 mb-2">Font Size</label>
              <select
                value={settings.appearance.fontSize}
                onChange={(e) => handleSelectChange('appearance', 'fontSize', e.target.value)}
                className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/30 focus:border-[#4CAF50]"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>
        </div> */}

        {/* Security Settings Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-semibold text-[#333333] mb-6">Security Settings</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
              <div>
                <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
              </div>
              <button
                onClick={handleToggle2FA}
                disabled={isSaving}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  securitySettings.twoFactorEnabled
                    ? 'bg-[#4CAF50] text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {securitySettings.twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            <div className="p-4 rounded-lg bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-900">Password</h3>
                  <p className="text-sm text-gray-500">Change your account password</p>
                </div>
                <button
                  onClick={handlePasswordChange}
                  className="px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#45a049]"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Child Profile Sync Settings */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-semibold text-[#333333] mb-6">Child Profile Sync</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
              <div>
                <h3 className="font-medium text-gray-900">Automatic Sync</h3>
                <p className="text-sm text-gray-500">Keep child's profile updated with healthcare providers</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={childSync.autoSync}
                  onChange={() => setChildSync(prev => ({ ...prev, autoSync: !prev.autoSync }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4CAF50]"></div>
              </label>
            </div>

            <div className="p-4 rounded-lg bg-gray-50">
              <label className="block font-medium text-gray-900 mb-2">Sync Frequency</label>
              <select
                value={childSync.syncFrequency}
                onChange={(e) => setChildSync(prev => ({ ...prev, syncFrequency: e.target.value }))}
                className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#4CAF50]"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>
        </div>

        {/* Emergency Contacts Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-[#333333]">Emergency Contacts</h2>
            <button
              onClick={() => setShowAddContact(true)}
              className="px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#45a049]"
            >
              Add Contact
            </button>
          </div>

          {showAddContact && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Contact Name"
                  value={newContact.name}
                  onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#4CAF50]"
                />
                <input
                  type="text"
                  placeholder="Relation"
                  value={newContact.relation}
                  onChange={(e) => setNewContact(prev => ({ ...prev, relation: e.target.value }))}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#4CAF50]"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={newContact.phone}
                  onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#4CAF50]"
                />
              </div>
              <div className="flex justify-end mt-4 space-x-2">
                <button
                  onClick={() => setShowAddContact(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddContact}
                  className="px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#45a049]"
                >
                  Save Contact
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {emergencyContacts.map(contact => (
              <div key={contact.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                <div>
                  <h3 className="font-medium text-gray-900">{contact.name}</h3>
                  <p className="text-sm text-gray-500">
                    {contact.relation} • {contact.phone}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveContact(contact.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <i className="ri-delete-bin-line"></i>
                </button>
              </div>
            ))}
            
            {emergencyContacts.length === 0 && (
              <p className="text-center text-gray-500 py-4">No emergency contacts added</p>
            )}
          </div>
        </div>

        {/* Data Management Section */}
        {/* <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-semibold text-[#333333] mb-6">Data Management</h2>
          
          <div className="space-y-4">
            <button
              onClick={handleExportData}
              className="w-full md:w-auto px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center"
            >
              <i className="ri-download-2-line mr-2"></i>
              Export Your Data
            </button>
          </div>
        </div> */}

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="px-6 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#45a049] transition-colors disabled:opacity-50 flex items-center"
          >
            {isSaving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>

        {/* Account Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-semibold text-[#333333] mb-6">Account Actions</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
            >
              <i className="ri-logout-box-line mr-2"></i>
              Log Out
            </button>
            
            <button
              onClick={handleDeleteAccount}
              className="px-6 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center"
            >
              <i className="ri-delete-bin-line mr-2"></i>
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
