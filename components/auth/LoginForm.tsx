'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import api from '@/lib/api'
import { toast } from 'sonner'
import Link from 'next/link'

const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres')
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
    const router = useRouter()
    const { login } = useAuth()
    const [loading, setLoading] = useState(false)

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema)
    })

    const onSubmit = async (data: LoginFormValues) => {
        try {
            setLoading(true)
            const response = await api.post('/api/auth/login', data)
            if (response.data.success) {
                login(response.data.data.token, response.data.data.user)
                toast.success('Login bem sucedido!')
                router.push('/dashboard')
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error?.message || 'Erro ao realizar login')
        } finally {
            setLoading(false)
        }
    }

    const inputClass = "bg-[#0D1117] border-white/[0.06] text-slate-50 placeholder:text-slate-600 focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20 text-[14px]"

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
            <div className="space-y-1.5">
                <Label htmlFor="email" className="text-[13px] text-slate-400">Email</Label>
                <Input id="email" type="email" placeholder="seu@email.com" {...register('email')} disabled={loading} className={inputClass} />
                {errors.email && <p className="text-[12px] text-red-400">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-[13px] text-slate-400">Senha</Label>
                    <Link href="#" className="text-[12px] font-medium text-blue-500 hover:underline">Esqueci minha senha</Link>
                </div>
                <Input id="password" type="password" placeholder="••••••••" {...register('password')} disabled={loading} className={inputClass} />
                {errors.password && <p className="text-[12px] text-red-400">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-semibold hover:shadow-[0_0_16px_rgba(37,99,235,0.15)] transition-all duration-150" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
            </Button>

            <div className="text-center text-[13px] pt-3 text-slate-600">
                Não tem uma conta?{' '}
                <Link href="/register" className="font-medium text-blue-500 hover:underline">Criar conta</Link>
            </div>
        </form>
    )
}
