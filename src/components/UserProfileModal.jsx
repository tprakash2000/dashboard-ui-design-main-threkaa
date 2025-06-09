import { X, LogOut } from "lucide-react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { ProfileAvatar } from "./ProfileAvatar";

export const UserProfileModal = ({ isOpen, onClose, userData }) => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    if (!isOpen) return null;

    const handleLogout = () => {
        logout();
        onClose();
        navigate("/login");
    };

    return (
        <div className="absolute right-0 top-[60px] z-50 w-[300px] rounded-lg border border-slate-200 bg-white p-4 shadow-lg dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Profile</h3>
                <button
                    onClick={onClose}
                    className="rounded-full p-1 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                    <X size={20} />
                </button>
            </div>
            <div className="mt-4 flex flex-col items-center">
                <ProfileAvatar 
                    name={userData.name}
                    size="lg"
                />
                <h4 className="mt-2 text-lg font-medium text-slate-900 dark:text-white">{userData.name}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">{userData.role}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{userData.email}</p>
                
                <div className="mt-6 w-full border-t border-slate-200 pt-4 dark:border-slate-700">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                    >
                        <LogOut size={16} />
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
};

UserProfileModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    userData: PropTypes.shape({
        name: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired
    }).isRequired
}; 