import { AvailabilityEditor } from '@/components/availability/AvailabilityEditor'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Disponibilidade | Agenda Fácil',
}

export default function AvailabilityPage() {
    return (
        <div className="space-y-6">
            <div className="pb-6 border-b border-white/[0.06]">
                <h2 className="text-2xl font-semibold text-slate-50">Disponibilidade</h2>
                <p className="text-[14px] text-slate-400 mt-1">Configure o seu horário padrão de trabalho protegido de sobreposições pelo Google Agenda.</p>
            </div>

            <AvailabilityEditor />
        </div>
    )
}
