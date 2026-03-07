'use client'

import { useState } from 'react'
import { Header } from '@/components/dashboard/Header'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { useAuth } from '@/hooks/useAuth'
import { useEffect } from 'react'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { fetchUser, isLoading, user } = useAuth()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    useEffect(() => {
        fetchUser()
    }, [fetchUser])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#080C14]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-[13px] text-slate-600 font-medium">Carregando...</p>
                </div>
            </div>
        )
    }

    if (!user) {
        return null;
    }

    return (
        <div className="flex h-screen bg-[#080C14] overflow-hidden">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header onToggleSidebar={() => setSidebarOpen(true)} />
                <main className="flex-1 overflow-y-auto px-4 py-6 md:px-10 md:py-8">
                    <div className="max-w-7xl mx-auto fade-in">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
