import { useState } from 'react';
import {
  User,
  Building2,
  Lock,
  Bell,
  CreditCard,
  Save,
  Camera,
  Mail,
  Phone,
  MapPin,
  Package
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

type SettingsTab = 'profile' | 'company' | 'security' | 'notifications' | 'billing' | 'rental';

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [isSaving, setIsSaving] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '+91 98765 43210',
    avatar: '',
  });

  const [companyData, setCompanyData] = useState({
    companyName: user?.companyName || '',
    businessCategory: user?.businessCategory || '',
    gstin: user?.gstin || '',
    address: '123 Business Park, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400001',
    country: 'India',
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notifications, setNotifications] = useState({
    emailOrders: true,
    emailReturns: true,
    emailPayments: true,
    emailPromotions: false,
    smsOrders: true,
    smsReturns: true,
  });

  const [rentalSettings, setRentalSettings] = useState({
    defaultPeriod: 'day',
    minRentalPeriod: 1,
    maxRentalPeriod: 30,
    securityDepositPercent: 20,
    lateFeePerDay: 100,
    autoConfirmOrders: false,
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert('Settings saved successfully!');
  };

  const tabs = [
    { id: 'profile' as SettingsTab, label: 'Profile', icon: <User size={18} /> },
    { id: 'company' as SettingsTab, label: 'Company', icon: <Building2 size={18} /> },
    { id: 'security' as SettingsTab, label: 'Security', icon: <Lock size={18} /> },
    { id: 'notifications' as SettingsTab, label: 'Notifications', icon: <Bell size={18} /> },
    ...(user?.role !== 'customer' ? [
      { id: 'rental' as SettingsTab, label: 'Rental Settings', icon: <Package size={18} /> },
    ] : []),
    { id: 'billing' as SettingsTab, label: 'Billing', icon: <CreditCard size={18} /> },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-primary-900">Settings</h1>
        <p className="text-primary-500">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${activeTab === tab.id
                      ? 'bg-primary-900 text-white'
                      : 'text-primary-600 hover:bg-primary-100 hover:text-primary-900'
                    }`}
                >
                  {tab.icon}
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-primary-900 mb-6">Profile Information</h2>

              {/* Avatar */}
              <div className="flex items-center gap-6 mb-6 pb-6 border-b border-primary-200">
                <div className="relative">
                  {user?.profilePhoto ? (
                    <img
                      src={`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${user.profilePhoto}`}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-primary-200 rounded-full flex items-center justify-center">
                      <span className="text-3xl font-bold text-primary-700">
                        {profileData.firstName.charAt(0)}
                      </span>
                    </div>
                  )}
                  <input
                    type="file"
                    id="profile-photo-input"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      const formData = new FormData();
                      formData.append('file', file);

                      try {
                        const token = localStorage.getItem('access_token');
                        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/auth/profile-photo`, {
                          method: 'POST',
                          headers: {
                            'Authorization': `Bearer ${token}`
                          },
                          body: formData
                        });

                        if (response.ok) {
                          window.location.reload(); // Refresh to show new photo
                        } else {
                          alert('Failed to upload photo');
                        }
                      } catch (err) {
                        alert('Failed to upload photo');
                      }
                    }}
                  />
                  <button
                    onClick={() => document.getElementById('profile-photo-input')?.click()}
                    className="absolute bottom-0 right-0 w-8 h-8 bg-primary-900 text-white rounded-full flex items-center justify-center hover:bg-primary-800 transition-colors"
                  >
                    <Camera size={16} />
                  </button>
                </div>
                <div>
                  <h3 className="font-medium text-primary-900">{profileData.firstName} {profileData.lastName}</h3>
                  <p className="text-sm text-primary-500 capitalize">{user?.role}</p>
                  <p className="text-xs text-primary-400 mt-1">Click camera icon to update photo</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="label">First Name</label>
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Last Name</label>
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Email Address</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" />
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="input pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="label">Phone Number</label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" />
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="input pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button onClick={handleSave} className="btn btn-primary" disabled={isSaving}>
                  <Save size={18} />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {/* Company Settings */}
          {activeTab === 'company' && (
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-primary-900 mb-6">Company Information</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="label">Company Name</label>
                  <input
                    type="text"
                    value={companyData.companyName}
                    onChange={(e) => setCompanyData({ ...companyData, companyName: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">GSTIN</label>
                  <input
                    type="text"
                    value={companyData.gstin}
                    onChange={(e) => setCompanyData({ ...companyData, gstin: e.target.value })}
                    className="input"
                    placeholder="29ABCDE1234F1Z5"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Address</label>
                  <div className="relative">
                    <MapPin size={18} className="absolute left-3 top-3 text-primary-400" />
                    <textarea
                      value={companyData.address}
                      onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
                      className="input pl-10 min-h-[80px]"
                      rows={2}
                    />
                  </div>
                </div>
                <div>
                  <label className="label">City</label>
                  <input
                    type="text"
                    value={companyData.city}
                    onChange={(e) => setCompanyData({ ...companyData, city: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">State</label>
                  <input
                    type="text"
                    value={companyData.state}
                    onChange={(e) => setCompanyData({ ...companyData, state: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Postal Code</label>
                  <input
                    type="text"
                    value={companyData.postalCode}
                    onChange={(e) => setCompanyData({ ...companyData, postalCode: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Country</label>
                  <input
                    type="text"
                    value={companyData.country}
                    onChange={(e) => setCompanyData({ ...companyData, country: e.target.value })}
                    className="input"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button onClick={handleSave} className="btn btn-primary" disabled={isSaving}>
                  <Save size={18} />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-primary-900 mb-6">Change Password</h2>

              <div className="max-w-md space-y-6">
                <div>
                  <label className="label">Current Password</label>
                  <input
                    type="password"
                    value={securityData.currentPassword}
                    onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                    className="input"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label className="label">New Password</label>
                  <input
                    type="password"
                    value={securityData.newPassword}
                    onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                    className="input"
                    placeholder="Enter new password"
                  />
                  <p className="text-xs text-primary-500 mt-1">
                    Must be at least 8 characters with uppercase, lowercase, and numbers
                  </p>
                </div>
                <div>
                  <label className="label">Confirm New Password</label>
                  <input
                    type="password"
                    value={securityData.confirmPassword}
                    onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                    className="input"
                    placeholder="Confirm new password"
                  />
                </div>

                <button onClick={handleSave} className="btn btn-primary" disabled={isSaving}>
                  <Lock size={18} />
                  {isSaving ? 'Updating...' : 'Update Password'}
                </button>
              </div>

              <div className="mt-8 pt-8 border-t border-primary-200">
                <h3 className="font-semibold text-primary-900 mb-4">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between p-4 bg-primary-50 rounded-xl">
                  <div>
                    <p className="font-medium text-primary-900">Enable 2FA</p>
                    <p className="text-sm text-primary-500">Add an extra layer of security to your account</p>
                  </div>
                  <button className="btn btn-secondary">Enable</button>
                </div>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-primary-900 mb-6">Notification Preferences</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-primary-900 mb-4">Email Notifications</h3>
                  <div className="space-y-3">
                    {[
                      { key: 'emailOrders', label: 'Order confirmations and updates' },
                      { key: 'emailReturns', label: 'Return reminders and notifications' },
                      { key: 'emailPayments', label: 'Payment receipts and invoices' },
                      { key: 'emailPromotions', label: 'Promotional offers and newsletters' },
                    ].map((item) => (
                      <label key={item.key} className="flex items-center justify-between p-3 bg-primary-50 rounded-lg cursor-pointer hover:bg-primary-100 transition-colors">
                        <span className="text-primary-700">{item.label}</span>
                        <input
                          type="checkbox"
                          checked={notifications[item.key as keyof typeof notifications]}
                          onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                          className="w-5 h-5 text-primary-900 rounded focus:ring-primary-500"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-primary-900 mb-4">SMS Notifications</h3>
                  <div className="space-y-3">
                    {[
                      { key: 'smsOrders', label: 'Order status updates via SMS' },
                      { key: 'smsReturns', label: 'Return deadline reminders' },
                    ].map((item) => (
                      <label key={item.key} className="flex items-center justify-between p-3 bg-primary-50 rounded-lg cursor-pointer hover:bg-primary-100 transition-colors">
                        <span className="text-primary-700">{item.label}</span>
                        <input
                          type="checkbox"
                          checked={notifications[item.key as keyof typeof notifications]}
                          onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                          className="w-5 h-5 text-primary-900 rounded focus:ring-primary-500"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button onClick={handleSave} className="btn btn-primary" disabled={isSaving}>
                  <Save size={18} />
                  {isSaving ? 'Saving...' : 'Save Preferences'}
                </button>
              </div>
            </div>
          )}

          {/* Rental Settings (Vendor/Admin) */}
          {activeTab === 'rental' && user?.role !== 'customer' && (
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-primary-900 mb-6">Rental Configuration</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="label">Default Rental Period</label>
                  <select
                    value={rentalSettings.defaultPeriod}
                    onChange={(e) => setRentalSettings({ ...rentalSettings, defaultPeriod: e.target.value })}
                    className="input"
                  >
                    <option value="hour">Hourly</option>
                    <option value="day">Daily</option>
                    <option value="week">Weekly</option>
                  </select>
                </div>
                <div>
                  <label className="label">Security Deposit (%)</label>
                  <input
                    type="number"
                    value={rentalSettings.securityDepositPercent}
                    onChange={(e) => setRentalSettings({ ...rentalSettings, securityDepositPercent: Number(e.target.value) })}
                    className="input"
                    min={0}
                    max={100}
                  />
                </div>
                <div>
                  <label className="label">Minimum Rental Period (days)</label>
                  <input
                    type="number"
                    value={rentalSettings.minRentalPeriod}
                    onChange={(e) => setRentalSettings({ ...rentalSettings, minRentalPeriod: Number(e.target.value) })}
                    className="input"
                    min={1}
                  />
                </div>
                <div>
                  <label className="label">Maximum Rental Period (days)</label>
                  <input
                    type="number"
                    value={rentalSettings.maxRentalPeriod}
                    onChange={(e) => setRentalSettings({ ...rentalSettings, maxRentalPeriod: Number(e.target.value) })}
                    className="input"
                    min={1}
                  />
                </div>
                <div>
                  <label className="label">Late Fee (per day)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-500">₹</span>
                    <input
                      type="number"
                      value={rentalSettings.lateFeePerDay}
                      onChange={(e) => setRentalSettings({ ...rentalSettings, lateFeePerDay: Number(e.target.value) })}
                      className="input pl-8"
                      min={0}
                    />
                  </div>
                </div>
                <div>
                  <label className="label">&nbsp;</label>
                  <label className="flex items-center gap-3 p-3 bg-primary-50 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rentalSettings.autoConfirmOrders}
                      onChange={(e) => setRentalSettings({ ...rentalSettings, autoConfirmOrders: e.target.checked })}
                      className="w-5 h-5 text-primary-900 rounded focus:ring-primary-500"
                    />
                    <span className="text-primary-700">Auto-confirm orders</span>
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button onClick={handleSave} className="btn btn-primary" disabled={isSaving}>
                  <Save size={18} />
                  {isSaving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </div>
          )}

          {/* Billing Settings */}
          {activeTab === 'billing' && (
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-primary-900 mb-6">Payment Methods</h2>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-4 border border-primary-200 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                      VISA
                    </div>
                    <div>
                      <p className="font-medium text-primary-900">•••• •••• •••• 4242</p>
                      <p className="text-sm text-primary-500">Expires 12/25</p>
                    </div>
                  </div>
                  <span className="badge badge-success">Default</span>
                </div>

                <button className="btn btn-secondary w-full">
                  <CreditCard size={18} />
                  Add Payment Method
                </button>
              </div>

              <div className="border-t border-primary-200 pt-6">
                <h3 className="font-semibold text-primary-900 mb-4">Billing History</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-primary-200">
                        <th className="text-left text-sm font-medium text-primary-600 py-3">Date</th>
                        <th className="text-left text-sm font-medium text-primary-600 py-3">Description</th>
                        <th className="text-right text-sm font-medium text-primary-600 py-3">Amount</th>
                        <th className="text-center text-sm font-medium text-primary-600 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-primary-100">
                      <tr>
                        <td className="py-3 text-primary-600">Jan 15, 2024</td>
                        <td className="py-3 text-primary-900">Platform subscription</td>
                        <td className="py-3 text-right font-medium text-primary-900">₹2,499</td>
                        <td className="py-3 text-center"><span className="badge badge-success">Paid</span></td>
                      </tr>
                      <tr>
                        <td className="py-3 text-primary-600">Dec 15, 2023</td>
                        <td className="py-3 text-primary-900">Platform subscription</td>
                        <td className="py-3 text-right font-medium text-primary-900">₹2,499</td>
                        <td className="py-3 text-center"><span className="badge badge-success">Paid</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
