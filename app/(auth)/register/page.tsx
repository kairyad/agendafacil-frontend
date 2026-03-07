import { RegisterForm } from '@/components/auth/RegisterForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Criar Conta | Agenda Fácil',
    description: 'Crie sua conta para começar a receber agendamentos',
}

export default function RegisterPage() {
    return (
        <div>
            <h3 className="text-xl font-semibold mb-6">Crie sua conta</h3>
            <RegisterForm />
        </div>
    )
}
