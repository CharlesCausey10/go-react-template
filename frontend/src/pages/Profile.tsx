// frontend/src/pages/Profile.tsx
import { useAuth } from "../context/AuthContext";

export function Profile() {
    const { user, loading } = useAuth();
    
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="text-lg text-gray-600">Loading...</div>
            </div>
        );
    }
    
    if (!user) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="text-lg text-gray-600">Not logged in</div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6 mt-8">
            <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-lg">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-blue-600">
                            {user.username.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome, {user.username}!
                    </h2>
                    <p className="text-gray-600">Manage your account information</p>
                </div>

                {/* Profile Information */}
                <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Details</h3>
                        <div className="grid gap-4">
                            <div className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0">
                                <span className="font-medium text-gray-700">Username</span>
                                <span className="text-gray-900">{user.username}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0">
                                <span className="font-medium text-gray-700">Email</span>
                                <span className="text-gray-900">{user.email}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
