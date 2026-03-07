import api from './api';

export function saveToken(token: string) {
    if (typeof window !== 'undefined') {
        localStorage.setItem('token', token)
    }
}

export function getToken(): string | null {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token')
    }
    return null;
}

export function removeToken() {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
    }
}

export async function getCurrentUser() {
    const token = getToken()
    if (!token) return null

    try {
        const response = await api.get('/api/auth/me')
        return response.data.data
    } catch (error) {
        removeToken()
        return null
    }
}
