'use client'

import { useState, useEffect } from 'react'
import { EventTypeCard } from '@/components/dashboard/EventTypeCard'
import { Button } from '@/components/ui/button'
import { Plus, Calendar, X } from 'lucide-react'
import api from '@/lib/api'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function AgendamentoPage() {
    const [eventTypes, setEventTypes] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingEvent, setEditingEvent] = useState<any>(null)
    const [formData, setFormData] = useState({
        name: '', slug: '', description: '', durationMinutes: 30
    })

    const fetchEvents = async () => {
        try {
            setLoading(true)
            const res = await api.get('/api/event-types')
            setEventTypes(res.data.data)
        } catch (e) {
            toast.error('Erro ao carregar tipos de evento')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchEvents() }, [])

    const handleOpenModal = (event: any = null) => {
        if (event) {
            setEditingEvent(event)
            setFormData({
                name: event.name, slug: event.slug,
                description: event.description || '',
                durationMinutes: event.durationMinutes || event.duration_minutes || 30
            })
        } else {
            setEditingEvent(null)
            setFormData({ name: '', slug: '', description: '', durationMinutes: 30 })
        }
        setIsModalOpen(true)
    }

    const handleSave = async () => {
        try {
            if (editingEvent) {
                await api.put(`/api/event-types/${editingEvent.id}`, formData)
                toast.success('Evento atualizado!')
            } else {
                await api.post('/api/event-types', formData)
                toast.success('Evento criado!')
            }
            setIsModalOpen(false)
            fetchEvents()
        } catch (e: any) {
            toast.error(e.response?.data?.error?.message || 'Erro ao salvar evento')
        }
    }

    const handleDelete = async (id: string) => {
        if (confirm('Tem certeza que deseja excluir?')) {
            try {
                await api.delete(`/api/event-types/${id}`)
                toast.success('Evento excluído!')
                fetchEvents()
            } catch (e) {
                toast.error('Erro ao excluir')
            }
        }
    }

    const inputClass = "bg-[#0D1117] border-white/[0.06] text-slate-50 placeholder:text-slate-600 focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20 text-[14px]"

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between pb-6 border-b border-white/[0.06]">
                <div className="flex gap-1 bg-[#0D1117] p-1 rounded-lg">
                    <button className="px-4 py-2 text-[13px] font-medium rounded-md bg-[#1C2333] text-slate-50 border border-white/[0.12] transition-colors duration-150">
                        Tipos de evento
                    </button>
                    <button className="px-4 py-2 text-[13px] font-medium rounded-md text-slate-600 hover:text-slate-400 hover:bg-white/[0.03] transition-colors duration-150">
                        Links de uso único
                    </button>
                </div>
                <Button onClick={() => handleOpenModal()} className="bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold hover:shadow-[0_0_16px_rgba(37,99,235,0.15)] transition-all duration-150">
                    <Plus className="w-4 h-4 mr-1.5" /> Criar
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {loading ? (
                    [1, 2].map(i => <div key={i} className="h-44 skeleton-dark rounded-2xl" />)
                ) : eventTypes.length === 0 ? (
                    <div className="col-span-2 py-16 text-center dark-card">
                        <Calendar className="w-16 h-16 text-slate-700 mx-auto mb-4" strokeWidth={1} />
                        <h3 className="text-[15px] font-semibold text-slate-50">Nenhum evento criado</h3>
                        <p className="text-[13px] text-slate-400 mt-1.5 max-w-[320px] mx-auto">Crie seu primeiro tipo de evento e comece a receber agendamentos.</p>
                        <Button onClick={() => handleOpenModal()} className="mt-6 bg-blue-600 hover:bg-blue-700 text-white text-[13px]">
                            <Plus className="w-4 h-4 mr-1.5" /> Criar Primeiro Evento
                        </Button>
                    </div>
                ) : (
                    eventTypes.map(et => <EventTypeCard key={et.id} eventType={et} onEdit={handleOpenModal} onDelete={handleDelete} />)
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-[#111827] border border-white/[0.06] rounded-2xl overflow-hidden fade-in shadow-2xl shadow-black/40">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                            <h3 className="text-[15px] font-semibold text-slate-50">{editingEvent ? 'Editar' : 'Criar'} Tipo de Evento</h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-lg text-slate-600 hover:text-slate-200 hover:bg-white/[0.03] transition-colors duration-150">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="px-6 py-5 space-y-4">
                            <div className="space-y-1.5">
                                <Label className="text-[13px] text-slate-400 font-medium">Nome do evento</Label>
                                <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Ex: Consultoria 30 min" className={inputClass} />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[13px] text-slate-400 font-medium">URL Slug</Label>
                                <Input value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[\s_]+/g, '-') })} placeholder="consultoria-30-min" className={inputClass} />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[13px] text-slate-400 font-medium">Duração (minutos)</Label>
                                <Input type="number" value={formData.durationMinutes} onChange={e => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) })} className={inputClass} />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[13px] text-slate-400 font-medium">Descrição</Label>
                                <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Detalhes opcionais do evento" className={`${inputClass} resize-none`} rows={3} />
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-white/[0.06]">
                            <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="text-[13px] text-slate-600 hover:text-slate-200 hover:bg-white/[0.03]">Cancelar</Button>
                            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold">Salvar</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
