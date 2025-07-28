import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Logout() {
    const { setToken } = useAuth();

    useEffect(() => {
        setToken(null);
    }, [setToken]);

    return (
        <div className="max-w-md mx-auto p-6 mt-20">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
                <h1 className="text-2xl font-bold text-white mb-4">You have been logged out</h1>
                
                <Link 
                    to="/"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
                >
                    Return to Feed
                </Link>
            </div>
        </div>
    );
}
