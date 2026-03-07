'use client'

import { useEffect, useState } from 'react'
import { Calendar, Users, Ban, TrendingUp, Clock, ArrowRight, CalendarPlus, Settings2 } from 'lucide-react'
import { StatsCard } from '@/components/dashboard/StatsCard'
import api from '@/lib/api'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface DashboardStats {
    totalAppointments: number
    upcomingAppointments: number
    cancellationRate: number
    topEventType: string | null
    recentAppointments: any[]
}

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/api/stats/dashboard')
                setStats(response.data.data)
            } catch (error) {
                console.error('Failed to fetch stats', error)
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    if (loading) {
        return <div className="space-y-8">
            <div className="h-7 w-40 skeleton-dark rounded" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-[140px] skeleton-dark rounded-2xl" />)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 h-64 skeleton-dark rounded-2xl" />
                <div className="h-64 skeleton-dark rounded-2xl" />
            </div>
        </div>
    }

    return (
        <div className="space-y-8">
            {/* Page header */}
            <div className="pb-6 border-b border-white/[0.06]">
                <h2 className="text-2xl font-semibold text-slate-50">Visão Geral</h2>
                <p className="text-[14px] text-slate-400 mt-1">Acompanhe seus agendamentos e métricas</p>
            </div>

            {/* Metric cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard title="Agendamentos" value={stats?.totalAppointments || 0} icon={Calendar} trend={12}
                    iconColor="text-blue-500" iconBg="bg-blue-500/[0.08]" />
                <StatsCard title="Próximas Reuniões" value={stats?.upcomingAppointments || 0} icon={Users}
                    iconColor="text-emerald-400" iconBg="bg-emerald-400/[0.08]" />
                <StatsCard title="Cancelamento" value={`${stats?.cancellationRate?.toFixed(1) || 0}%`} icon={Ban}
                    iconColor="text-red-400" iconBg="bg-red-400/[0.08]" />
                <StatsCard title="Mais Popular" value={stats?.topEventType || 'Nenhum'} icon={TrendingUp}
                    iconColor="text-violet-400" iconBg="bg-violet-400/[0.08]" />
            </div>

            {/* Content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Upcoming meetings */}
                <div className="lg:col-span-2 dark-card overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/[0.06] flex justify-between items-center">
                        <h3 className="text-[15px] font-semibold text-slate-50">Próximas Reuniões</h3>
                        <Link href="/reunioes" className="text-[13px] font-medium text-blue-500 hover:underline transition flex items-center gap-1">
                            Ver todas <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="divide-y divide-white/[0.06]">
                        {stats?.recentAppointments && stats.recentAppointments.length > 0 ? (
                            stats.recentAppointments.map(appointment => (
                                <div key={appointment.id} className="px-6 py-4 hover:bg-[#161D2E] transition-colors duration-150 flex items-center justify-between">
                                    <div className="flex items-start gap-3">
                                        <div className="bg-blue-500/[0.08] text-blue-500 rounded-xl px-2.5 py-2 text-center min-w-[48px]">
                                            <div className="text-[13px] font-bold leading-tight">{format(new Date(appointment.start_time), 'dd')}</div>
                                            <div className="text-[10px] uppercase font-semibold text-slate-600">{format(new Date(appointment.start_time), 'MMM', { locale: ptBR })}</div>
                                        </div>
                                        <div>
                                            <h4 className="text-[14px] font-medium text-slate-50">{appointment.title}</h4>
                                            <p className="text-[13px] text-slate-600 flex items-center gap-1.5 mt-0.5">
                                                <Clock className="w-3 h-3" />
                                                {format(new Date(appointment.start_time), 'HH:mm')} • {appointment.attendee_name}
                                            </p>
                                        </div>
                                    </div>
                                    {appointment.meet_link && (
                                        <Button variant="outline" size="sm" onClick={() => window.open(appointment.meet_link, '_blank')}
                                            className="bg-transparent border-white/[0.06] text-slate-400 hover:bg-white/[0.03] hover:text-slate-200 text-[13px]">
                                            Participar
                                        </Button>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="py-16 text-center">
                                <Calendar className="w-16 h-16 text-slate-700 mx-auto mb-4" strokeWidth={1} />
                                <p className="text-[15px] font-semibold text-slate-50">Nenhuma reunião próxima</p>
                                <p className="text-[13px] text-slate-400 mt-1 max-w-[320px] mx-auto">Suas reuniões agendadas aparecerão aqui.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick actions */}
                <div className="dark-card p-5">
                    <h3 className="text-[15px] font-semibold text-slate-50 mb-4">Ações Rápidas</h3>
                    <div className="space-y-2">
                        <Link href="/agendamento" className="group flex items-center gap-3 p-3.5 rounded-xl border border-white/[0.06] hover:border-white/[0.12] hover:bg-[#1C2333] transition-all duration-150">
                            <div className="w-9 h-9 rounded-lg bg-blue-500/[0.08] flex items-center justify-center flex-shrink-0">
                                <CalendarPlus className="w-[18px] h-[18px] text-blue-500" strokeWidth={1.8} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-[13px] font-medium text-slate-50">Criar Tipo de Evento</h4>
                                <p className="text-[12px] text-slate-600 mt-0.5">Configure um novo serviço.</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-700 group-hover:text-slate-400 group-hover:translate-x-1 transition-all duration-150" />
                        </Link>
                        <Link href="/disponibilidade" className="group flex items-center gap-3 p-3.5 rounded-xl border border-white/[0.06] hover:border-white/[0.12] hover:bg-[#1C2333] transition-all duration-150">
                            <div className="w-9 h-9 rounded-lg bg-emerald-400/[0.08] flex items-center justify-center flex-shrink-0">
                                <Settings2 className="w-[18px] h-[18px] text-emerald-400" strokeWidth={1.8} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-[13px] font-medium text-slate-50">Editar Disponibilidade</h4>
                                <p className="text-[12px] text-slate-600 mt-0.5">Atualize seus horários.</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-700 group-hover:text-slate-400 group-hover:translate-x-1 transition-all duration-150" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
