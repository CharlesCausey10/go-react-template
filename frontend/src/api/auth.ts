// frontend/src/api/auth.ts
const BASE = "http://localhost:8080/api";

export async function register(email: string, username: string, password: string) {
    const res = await fetch(`${BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
    });
    if (!res.ok) throw new Error("Failed to register");
    return res.json();
}

export async function login(usernameOrEmail: string, password: string): Promise<string> {
    const res = await fetch(`${BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usernameOrEmail, password }),
    });
    if (!res.ok) throw new Error("Invalid credentials");
    const data = await res.json();
    return data.token;
}

export async function getMe(token: string) {
    const res = await fetch(`${BASE}/me`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Not authenticated");
    return res.json();
}
