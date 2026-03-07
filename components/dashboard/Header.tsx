'use client'

import { useAuth } from '@/hooks/useAuth'
import { Bell, Menu, LogOut, Plus } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuGroup,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation'

interface HeaderProps {
    onToggleSidebar?: () => void
}

export function Header({ onToggleSidebar }: HeaderProps) {
    const { user, logout } = useAuth()
    const router = useRouter()

    const handleLogout = () => {
        logout()
        router.push('/login')
    }

    const getInitials = (name: string) => name.slice(0, 2).toUpperCase()

    return (
        <header className="h-14 glass border-b border-white/[0.06] flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
            {/* Left */}
            <div className="flex items-center gap-3">
                <button onClick={onToggleSidebar} className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-200 hover:bg-white/[0.03] transition-colors duration-150">
                    <Menu className="h-5 w-5" strokeWidth={1.8} />
                </button>
                <span className="hidden md:block text-[14px] font-medium text-slate-400">
                    Olá, {user?.name?.split(' ')[0]} 👋
                </span>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => router.push('/agendamento')}
                    className="flex items-center gap-1.5 px-3.5 py-[7px] text-[13px] font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-150 hover:shadow-[0_0_16px_rgba(37,99,235,0.15)]"
                >
                    <Plus className="w-4 h-4" strokeWidth={2} />
                    <span className="hidden sm:inline">Criar</span>
                </button>

                <button className="relative p-2 rounded-lg text-slate-600 hover:text-slate-200 hover:bg-white/[0.03] transition-colors duration-150">
                    <Bell className="h-[18px] w-[18px]" strokeWidth={1.8} />
                </button>

                <DropdownMenu>
                    <DropdownMenuTrigger className="focus:outline-none ml-1">
                        <div className="w-8 h-8 rounded-lg bg-blue-600/[0.08] flex items-center justify-center text-blue-500 text-[11px] font-bold cursor-pointer hover:bg-blue-600/[0.15] transition-colors duration-150">
                            {user?.name ? getInitials(user.name) : 'U'}
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-[#111827] border-white/[0.06]">
                        <DropdownMenuGroup>
                            <DropdownMenuLabel>
                                <div className="flex flex-col space-y-0.5">
                                    <p className="text-[13px] font-medium text-slate-50">{user?.name}</p>
                                    <p className="text-[11px] text-slate-600">{user?.email}</p>
                                </div>
                            </DropdownMenuLabel>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator className="bg-white/[0.06]" />
                        <DropdownMenuItem onClick={() => router.push('/configuracoes')} className="text-[13px] text-slate-400 hover:text-slate-200 cursor-pointer focus:bg-white/[0.03]">
                            Configurações
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/${user?.username}`)} className="text-[13px] text-slate-400 hover:text-slate-200 cursor-pointer focus:bg-white/[0.03]">
                            Página pública
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/[0.06]" />
                        <DropdownMenuItem className="text-[13px] text-red-400 focus:bg-red-500/10 cursor-pointer" onClick={handleLogout}>
                            <LogOut className="mr-2 h-3.5 w-3.5" />
                            Sair
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
