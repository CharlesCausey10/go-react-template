// frontend/src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { getMe } from "../api/auth";

type User = { id: number; email: string; username: string };

type AuthContextType = {
    user: User | null;
    token: string | null;
    setToken: (token: string | null) => void;
    loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadUser() {
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const user = await getMe(token);
                setUser(user);
            } catch {
                setToken(null);
                localStorage.removeItem("token");
            } finally {
                setLoading(false);
            }
        }
        loadUser();
    }, [token]);

    function updateToken(token: string | null) {
        setToken(token);
        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
            setUser(null); // Immediately clear user when token is removed
        }
    }

    return (
        <AuthContext.Provider value={{ user, token, setToken: updateToken, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
    return ctx;
}
