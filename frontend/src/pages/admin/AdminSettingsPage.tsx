import { useState } from 'react';
import {
  Settings,
  Globe,
  DollarSign,
  Mail,
  Bell,
  Shield,
  Palette,
  Database,
  Save,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SettingSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
}

const settingSections: SettingSection[] = [
  { id: 'general', title: 'General', icon: <Globe size={20} />, description: 'Basic platform settings' },
  { id: 'commission', title: 'Commission', icon: <DollarSign size={20} />, description: 'Vendor commission rates' },
  { id: 'email', title: 'Email', icon: <Mail size={20} />, description: 'Email notifications & templates' },
  { id: 'notifications', title: 'Notifications', icon: <Bell size={20} />, description: 'System notifications' },
  { id: 'security', title: 'Security', icon: <Shield size={20} />, description: 'Security & authentication' },
  { id: 'appearance', title: 'Appearance', icon: <Palette size={20} />, description: 'Branding & themes' },
  { id: 'maintenance', title: 'Maintenance', icon: <Database size={20} />, description: 'System maintenance' },
];

interface GeneralSettings {
  siteName: string;
  siteUrl: string;
  supportEmail: string;
  supportPhone: string;
  defaultCurrency: string;
  dateFormat: string;
  timezone: string;
  allowGuestCheckout: boolean;
  enableReviews: boolean;
  requireEmailVerification: boolean;
}

interface CommissionSettings {
  defaultCommission: number;
  categoryCommissions: { category: string; commission: number }[];
  minimumPayout: number;
  payoutFrequency: 'weekly' | 'biweekly' | 'monthly';
  payoutDay: string;
}

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    siteName: 'RentPe',
    siteUrl: 'https://rentpe.com',
    supportEmail: 'support@rentpe.com',
    supportPhone: '+91 98765 43210',
    defaultCurrency: 'INR',
    dateFormat: 'DD/MM/YYYY',
    timezone: 'Asia/Kolkata',
    allowGuestCheckout: false,
    enableReviews: true,
    requireEmailVerification: true,
  });

  const [commissionSettings, setCommissionSettings] = useState<CommissionSettings>({
    defaultCommission: 10,
    categoryCommissions: [
      { category: 'Construction Equipment', commission: 8 },
      { category: 'Event & Party', commission: 12 },
      { category: 'Electronics', commission: 15 },
      { category: 'Vehicles', commission: 10 },
    ],
    minimumPayout: 5000,
    payoutFrequency: 'monthly',
    payoutDay: '1',
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-primary-700 mb-1">Site Name</label>
          <input
            type="text"
            value={generalSettings.siteName}
            onChange={(e) => setGeneralSettings({ ...generalSettings, siteName: e.target.value })}
            className="w-full px-3 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary-700 mb-1">Site URL</label>
          <input
            type="url"
            value={generalSettings.siteUrl}
            onChange={(e) => setGeneralSettings({ ...generalSettings, siteUrl: e.target.value })}
            className="w-full px-3 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary-700 mb-1">Support Email</label>
          <input
            type="email"
            value={generalSettings.supportEmail}
            onChange={(e) => setGeneralSettings({ ...generalSettings, supportEmail: e.target.value })}
            className="w-full px-3 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary-700 mb-1">Support Phone</label>
          <input
            type="tel"
            value={generalSettings.supportPhone}
            onChange={(e) => setGeneralSettings({ ...generalSettings, supportPhone: e.target.value })}
            className="w-full px-3 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary-700 mb-1">Default Currency</label>
          <select
            value={generalSettings.defaultCurrency}
            onChange={(e) => setGeneralSettings({ ...generalSettings, defaultCurrency: e.target.value })}
            className="w-full px-3 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="INR">INR (₹)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-primary-700 mb-1">Date Format</label>
          <select
            value={generalSettings.dateFormat}
            onChange={(e) => setGeneralSettings({ ...generalSettings, dateFormat: e.target.value })}
            className="w-full px-3 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-primary-700 mb-1">Timezone</label>
          <select
            value={generalSettings.timezone}
            onChange={(e) => setGeneralSettings({ ...generalSettings, timezone: e.target.value })}
            className="w-full px-3 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
            <option value="America/New_York">America/New_York (EST)</option>
            <option value="Europe/London">Europe/London (GMT)</option>
            <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
          </select>
        </div>
      </div>

      <div className="border-t border-primary-200 pt-6">
        <h3 className="text-sm font-semibold text-primary-900 mb-4">Features</h3>
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={generalSettings.allowGuestCheckout}
              onChange={(e) => setGeneralSettings({ ...generalSettings, allowGuestCheckout: e.target.checked })}
              className="w-4 h-4 text-primary-600 border-primary-300 rounded focus:ring-primary-500"
            />
            <div>
              <span className="text-sm font-medium text-primary-700">Allow Guest Checkout</span>
              <p className="text-xs text-primary-500">Allow customers to checkout without creating an account</p>
            </div>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={generalSettings.enableReviews}
              onChange={(e) => setGeneralSettings({ ...generalSettings, enableReviews: e.target.checked })}
              className="w-4 h-4 text-primary-600 border-primary-300 rounded focus:ring-primary-500"
            />
            <div>
              <span className="text-sm font-medium text-primary-700">Enable Product Reviews</span>
              <p className="text-xs text-primary-500">Allow customers to leave reviews on products</p>
            </div>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={generalSettings.requireEmailVerification}
              onChange={(e) => setGeneralSettings({ ...generalSettings, requireEmailVerification: e.target.checked })}
              className="w-4 h-4 text-primary-600 border-primary-300 rounded focus:ring-primary-500"
            />
            <div>
              <span className="text-sm font-medium text-primary-700">Require Email Verification</span>
              <p className="text-xs text-primary-500">Users must verify their email before accessing the platform</p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderCommissionSettings = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
        <div>
          <p className="text-sm text-blue-800 font-medium">Commission Information</p>
          <p className="text-xs text-blue-700 mt-1">
            Commission is deducted from vendor sales. You can set a default rate and override it for specific categories.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-primary-700 mb-1">Default Commission Rate (%)</label>
          <div className="relative">
            <input
              type="number"
              min="0"
              max="100"
              value={commissionSettings.defaultCommission}
              onChange={(e) => setCommissionSettings({ ...commissionSettings, defaultCommission: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-400">%</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-primary-700 mb-1">Minimum Payout Amount</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400">₹</span>
            <input
              type="number"
              min="0"
              value={commissionSettings.minimumPayout}
              onChange={(e) => setCommissionSettings({ ...commissionSettings, minimumPayout: Number(e.target.value) })}
              className="w-full pl-7 pr-3 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-primary-700 mb-1">Payout Frequency</label>
          <select
            value={commissionSettings.payoutFrequency}
            onChange={(e) => setCommissionSettings({ ...commissionSettings, payoutFrequency: e.target.value as CommissionSettings['payoutFrequency'] })}
            className="w-full px-3 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="weekly">Weekly</option>
            <option value="biweekly">Bi-weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-primary-700 mb-1">Payout Day</label>
          <select
            value={commissionSettings.payoutDay}
            onChange={(e) => setCommissionSettings({ ...commissionSettings, payoutDay: e.target.value })}
            className="w-full px-3 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {commissionSettings.payoutFrequency === 'monthly' ? (
              Array.from({ length: 28 }, (_, i) => (
                <option key={i + 1} value={String(i + 1)}>
                  {i + 1}
                </option>
              ))
            ) : (
              ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      <div className="border-t border-primary-200 pt-6">
        <h3 className="text-sm font-semibold text-primary-900 mb-4">Category-wise Commission Rates</h3>
        <div className="space-y-3">
          {commissionSettings.categoryCommissions.map((item, index) => (
            <div key={index} className="flex items-center gap-4 p-3 bg-primary-50 rounded-lg">
              <span className="flex-1 text-sm text-primary-700">{item.category}</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={item.commission}
                  onChange={(e) => {
                    const updated = [...commissionSettings.categoryCommissions];
                    updated[index].commission = Number(e.target.value);
                    setCommissionSettings({ ...commissionSettings, categoryCommissions: updated });
                  }}
                  className="w-20 px-2 py-1 text-sm border border-primary-200 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <span className="text-sm text-primary-500">%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMaintenanceSettings = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="text-yellow-600 flex-shrink-0 mt-0.5" size={18} />
        <div>
          <p className="text-sm text-yellow-800 font-medium">Caution</p>
          <p className="text-xs text-yellow-700 mt-1">
            These actions can affect your platform's operation. Please use them carefully.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white border border-primary-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-sm font-medium text-primary-900">Clear Cache</h4>
              <p className="text-xs text-primary-500 mt-1">
                Clear all cached data. This may temporarily slow down the platform.
              </p>
            </div>
            <button className="px-4 py-2 text-sm border border-primary-200 text-primary-700 rounded-lg hover:bg-primary-50 transition-colors flex items-center gap-2">
              <RefreshCw size={16} />
              Clear Cache
            </button>
          </div>
        </div>

        <div className="bg-white border border-primary-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-sm font-medium text-primary-900">Reindex Search</h4>
              <p className="text-xs text-primary-500 mt-1">
                Rebuild the search index for products and categories.
              </p>
            </div>
            <button className="px-4 py-2 text-sm border border-primary-200 text-primary-700 rounded-lg hover:bg-primary-50 transition-colors flex items-center gap-2">
              <Database size={16} />
              Reindex
            </button>
          </div>
        </div>

        <div className="bg-white border border-primary-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-sm font-medium text-primary-900">Maintenance Mode</h4>
              <p className="text-xs text-primary-500 mt-1">
                Enable maintenance mode to prevent user access during updates.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-primary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-primary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>

        <div className="bg-white border border-red-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-sm font-medium text-red-900">Reset Platform Data</h4>
              <p className="text-xs text-red-600 mt-1">
                Warning: This will delete all data except admin accounts. This action cannot be undone.
              </p>
            </div>
            <button className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
              Reset Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'general':
        return renderGeneralSettings();
      case 'commission':
        return renderCommissionSettings();
      case 'maintenance':
        return renderMaintenanceSettings();
      default:
        return (
          <div className="text-center py-12">
            <Settings className="w-12 h-12 text-primary-300 mx-auto mb-3" />
            <p className="text-primary-500">Settings for {activeSection} coming soon</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary-900">Platform Settings</h1>
          <p className="text-primary-500 mt-1">Configure your platform settings and preferences</p>
        </div>
        {saveSuccess && (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg">
            <CheckCircle size={18} />
            <span className="text-sm font-medium">Settings saved successfully</span>
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl border border-primary-200 overflow-hidden">
            <nav className="divide-y divide-primary-100">
              {settingSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 p-4 text-left transition-colors ${
                    activeSection === section.id
                      ? 'bg-primary-50 border-l-4 border-primary-900'
                      : 'hover:bg-primary-50'
                  }`}
                >
                  <div className={`${activeSection === section.id ? 'text-primary-900' : 'text-primary-400'}`}>
                    {section.icon}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${activeSection === section.id ? 'text-primary-900' : 'text-primary-700'}`}>
                      {section.title}
                    </p>
                    <p className="text-xs text-primary-500">{section.description}</p>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          <div className="bg-white rounded-xl border border-primary-200">
            <div className="p-6 border-b border-primary-200">
              <h2 className="text-lg font-semibold text-primary-900">
                {settingSections.find((s) => s.id === activeSection)?.title} Settings
              </h2>
            </div>
            <div className="p-6">{renderSectionContent()}</div>
            <div className="p-6 border-t border-primary-200 flex justify-end">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2 bg-primary-900 text-white rounded-lg hover:bg-primary-800 transition-colors disabled:opacity-50"
              >
                {isSaving ? (
                  <RefreshCw className="animate-spin" size={18} />
                ) : (
                  <Save size={18} />
                )}
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
