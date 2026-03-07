import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
    title: string
    value: string | number
    icon: LucideIcon
    trend?: number
    iconColor?: string
    iconBg?: string
}

export function StatsCard({ title, value, icon: Icon, trend, iconColor = 'text-blue-500', iconBg = 'bg-blue-500/[0.08]' }: StatsCardProps) {
    return (
        <div className="dark-card card-lift p-6 cursor-default group">
            <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                    <p className="label-uppercase">{title}</p>
                    <p className="text-[2.25rem] font-bold text-slate-50 mt-3 leading-none tracking-tight">{value}</p>
                    {trend !== undefined && (
                        <p className={`text-[13px] mt-3 flex items-center gap-1.5 font-medium ${trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% vs mês passado
                        </p>
                    )}
                </div>
                <div className={`w-10 h-10 rounded-[10px] ${iconBg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${iconColor}`} strokeWidth={1.8} />
                </div>
            </div>
        </div>
    )
}
