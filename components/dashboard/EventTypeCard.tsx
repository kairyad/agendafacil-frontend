'use client'

import { useState } from 'react'
import { Link as LinkIcon, MoreVertical, ExternalLink, Copy, Check } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'

interface EventType {
    id: string
    name: string
    slug: string
    durationMinutes?: number
    duration_minutes?: number
    description: string
    color?: string
}

interface EventTypeCardProps {
    eventType: EventType
    onEdit: (et: EventType) => void
    onDelete: (id: string) => void
}

export function EventTypeCard({ eventType, onEdit, onDelete }: EventTypeCardProps) {
    const { user } = useAuth()
    const [copied, setCopied] = useState(false)
    const publicUrl = typeof window !== 'undefined' ? `${window.location.origin}/${user?.username}/${eventType.slug}` : ''
    const duration = eventType.durationMinutes || eventType.duration_minutes || 30
    const accentColor = eventType.color || '#2563EB'

    const copyLink = () => {
        navigator.clipboard.writeText(publicUrl)
        setCopied(true)
        toast.success('Link copiado!')
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="dark-card card-lift overflow-hidden group">
            <div className="h-[3px]" style={{ background: accentColor }} />

            <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2.5">
                            <div className="w-1.5 h-5 rounded-full flex-shrink-0" style={{ background: accentColor }} />
                            <h3 className="text-[15px] font-semibold text-slate-50 truncate">{eventType.name}</h3>
                        </div>
                        <p className="text-[13px] text-slate-600 mt-2 ml-4 font-medium">{duration} min • Google Meet</p>
                        {eventType.description && (
                            <p className="text-[12px] text-slate-600 mt-1 ml-4 line-clamp-1">{eventType.description}</p>
                        )}
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger className="p-1.5 rounded-lg hover:bg-white/[0.03] transition-colors duration-150 focus:outline-none">
                            <MoreVertical className="w-4 h-4 text-slate-600" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-36 bg-[#111827] border-white/[0.06]">
                            <DropdownMenuItem onClick={() => onEdit(eventType)} className="text-[13px] text-slate-400 hover:text-slate-200 cursor-pointer focus:bg-white/[0.03]">
                                Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={copyLink} className="md:hidden text-[13px] text-slate-400 hover:text-slate-200 cursor-pointer focus:bg-white/[0.03]">
                                Copiar link
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDelete(eventType.id)} className="text-[13px] text-red-400 focus:bg-red-500/10 cursor-pointer">
                                Excluir
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between gap-2">
                    <a href={publicUrl} target="_blank" className="text-[13px] font-medium text-blue-500 hover:underline transition inline-flex items-center gap-1.5">
                        <ExternalLink className="w-3.5 h-3.5" /> Ver página
                    </a>
                    <button onClick={copyLink} className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-slate-600 border border-white/[0.06] rounded-lg hover:border-white/[0.12] hover:text-slate-400 transition-all duration-150 active:scale-95">
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? 'Copiado!' : 'Copiar link'}
                    </button>
                </div>
            </div>
        </div>
    )
}
