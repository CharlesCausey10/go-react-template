// frontend/src/pages/Profile.tsx
import { useAuth } from "../context/AuthContext";

export function Profile() {
    const { user, loading } = useAuth();
    if (loading) return <p>Loading...</p>;
    if (!user) return <p>Not logged in</p>;

    return (
        <div>
            <h2>Welcome, {user.username}!</h2>
            <p>Email: {user.email}</p>
        </div>
    );
}
