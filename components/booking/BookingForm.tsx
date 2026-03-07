import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

const bookingSchema = z.object({
    name: z.string().min(2, 'Nome muito curto'),
    email: z.string().email('Email inválido'),
    notes: z.string().optional()
})

type BookingFormData = z.infer<typeof bookingSchema>

interface BookingFormProps {
    onSubmit: (data: BookingFormData) => void
    loading?: boolean
}

export function BookingForm({ onSubmit, loading }: BookingFormProps) {
    const { register, handleSubmit, formState: { errors } } = useForm<BookingFormData>({
        resolver: zodResolver(bookingSchema)
    })

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <Label htmlFor="name" className="mb-1.5 block">Nome completo *</Label>
                <Input
                    id="name"
                    {...register('name')}
                    placeholder="João da Silva"
                    disabled={loading}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1 font-medium">{errors.name.message}</p>}
            </div>

            <div>
                <Label htmlFor="email" className="mb-1.5 block">E-mail corporativo ou pessoal *</Label>
                <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="seu@email.com"
                    disabled={loading}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1 font-medium">{errors.email.message}</p>}
            </div>

            <div>
                <Label htmlFor="notes" className="mb-1.5 block">Observações (opcional)</Label>
                <Textarea
                    id="notes"
                    {...register('notes')}
                    placeholder="Adicione um contexto para nossa reunião..."
                    rows={4}
                    disabled={loading}
                    className="resize-none"
                />
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-6 font-bold text-lg" disabled={loading}>
                {loading ? 'Confirmando...' : 'Confirmar Agendamento'}
            </Button>
        </form>
    )
}
