import { Calendar } from 'lucide-react'

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-[#080C14] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex items-center justify-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-white" />
                    </div>
                </div>
                <h2 className="text-center text-2xl font-semibold text-slate-50">
                    Agenda Fácil
                </h2>
                <p className="mt-1.5 text-center text-[13px] text-slate-600">
                    Seu sistema de agendamentos inteligente
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-[#111827] border border-white/[0.06] rounded-2xl py-8 px-6 sm:px-10 shadow-2xl shadow-black/30">
                    {children}
                </div>
            </div>
        </div>
    )
}
