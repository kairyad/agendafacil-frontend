import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getCurrentUser, removeToken, saveToken } from '@/lib/auth'
import api from '@/lib/api'

interface User {
    id: string
    name: string
    email: string
    username: string
    avatar?: string
}

interface AuthState {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (token: string, user: User) => void
    logout: () => void
    fetchUser: () => Promise<void>
}

export const useAuth = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: true,
            login: (token, user) => {
                saveToken(token)
                // Set cookie for Next.js middleware
                document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Lax`
                set({ token, user, isAuthenticated: true, isLoading: false })
            },
            logout: () => {
                removeToken()
                document.cookie = 'token=';
                set({ token: null, user: null, isAuthenticated: false, isLoading: false })
            },
            fetchUser: async () => {
                try {
                    const user = await getCurrentUser()
                    if (user) {
                        set({ user, isAuthenticated: true, isLoading: false })
                    } else {
                        set({ user: null, isAuthenticated: false, isLoading: false })
                    }
                } catch (error) {
                    set({ user: null, isAuthenticated: false, isLoading: false })
                }
            }
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated }),
        }
    )
)
