import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Building, Globe, Bell, Moon, Sun, Shield, Key, LogOut } from 'lucide-react';
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/contexts/auth-context";
import { ProfileAvatar } from '@/components/ProfileAvatar';

const SettingPage = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { theme, setTheme } = useTheme();
    const [emailNotifications, setEmailNotifications] = useState({
        orderUpdates: true,
        newFeatures: false,
        marketingEmails: false,
        securityAlerts: true
    });

    const [profile] = useState({
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        company: 'Acme Corporation',
        role: 'Administrator',
        location: 'New York, USA',
        timezone: 'Eastern Time (ET)',
        language: 'English'
    });

    const handleNotificationChange = (key) => {
        setEmailNotifications(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="container mx-auto space-y-6 py-6">
            <h1 className="title">Settings</h1>

            {/* Profile Information */}
            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">Profile Information</h2>
                </div>
                <div className="card-body space-y-6">
                    <div className="flex items-center gap-x-4">
                        <ProfileAvatar 
                            name={profile.name}
                            size="lg"
                        />
                        <div>
                            <h3 className="text-xl font-medium text-slate-900 dark:text-slate-50">{profile.name}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{profile.role}</p>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="form-group">
                            <label>Full Name</label>
                            <div className="flex items-center gap-x-2 rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
                                <User size={20} className="text-slate-400" />
                                <input
                                    type="text"
                                    value={profile.name}
                                    className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 dark:text-slate-50"
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <div className="flex items-center gap-x-2 rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
                                <Mail size={20} className="text-slate-400" />
                                <input
                                    type="email"
                                    value={profile.email}
                                    className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 dark:text-slate-50"
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Phone Number</label>
                            <div className="flex items-center gap-x-2 rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
                                <Phone size={20} className="text-slate-400" />
                                <input
                                    type="tel"
                                    value={profile.phone}
                                    className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 dark:text-slate-50"
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Company</label>
                            <div className="flex items-center gap-x-2 rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
                                <Building size={20} className="text-slate-400" />
                                <input
                                    type="text"
                                    value={profile.company}
                                    className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 dark:text-slate-50"
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Location</label>
                            <div className="flex items-center gap-x-2 rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
                                <Globe size={20} className="text-slate-400" />
                                <input
                                    type="text"
                                    value={profile.location}
                                    className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 dark:text-slate-50"
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Time Zone</label>
                            <div className="flex items-center gap-x-2 rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
                                <Globe size={20} className="text-slate-400" />
                                <input
                                    type="text"
                                    value={profile.timezone}
                                    className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 dark:text-slate-50"
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Preferences */}
            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">Preferences</h2>
                </div>
                <div className="card-body space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-x-3">
                            {theme === "dark" ? (
                                <Moon size={20} className="text-slate-400" />
                            ) : (
                                <Sun size={20} className="text-slate-400" />
                            )}
                            <div>
                                <p className="font-medium text-slate-900 dark:text-slate-50">Dark Mode</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {theme === "dark" ? 'Dark theme enabled' : 'Light theme enabled'}
                                </p>
                            </div>
                        </div>
                        <label className="relative inline-flex cursor-pointer items-center">
                            <input
                                type="checkbox"
                                checked={theme === "dark"}
                                onChange={() => setTheme(theme === "light" ? "dark" : "light")}
                                className="peer sr-only"
                            />
                            <div className="h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-red-500 peer-checked:after:translate-x-full dark:bg-slate-700"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Notifications */}
            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">Email Notifications</h2>
                </div>
                <div className="card-body space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-x-3">
                            <Bell size={20} className="text-slate-400" />
                            <div>
                                <p className="font-medium text-slate-900 dark:text-slate-50">Order Updates</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Receive notifications about your order status
                                </p>
                            </div>
                        </div>
                        <label className="relative inline-flex cursor-pointer items-center">
                            <input
                                type="checkbox"
                                checked={emailNotifications.orderUpdates}
                                onChange={() => handleNotificationChange('orderUpdates')}
                                className="peer sr-only"
                            />
                            <div className="h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-500 peer-checked:after:translate-x-full dark:bg-slate-700"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-x-3">
                            <Shield size={20} className="text-slate-400" />
                            <div>
                                <p className="font-medium text-slate-900 dark:text-slate-50">Security Alerts</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Get notified about security updates and unusual activity
                                </p>
                            </div>
                        </div>
                        <label className="relative inline-flex cursor-pointer items-center">
                            <input
                                type="checkbox"
                                checked={emailNotifications.securityAlerts}
                                onChange={() => handleNotificationChange('securityAlerts')}
                                className="peer sr-only"
                            />
                            <div className="h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-500 peer-checked:after:translate-x-full dark:bg-slate-700"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-x-3">
                            <Bell size={20} className="text-slate-400" />
                            <div>
                                <p className="font-medium text-slate-900 dark:text-slate-50">New Features</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Learn about new features and updates
                                </p>
                            </div>
                        </div>
                        <label className="relative inline-flex cursor-pointer items-center">
                            <input
                                type="checkbox"
                                checked={emailNotifications.newFeatures}
                                onChange={() => handleNotificationChange('newFeatures')}
                                className="peer sr-only"
                            />
                            <div className="h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-500 peer-checked:after:translate-x-full dark:bg-slate-700"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-x-3">
                            <Mail size={20} className="text-slate-400" />
                            <div>
                                <p className="font-medium text-slate-900 dark:text-slate-50">Marketing Emails</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Receive emails about new products, features and more
                                </p>
                            </div>
                        </div>
                        <label className="relative inline-flex cursor-pointer items-center">
                            <input
                                type="checkbox"
                                checked={emailNotifications.marketingEmails}
                                onChange={() => handleNotificationChange('marketingEmails')}
                                className="peer sr-only"
                            />
                            <div className="h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-500 peer-checked:after:translate-x-full dark:bg-slate-700"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Account Security */}
            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">Account Security</h2>
                </div>
                <div className="card-body space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-x-3">
                            <Key size={20} className="text-slate-400" />
                            <div>
                                <p className="font-medium text-slate-900 dark:text-slate-50">Change Password</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Update your password to keep your account secure
                                </p>
                            </div>
                        </div>
                        <button className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
                            Change
                        </button>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-x-3">
                            <LogOut size={20} className="text-blue-500" />
                            <div>
                                <p className="font-medium text-slate-900 dark:text-slate-50">Sign Out</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Sign out from your account on this device
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingPage; 