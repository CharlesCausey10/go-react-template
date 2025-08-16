import httpPost from "../util/httpPost";

const BASE = "http://localhost:8080/api";

export async function register(email: string, username: string, password: string) {
    const res = await httpPost(`${BASE}/register`, { email, username, password });
    if (!res.ok) {
        const errorText = await res.text().catch(() => "Failed to register");
        throw new Error(errorText || "Failed to register");
    }
    return res.json();
}

export async function login(usernameOrEmail: string, password: string): Promise<string> {
    const res = await httpPost(`${BASE}/login`, { usernameOrEmail, password });
    if (!res.ok) {
        const errorText = await res.text().catch(() => "Invalid credentials");
        throw new Error(errorText || "Invalid credentials");
    }
    const data = await res.json();
    return data.token;
}

export async function getMe(token: string) {
    const res = await fetch(`${BASE}/me`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok)  {
        const errorText = await res.text().catch(() => "Not authenticated");
        throw new Error(errorText || "Not authenticated");
    }
    return res.json();
}
