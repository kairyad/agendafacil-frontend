import { LoginForm } from '@/components/auth/LoginForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Login | Agenda Fácil',
    description: 'Faça login na sua conta',
}

export default function LoginPage() {
    return (
        <div>
            <h3 className="text-xl font-semibold mb-6">Bem-vindo de volta!</h3>
            <LoginForm />
        </div>
    )
}
