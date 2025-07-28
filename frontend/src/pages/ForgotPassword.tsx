import { useState } from "react";
import { Link } from "react-router-dom";
import { routes } from "../routes";

export function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        try {
            const response = await fetch(routes.requestPasswordReset, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (!response.ok) {
                throw new Error('Failed to send reset email');
            }

            setMessage("If an account with that email exists, we've sent you a password reset link.");
        } catch {
            setError("Failed to send reset email. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-md mx-auto p-6 mt-20">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
                <h2 className="text-3xl font-bold text-white text-center mb-8">Forgot Password</h2>

                <p className="text-gray-300 text-center mb-6">
                    Enter your email address and we'll send you a link to reset your password.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="Enter your email address"
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                            required
                        />
                    </div>

                    {error && (
                        <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-md">
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="bg-green-900 border border-green-700 text-green-200 px-4 py-3 rounded-md">
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-md transition-colors"
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>

                <div className="mt-6 text-center space-y-2">
                    <div>
                        <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
                            Back to login
                        </Link>
                    </div>
                    <div>
                        <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium">
                            Create an account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
