'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import api from '@/lib/api'
import { CheckCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

function CallbackContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const [status, setStatus] = useState('Processando conexão com sua conta Google...')

    useEffect(() => {
        if (!code) {
            setStatus('Nenhum código encontrado. Redirecionando...')
            setTimeout(() => router.push('/configuracoes'), 2000)
            return
        }

        const verifyCallback = async () => {
            try {
                await api.post('/api/google/auth/callback', { code, state })
                setStatus('Conta sincronizada com sucesso! Redirecionando...')
                setTimeout(() => router.push('/configuracoes'), 2000)
            } catch (error) {
                setStatus('Erro ao conectar conta Google. Redirecionando...')
                setTimeout(() => router.push('/configuracoes'), 2000)
            }
        }

        verifyCallback()
    }, [code, state, router])

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-xl shadow border max-w-sm w-full text-center">
                <CheckCircle className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
                <h2 className="text-xl font-bold text-gray-900 mb-2">Google Agenda</h2>
                <p className="text-gray-500">{status}</p>
            </div>
        </div>
    )
}

export default function GoogleCallbackPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
            <CallbackContent />
        </Suspense>
    )
}
