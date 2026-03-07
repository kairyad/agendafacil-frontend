'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Calendar, Clock, Home, Settings, Users, X, Crown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Agendamento', href: '/agendamento', icon: Calendar },
    { name: 'Reuniões', href: '/reunioes', icon: Users },
    { name: 'Disponibilidade', href: '/disponibilidade', icon: Clock },
    { name: 'Configurações', href: '/configuracoes', icon: Settings },
]

interface SidebarProps {
    isOpen?: boolean
    onClose?: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname()
    const { user } = useAuth()

    const getInitials = (name: string) => name.slice(0, 2).toUpperCase()

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" onClick={onClose} />
            )}

            <aside
                className={cn(
                    'fixed md:static inset-y-0 left-0 z-50 w-[260px] flex flex-col h-full transition-transform duration-300 ease-in-out',
                    'md:translate-x-0',
                    isOpen ? 'translate-x-0' : '-translate-x-full',
                    'bg-[#0D1117] border-r border-white/[0.06]'
                )}
            >
                {/* Logo */}
                <div className="flex items-center justify-between h-14 px-5 border-b border-white/[0.06]">
                    <Link href="/dashboard" className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                            <Calendar className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-[15px] font-semibold text-slate-50 tracking-tight">Agenda Fácil</span>
                    </Link>
                    <button onClick={onClose} className="md:hidden p-1.5 rounded-md text-slate-600 hover:text-slate-300 hover:bg-white/[0.03] transition-colors duration-150">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={onClose}
                                className={cn(
                                    'group flex items-center gap-2.5 px-3 py-[9px] text-[13px] font-medium rounded-lg transition-colors duration-150',
                                    isActive
                                        ? 'bg-blue-600/[0.08] text-blue-500'
                                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                                )}
                            >
                                <item.icon
                                    className={cn(
                                        'h-[18px] w-[18px] flex-shrink-0 transition-colors duration-150',
                                        isActive ? 'text-blue-500' : 'text-slate-600 group-hover:text-slate-400'
                                    )}
                                    strokeWidth={1.8}
                                />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>

                {/* Compact PRO badge */}
                <div className="px-3 pb-2">
                    <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-[#1C2333] border border-white/[0.06]">
                        <div className="flex items-center gap-2">
                            <Crown className="w-3.5 h-3.5 text-amber-400" />
                            <span className="text-[12px] font-semibold text-slate-400">Plano Free</span>
                        </div>
                        <button className="text-[12px] font-semibold text-blue-500 hover:text-blue-400 transition-colors duration-150">
                            Upgrade
                        </button>
                    </div>
                </div>

                {/* User section */}
                <div className="px-3 py-3 border-t border-white/[0.06]">
                    <div className="flex items-center gap-2.5 px-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-600/[0.08] flex items-center justify-center text-blue-500 text-[11px] font-bold flex-shrink-0">
                            {user?.name ? getInitials(user.name) : 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-medium text-slate-200 truncate leading-tight">{user?.name}</p>
                            <p className="text-[11px] text-slate-600 truncate leading-tight">{user?.email}</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    )
}
