import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }: { children: React.ReactNode }) {
    const { user, setToken } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        setToken(null);
        navigate('/logout');
    };

    const linkComponent = (to: string, label: string) => (
        <Link
            to={to}
            className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
        >
            {label}
        </Link>
    );

    return <div className="min-h-screen bg-gray-900">
        <nav className="bg-gray-800 border-b border-gray-700">
            <div className="max-w-6xl mx-auto px-4 flex justify-between items-center h-16">
                <div className="flex space-x-8">
                    {linkComponent("/", "Feed")}
                    {user ? <>
                        {linkComponent("/profile", "Profile")}
                        <button
                            onClick={handleLogout}
                            className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            Logout
                        </button>
                    </> : <>
                        {linkComponent("/login", "Login")}
                        {linkComponent("/register", "Register")}
                    </>}
                </div>
                {user && (
                    <div className="text-gray-300 text-sm">
                        Welcome, @{user.username}
                    </div>
                )}
            </div>
        </nav>
        <main>
            {children}
        </main>
    </div>
}
