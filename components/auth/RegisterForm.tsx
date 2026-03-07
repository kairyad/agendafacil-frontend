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

const registerSchema = z.object({
    name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
    username: z.string().min(3, 'O nome de usuário deve ter pelo menos 3 caracteres').regex(/^[a-zA-Z0-9_-]+$/, 'Apenas letras, números, hífen e underline'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
})

type RegisterFormValues = z.infer<typeof registerSchema>

export function RegisterForm() {
    const router = useRouter()
    const { login } = useAuth()
    const [loading, setLoading] = useState(false)

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema)
    })

    const onSubmit = async (data: RegisterFormValues) => {
        try {
            setLoading(true)
            const { confirmPassword, ...payload } = data;
            const response = await api.post('/api/auth/register', payload)
            if (response.data.success) {
                login(response.data.data.token, response.data.data.user)
                toast.success('Conta criada com sucesso!')
                router.push('/dashboard')
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error?.message || 'Erro ao criar conta')
        } finally {
            setLoading(false)
        }
    }

    const inputClass = "bg-[#0D1117] border-white/[0.06] text-slate-50 placeholder:text-slate-600 focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20 text-[14px]"

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
            <div className="space-y-1.5">
                <Label htmlFor="name" className="text-[13px] text-slate-400">Nome completo</Label>
                <Input id="name" placeholder="João da Silva" {...register('name')} disabled={loading} className={inputClass} />
                {errors.name && <p className="text-[12px] text-red-400">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="username" className="text-[13px] text-slate-400">Username exclusivo</Label>
                <div className="flex">
                    <span className="inline-flex items-center px-3 text-[12px] text-slate-600 bg-[#0D1117] border border-r-0 border-white/[0.06] rounded-s-lg whitespace-nowrap">
                        agendafacil.com/
                    </span>
                    <Input id="username" placeholder="joaosilva" className={`${inputClass} rounded-s-none`} {...register('username')} disabled={loading} />
                </div>
                {errors.username && <p className="text-[12px] text-red-400">{errors.username.message}</p>}
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="email" className="text-[13px] text-slate-400">Email</Label>
                <Input id="email" type="email" placeholder="seu@email.com" {...register('email')} disabled={loading} className={inputClass} />
                {errors.email && <p className="text-[12px] text-red-400">{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-[13px] text-slate-400">Senha</Label>
                    <Input id="password" type="password" {...register('password')} disabled={loading} className={inputClass} />
                    {errors.password && <p className="text-[12px] text-red-400">{errors.password.message}</p>}
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="confirmPassword" className="text-[13px] text-slate-400">Confirmar</Label>
                    <Input id="confirmPassword" type="password" {...register('confirmPassword')} disabled={loading} className={inputClass} />
                    {errors.confirmPassword && <p className="text-[12px] text-red-400">{errors.confirmPassword.message}</p>}
                </div>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-semibold mt-2 hover:shadow-[0_0_16px_rgba(37,99,235,0.15)] transition-all duration-150" disabled={loading}>
                {loading ? 'Criando conta...' : 'Criar Conta'}
            </Button>

            <div className="text-center text-[13px] pt-3 text-slate-600">
                Já tem uma conta?{' '}
                <Link href="/login" className="font-medium text-blue-500 hover:underline">Entrar</Link>
            </div>
        </form>
    )
}
