'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import api from '@/lib/api'
import { toast } from 'sonner'

interface AvailabilityRule {
    dayOfWeek: number
    startTime: string
    endTime: string
    isAvailable: boolean
}

const daysOfWeek = [
    { value: 0, label: 'Domingo', short: 'Dom' },
    { value: 1, label: 'Segunda-feira', short: 'Seg' },
    { value: 2, label: 'Terça-feira', short: 'Ter' },
    { value: 3, label: 'Quarta-feira', short: 'Qua' },
    { value: 4, label: 'Quinta-feira', short: 'Qui' },
    { value: 5, label: 'Sexta-feira', short: 'Sex' },
    { value: 6, label: 'Sábado', short: 'Sáb' },
]

export function AvailabilityEditor() {
    const [rules, setRules] = useState<AvailabilityRule[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchRules = async () => {
            try {
                const res = await api.get('/api/availability')
                if (res.data.data.length > 0) {
                    setRules(res.data.data)
                } else {
                    setRules([
                        { dayOfWeek: 1, startTime: '09:00', endTime: '18:00', isAvailable: true },
                        { dayOfWeek: 2, startTime: '09:00', endTime: '18:00', isAvailable: true },
                        { dayOfWeek: 3, startTime: '09:00', endTime: '18:00', isAvailable: true },
                        { dayOfWeek: 4, startTime: '09:00', endTime: '18:00', isAvailable: true },
                        { dayOfWeek: 5, startTime: '09:00', endTime: '18:00', isAvailable: true },
                    ])
                }
            } catch (e) {
                toast.error('Erro ao carregar regras')
            } finally {
                setLoading(false)
            }
        }
        fetchRules()
    }, [])

    const addTimeSlot = (dayOfWeek: number) => {
        setRules([...rules, { dayOfWeek, startTime: '09:00', endTime: '17:00', isAvailable: true }])
    }

    const removeTimeSlot = (index: number) => {
        setRules(rules.filter((_, i) => i !== index))
    }

    const updateTimeSlot = (index: number, field: 'startTime' | 'endTime', value: string) => {
        const newRules = [...rules]
        newRules[index][field] = value
        setRules(newRules)
    }

    const handleSave = async () => {
        try {
            if (rules.length === 0) {
                toast.error('Você deve ter pelo menos um horário disponível')
                return
            }
            await api.post('/api/availability', { rules })
            toast.success('Disponibilidade atualizada!')
        } catch (e) {
            toast.error('Erro ao salvar')
        }
    }

    if (loading) {
        return (
            <div className="space-y-3 max-w-3xl">
                {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-14 skeleton-dark rounded-2xl" />)}
            </div>
        )
    }

    return (
        <div className="space-y-2 max-w-3xl">
            {daysOfWeek.map(day => {
                const dayRules = rules.filter(r => r.dayOfWeek === day.value)
                const isAvailable = dayRules.length > 0

                return (
                    <div key={day.value} className="dark-card glow-border overflow-hidden">
                        <div className="flex items-center gap-4 px-5 py-3.5">
                            <button
                                onClick={() => {
                                    if (isAvailable) {
                                        setRules(rules.filter(r => r.dayOfWeek !== day.value))
                                    } else {
                                        addTimeSlot(day.value)
                                    }
                                }}
                                className={`relative w-9 h-5 rounded-full transition-all duration-200 flex-shrink-0 ${isAvailable ? 'bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.15)]' : 'bg-[#1C2333]'
                                    }`}
                            >
                                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${isAvailable ? 'translate-x-[18px]' : 'translate-x-0.5'
                                    }`} />
                            </button>

                            <span className={`text-[13px] font-medium min-w-[130px] transition-colors duration-150 ${isAvailable ? 'text-slate-50' : 'text-slate-600'}`}>
                                {day.label}
                            </span>

                            {isAvailable && (
                                <div className="flex items-center flex-wrap gap-2 ml-auto">
                                    {rules.map((rule, idx) => {
                                        if (rule.dayOfWeek !== day.value) return null
                                        return (
                                            <div key={idx} className="flex items-center gap-1.5">
                                                <input type="time" value={rule.startTime.substring(0, 5)}
                                                    onChange={(e) => updateTimeSlot(idx, 'startTime', e.target.value)}
                                                    className="bg-[#0D1117] border border-white/[0.06] rounded-lg px-2.5 py-1.5 text-[13px] text-slate-50 focus:border-blue-500/60 focus:outline-none transition-colors duration-150 w-[95px] text-center [color-scheme:dark]" />
                                                <span className="text-slate-600 text-[11px]">—</span>
                                                <input type="time" value={rule.endTime.substring(0, 5)}
                                                    onChange={(e) => updateTimeSlot(idx, 'endTime', e.target.value)}
                                                    className="bg-[#0D1117] border border-white/[0.06] rounded-lg px-2.5 py-1.5 text-[13px] text-slate-50 focus:border-blue-500/60 focus:outline-none transition-colors duration-150 w-[95px] text-center [color-scheme:dark]" />
                                                <button onClick={() => removeTimeSlot(idx)} className="p-1 rounded-md text-slate-700 hover:text-red-400 hover:bg-red-400/10 transition-colors duration-150">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        )
                                    })}
                                    <button onClick={() => addTimeSlot(day.value)} className="p-1 rounded-md text-slate-700 hover:text-blue-400 hover:bg-blue-500/10 transition-colors duration-150">
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )
            })}

            <div className="pt-6">
                <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold hover:shadow-[0_0_16px_rgba(37,99,235,0.15)] transition-all duration-150">
                    Salvar Disponibilidade
                </Button>
            </div>
        </div>
    )
}
