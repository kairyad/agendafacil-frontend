'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Calendar as CalendarIcon, LogOut, CheckCircle2, Copy, Check, ExternalLink, User } from 'lucide-react'
import api from '@/lib/api'
import { toast } from 'sonner'

export default function SettingsPage() {
    const { user } = useAuth()
    const [googleStatus, setGoogleStatus] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [copied, setCopied] = useState(false)

    const fetchStatus = async () => {
        try {
            const res = await api.get('/api/google/status')
            setGoogleStatus(res.data.data)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchStatus() }, [])

    const handleConnectGoogle = async () => {
        try {
            const res = await api.get('/api/google/auth/url')
            window.location.href = res.data.data.authUrl
        } catch (e) {
            toast.error('Erro ao gerar URL do Google')
        }
    }

    const handleDisconnectGoogle = async () => {
        try {
            await api.delete('/api/google/disconnect')
            toast.success('Google Agenda desconectado!')
            fetchStatus()
        } catch (e) {
            toast.error('Erro ao desconectar')
        }
    }

    const publicUrl = typeof window !== 'undefined' ? `${window.location.origin}/${user?.username}` : ''

    const copyUrl = () => {
        navigator.clipboard.writeText(publicUrl)
        setCopied(true)
        toast.success('Link copiado!')
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="pb-6 border-b border-white/[0.06]">
                <h2 className="text-2xl font-semibold text-slate-50">Configurações</h2>
                <p className="text-[14px] text-slate-400 mt-1">Gerencie seu perfil e integrações</p>
            </div>

            {/* Profile */}
            <div className="dark-card overflow-hidden">
                <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/[0.08] flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-500" strokeWidth={1.8} />
                    </div>
                    <div>
                        <h3 className="text-[14px] font-semibold text-slate-50">Perfil Público</h3>
                        <p className="text-[12px] text-slate-600">Dados do seu link de agendamentos.</p>
                    </div>
                </div>
                <div className="px-6 py-5 space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <p className="label-uppercase mb-1">Nome</p>
                            <p className="text-[15px] font-medium text-slate-50">{user?.name}</p>
                        </div>
                        <div>
                            <p className="label-uppercase mb-1">Username</p>
                            <p className="text-[15px] font-medium text-slate-50">/{user?.username}</p>
                        </div>
                    </div>

                    <div>
                        <p className="label-uppercase mb-2">Link de Agendamentos</p>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 bg-[#0D1117] border border-white/[0.06] px-4 py-2.5 rounded-lg font-mono text-[13px] text-slate-600 truncate">
                                {publicUrl}
                            </div>
                            <button onClick={copyUrl} className="flex items-center gap-1.5 px-3.5 py-2.5 text-[12px] font-medium rounded-lg border border-white/[0.06] text-slate-400 hover:border-white/[0.12] hover:text-slate-200 transition-all duration-150 active:scale-95">
                                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                {copied ? 'Copiado!' : 'Copiar'}
                            </button>
                            <a href={publicUrl} target="_blank" className="p-2.5 rounded-lg border border-white/[0.06] text-slate-600 hover:text-slate-200 hover:border-white/[0.12] transition-all duration-150">
                                <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Google */}
            <div className="dark-card overflow-hidden">
                <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/[0.08] flex items-center justify-center">
                        <CalendarIcon className="w-4 h-4 text-blue-500" strokeWidth={1.8} />
                    </div>
                    <div>
                        <h3 className="text-[14px] font-semibold text-slate-50">Google Agenda</h3>
                        <p className="text-[12px] text-slate-600">Sincronize compromissos automaticamente.</p>
                    </div>
                </div>
                <div className="px-6 py-5">
                    {loading ? (
                        <div className="h-16 skeleton-dark rounded-xl" />
                    ) : googleStatus?.connected ? (
                        <div className="bg-emerald-400/[0.08] border border-emerald-400/20 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full pulse-green" />
                                </div>
                                <div>
                                    <p className="text-[13px] font-semibold text-emerald-400 flex items-center gap-2">
                                        Conectado
                                        <span className="bg-emerald-400/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Ativo</span>
                                    </p>
                                    <p className="text-[12px] text-slate-600 mt-0.5">Sincronizando com ({googleStatus?.calendarId || 'primary'}).</p>
                                </div>
                            </div>
                            <Button variant="outline" className="bg-transparent border-red-400/20 text-red-400 hover:bg-red-400/10 text-[13px]" onClick={handleDisconnectGoogle}>
                                <LogOut className="w-3.5 h-3.5 mr-1.5" /> Desconectar
                            </Button>
                        </div>
                    ) : (
                        <div className="py-10 text-center">
                            <CalendarIcon className="w-16 h-16 text-slate-700 mx-auto mb-4" strokeWidth={1} />
                            <h4 className="text-[15px] font-semibold text-slate-50 mb-1.5">Sincronize Seu Google Calendar</h4>
                            <p className="text-[13px] text-slate-400 mb-6 max-w-[320px] mx-auto">Eventos dos seus clientes aparecem com link de videoconferência na sua conta.</p>
                            <Button onClick={handleConnectGoogle} className="bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold px-5">
                                Vincular Conta Google
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
