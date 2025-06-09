import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, LogIn, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

import logoLight from "@/assets/logo-light.svg";
import logoDark from "@/assets/logo-dark.svg";

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.username) {
            newErrors.username = "Username is required";
        } else if (formData.username.length < 3) {
            newErrors.username = "Username must be at least 3 characters";
        }
        
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            setIsLoading(true);
            try {
                // In a real app, you would make an API call here
                // For demo purposes, we'll simulate a successful login
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Log the user in
                login({
                    id: 1,
                    username: formData.username,
                    // Add other user data as needed
                });

                // Navigate to the page they tried to visit or home
                const from = location.state?.from?.pathname || "/";
                navigate(from, { replace: true });
            } catch (error) {
                console.error('Login failed:', error);
                setErrors({
                    submit: "Login failed. Please try again."
                });
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
            {/* Left side - Login Form */}
            <div className="flex w-full items-center justify-center px-4 md:w-1/2">
                <div className="w-full max-w-md space-y-8">
                    <div className="flex flex-col items-center">
                        <img
                            src={logoLight}
                            alt="Dashboard Pro"
                            className="h-12 dark:hidden"
                        />
                        <img
                            src={logoDark}
                            alt="Dashboard Pro"
                            className="hidden h-12 dark:block"
                        />
                        <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                            Welcome back
                        </h1>
                        <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
                            Please sign in to your account to continue
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {errors.submit && (
                            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-500 dark:bg-red-900/50 dark:text-red-400">
                                {errors.submit}
                            </div>
                        )}
                        
                        <div className="group">
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium text-slate-700 transition-colors group-focus-within:text-blue-500 dark:text-slate-200 dark:group-focus-within:text-blue-400"
                            >
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 dark:bg-slate-800 dark:text-slate-50 ${
                                    errors.username
                                        ? "border-red-300 focus:border-red-400 focus:ring-red-400"
                                        : "border-slate-300 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700"
                                }`}
                                placeholder="Enter your username"
                                autoComplete="username"
                            />
                            {errors.username && (
                                <p className="mt-1 text-sm text-red-500">{errors.username}</p>
                            )}
                        </div>

                        <div className="group">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-slate-700 transition-colors group-focus-within:text-blue-500 dark:text-slate-200 dark:group-focus-within:text-blue-400"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 dark:bg-slate-800 dark:text-slate-50 ${
                                        errors.password
                                            ? "border-red-300 focus:border-red-400 focus:ring-red-400"
                                            : "border-slate-300 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700"
                                    }`}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-300"
                                >
                                    {showPassword ? (
                                        <EyeOff size={16} />
                                    ) : (
                                        <Eye size={16} />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    className="h-4 w-4 rounded border-slate-300 text-blue-500 transition-colors focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800"
                                />
                                <label
                                    htmlFor="remember"
                                    className="ml-2 block text-sm text-slate-700 dark:text-slate-200"
                                >
                                    Remember me
                                </label>
                            </div>
                            <a
                                href="#"
                                className="text-sm text-blue-500 transition-colors hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                                Forgot password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-blue-600 dark:hover:bg-blue-700"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    <LogIn size={16} />
                                    Sign In
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {/* Right side - Decorative */}
            <div className="hidden bg-gradient-to-br from-blue-500 to-blue-600 md:block md:w-1/2">
                <div className="flex h-full flex-col items-center justify-center p-12 text-white">
                    <div className="space-y-6 text-center">
                        <h2 className="text-3xl font-bold">
                            Welcome to Dashboard Pro
                        </h2>
                        <p className="text-lg text-blue-50">
                            Manage your business with our powerful dashboard
                        </p>
                        {/* Feature cards */}
                        <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
                            <div className="rounded-lg bg-white/10 p-4 backdrop-blur-lg">
                                <p className="font-medium">Real-time Analytics</p>
                                <p className="mt-1 text-blue-50">
                                    Track your business metrics in real-time
                                </p>
                            </div>
                            <div className="rounded-lg bg-white/10 p-4 backdrop-blur-lg">
                                <p className="font-medium">Order Management</p>
                                <p className="mt-1 text-blue-50">
                                    Efficiently manage and track orders
                                </p>
                            </div>
                            <div className="rounded-lg bg-white/10 p-4 backdrop-blur-lg">
                                <p className="font-medium">User-friendly Interface</p>
                                <p className="mt-1 text-blue-50">
                                    Easy to use and navigate
                                </p>
                            </div>
                            <div className="rounded-lg bg-white/10 p-4 backdrop-blur-lg">
                                <p className="font-medium">Secure Platform</p>
                                <p className="mt-1 text-blue-50">
                                    Enterprise-grade security
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage; 