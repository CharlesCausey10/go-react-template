// Use environment variable or fallback to development URL
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const routes = {
    posts: `${API_BASE}/posts`,
    post: (id: number) => `${API_BASE}/posts/${id}`,
    requestPasswordReset: `${API_BASE}/request-password-reset`,
    resetPassword: `${API_BASE}/reset-password`,
};