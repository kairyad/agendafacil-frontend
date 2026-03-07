'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Video, X, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import api from '@/lib/api'
import { toast } from 'sonner'
import { Textarea } from '@/components/ui/textarea'

export default function ReunioesPage() {
    const [appointments, setAppointments] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')
    const [cancelModal, setCancelModal] = useState<string | null>(null)
    const [cancelReason, setCancelReason] = useState('')

    const fetchAppointments = async () => {
        try {
            setLoading(true)
            const res = await api.get('/api/appointments')
            setAppointments(res.data.data.appointments)
        } catch (e) {
            toast.error('Erro ao buscar reuniões')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchAppointments() }, [])

    const handleCancel = async () => {
        if (!cancelModal) return
        try {
            await api.post(`/api/appointments/${cancelModal}/cancel`, { reason: cancelReason })
            toast.success('Reunião cancelada e email enviado!')
            setCancelModal(null)
            setCancelReason('')
            fetchAppointments()
        } catch (e) {
            toast.error('Ocorreu um erro ao cancelar')
        }
    }

    const filteredAppointments = appointments.filter(app => filter === 'all' ? true : app.status === filter)

    const filters = [
        { key: 'all', label: 'Todas' },
        { key: 'scheduled', label: 'Próximas' },
        { key: 'completed', label: 'Concluídas' },
        { key: 'cancelled', label: 'Canceladas' },
    ]

    const statusStyles: Record<string, string> = {
        scheduled: 'bg-blue-500/[0.08] text-blue-400 border-blue-500/20',
        completed: 'bg-emerald-400/[0.08] text-emerald-400 border-emerald-400/20',
        cancelled: 'bg-red-400/[0.08] text-red-400 border-red-400/20',
    }
    const statusLabels: Record<string, string> = {
        scheduled: 'Agendado', completed: 'Concluída', cancelled: 'Cancelada',
    }

    return (
        <div className="space-y-6">
            <div className="pb-6 border-b border-white/[0.06]">
                <h2 className="text-2xl font-semibold text-slate-50">Suas Reuniões</h2>
                <p className="text-[14px] text-slate-400 mt-1">Navegue pelas suas reuniões marcadas e veja o histórico</p>
            </div>

            <div className="flex gap-1 bg-[#0D1117] p-1 rounded-lg w-fit">
                {filters.map(f => (
                    <button key={f.key} onClick={() => setFilter(f.key)}
                        className={`px-4 py-2 text-[13px] font-medium rounded-md transition-colors duration-150 ${filter === f.key
                                ? 'bg-[#1C2333] text-slate-50 border border-white/[0.12]'
                                : 'text-slate-600 hover:text-slate-400 hover:bg-white/[0.03] border border-transparent'
                            }`}>
                        {f.label}
                    </button>
                ))}
            </div>

            <div className="grid gap-3 max-w-4xl">
                {loading ? (
                    [1, 2, 3].map(i => <div key={i} className="h-36 skeleton-dark rounded-2xl" />)
                ) : filteredAppointments.length === 0 ? (
                    <div className="py-16 text-center dark-card">
                        <Calendar className="w-16 h-16 text-slate-700 mx-auto mb-4" strokeWidth={1} />
                        <h3 className="text-[15px] font-semibold text-slate-50">Nenhuma reunião encontrada</h3>
                        <p className="text-[13px] text-slate-400 mt-1 max-w-[320px] mx-auto">Quando seus clientes agendarem, as reuniões aparecerão aqui.</p>
                    </div>
                ) : (
                    filteredAppointments.map((app) => (
                        <div key={app.id} className="dark-card glow-border p-5">
                            <div className="flex flex-col md:flex-row items-start justify-between gap-4 border-b border-white/[0.06] pb-4 mb-4">
                                <div className="flex gap-3">
                                    <div className="bg-blue-500/[0.08] text-blue-500 w-12 h-12 rounded-xl flex flex-col justify-center items-center flex-shrink-0">
                                        <span className="text-[15px] font-bold leading-tight">{format(new Date(app.startTime), 'dd')}</span>
                                        <span className="text-[9px] font-semibold uppercase text-slate-600">{format(new Date(app.startTime), 'MMM', { locale: ptBR })}</span>
                                    </div>
                                    <div>
                                        <p className="text-lg font-bold text-slate-50 flex items-center gap-2">
                                            {format(new Date(app.startTime), 'HH:mm')}
                                            <span className="text-[13px] text-slate-600 font-medium">às {format(new Date(app.endTime), 'HH:mm')}</span>
                                        </p>
                                        <h4 className="text-[14px] font-medium text-slate-400 mt-0.5">{app.title}</h4>
                                    </div>
                                </div>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${statusStyles[app.status] || statusStyles.scheduled}`}>
                                    {statusLabels[app.status] || app.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="label-uppercase mb-1.5">Participante</p>
                                    <p className="text-[14px] font-medium text-slate-50">{app.attendeeName}</p>
                                    <p className="text-[13px] text-slate-600">{app.attendeeEmail}</p>
                                </div>
                                <div className="flex flex-col gap-2 justify-end">
                                    {app.meetLink && app.status === 'scheduled' && (
                                        <Button onClick={() => window.open(app.meetLink, '_blank')} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-[13px]">
                                            <Video className="w-4 h-4 mr-2" /> Entrar no Google Meet
                                        </Button>
                                    )}
                                    {app.status === 'scheduled' && (
                                        <Button variant="outline" onClick={() => setCancelModal(app.id)} className="w-full sm:w-auto bg-transparent border-white/[0.06] text-red-400 hover:bg-red-500/10 hover:border-red-400/20 text-[13px]">
                                            <X className="w-4 h-4 mr-2" /> Cancelar
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {cancelModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-[#111827] border border-white/[0.06] rounded-2xl overflow-hidden fade-in shadow-2xl shadow-black/40">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                            <h3 className="text-[15px] font-semibold text-slate-50">Cancelar Agendamento</h3>
                            <button onClick={() => setCancelModal(null)} className="p-1.5 rounded-lg text-slate-600 hover:text-slate-200 hover:bg-white/[0.03] transition-colors duration-150">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="px-6 py-5">
                            <p className="text-[13px] text-slate-400 mb-4 text-center">O cliente e você receberão um email, e o evento será excluído do Google Calendar.</p>
                            <div className="space-y-1.5">
                                <label className="text-[13px] font-medium text-slate-400">Motivo (enviado ao cliente)</label>
                                <Textarea value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} placeholder="Ex: Tive um imprevisto"
                                    className="bg-[#0D1117] border-white/[0.06] text-slate-50 placeholder:text-slate-600 focus:border-blue-500/60 text-[14px] resize-none" rows={3} />
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-white/[0.06]">
                            <Button variant="ghost" onClick={() => setCancelModal(null)} className="text-[13px] text-slate-600 hover:text-slate-200 hover:bg-white/[0.03]">Voltar</Button>
                            <Button onClick={handleCancel} className="bg-red-500 hover:bg-red-600 text-white text-[13px]">Confirmar</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
