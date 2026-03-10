'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Code2, Copy, Check, RefreshCw, Key, ShieldAlert } from 'lucide-react'
import { toast } from 'sonner'
import api from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'

export default function IntegracoesPage() {
    const { user, isLoading: authLoading } = useAuth()
    const [loading, setLoading] = useState(true)
    const [generating, setGenerating] = useState(false)
    const [apiToken, setApiToken] = useState<string | null>(null)
    const [copiedContent, setCopiedContent] = useState<string | null>(null)
    const [eventSlug, setEventSlug] = useState<string>('slug-do-seu-evento')

    useEffect(() => {
        if (!authLoading && user) {
            setApiToken(user.apiToken || null)

            // Buscar o slug real de um evento do usuário para o template do cURL
            api.get('/api/event-types')
                .then(res => {
                    const eventosAtivos = res.data.data.filter((e: any) => e.is_active)
                    if (eventosAtivos.length > 0) {
                        setEventSlug(eventosAtivos[0].slug)
                    }
                })
                .catch(console.error)
                .finally(() => setLoading(false))
        } else if (!authLoading && !user) {
            setLoading(false)
        }
    }, [user, authLoading])

    const generateToken = async () => {
        try {
            setGenerating(true)
            const response = await api.post('/api/auth/api-token')
            if (response.data.success) {
                setApiToken(response.data.data.apiToken)
                toast.success('Nova chave de API gerada com sucesso!')
            }
        } catch (error) {
            toast.error('Erro ao gerar chave de API')
        } finally {
            setGenerating(false)
        }
    }

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text)
        setCopiedContent(id)
        setTimeout(() => setCopiedContent(null), 2000)
        toast.success("Copiado para a área de transferência!")
    }

    if (loading || authLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        )
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://agendafacil-production-82b6.up.railway.app'
    const username = user?.username || 'seu_username'

    const curlSlots = `curl -X GET "${apiUrl}/api/public/${username}/${eventSlug}/available-slots?date=2026-03-15" \\
  -H "Authorization: Bearer \${API_TOKEN}"`

    const curlBook = `curl -X POST "${apiUrl}/api/public/${username}/${eventSlug}/book" \\
  -H "Authorization: Bearer \${API_TOKEN}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "startTime": "2026-03-15T14:00:00.000Z",
    "attendeeName": "João Silva",
    "attendeeEmail": "joao@email.com",
    "attendeeNotes": "Preciso falar sobre o projeto X."
  }'`

    const curlCancel = `# (Se precisar cancelar em endpoints futuros, a lógica de auth é exatamente a mesma!)
# curl -X DELETE "${apiUrl}/api/appointments/{id}" \\
#   -H "Authorization: Bearer \${API_TOKEN}"`

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-12">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                    <Code2 className="w-8 h-8 text-blue-500" />
                    Integrações & API
                </h1>
                <p className="text-slate-400">
                    Gerencie suas chaves de API e integre o Agenda Fácil a outras ferramentas como n8n, Make, ou seu próprio sistema.
                </p>
            </div>

            <Card className="border-slate-800 shadow-xl overflow-hidden bg-slate-900/40 backdrop-blur-md">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-1 w-full"></div>
                <CardHeader className="bg-transparent pb-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-xl flex items-center gap-2 text-white">
                                <Key className="w-5 h-5 text-blue-400" /> Chave de API (Token)
                            </CardTitle>
                            <CardDescription className="mt-1.5 text-slate-400">
                                Use esta chave para autenticar requisições HTTP na nossa API. Guarde-a em segurança.
                            </CardDescription>
                        </div>
                        <Button
                            onClick={generateToken}
                            disabled={generating}
                            variant={apiToken ? "outline" : "default"}
                            className={apiToken ? "border-slate-700 text-white bg-slate-800 hover:bg-slate-700" : "bg-blue-600 hover:bg-blue-700 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)] border-none"}
                        >
                            {generating ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : null}
                            {apiToken ? 'Gerar Nova Chave' : 'Criar minha primeira Chave'}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="bg-slate-950/40 border-t border-slate-800/50 pt-6 backdrop-blur-sm">
                    {apiToken ? (
                        <div className="space-y-4">
                            <label className="text-sm font-semibold text-slate-300">Seu Token Ativo</label>
                            <div className="flex items-center gap-2">
                                <code className="flex-1 block p-3.5 bg-black/40 text-emerald-400 rounded-lg text-sm font-mono overflow-x-auto whitespace-nowrap border border-slate-800 shadow-inner">
                                    {apiToken}
                                </code>
                                <Button
                                    variant="outline"
                                    className="shrink-0 relative overflow-hidden bg-slate-800 border-slate-700 hover:bg-slate-700 h-12 px-5 transition-all text-white"
                                    onClick={() => copyToClipboard(apiToken, 'token')}
                                >
                                    {copiedContent === 'token' ? (
                                        <>
                                            <Check className="w-4 h-4 text-emerald-400 mr-2" />
                                            <span className="text-emerald-400">Copiado</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4 text-slate-300 mr-2" />
                                            <span>Copiar</span>
                                        </>
                                    )}
                                </Button>
                            </div>
                            <div className="flex items-start gap-3 text-amber-500 bg-amber-500/10 p-4 rounded-lg mt-5 text-sm font-medium border border-amber-500/20">
                                <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                                <p className="leading-relaxed">Atenção: A chave permite acesso total aos seus dados de agendamento em seu nome. Nunca exponha sua chave publicamente no frontend (lado do cliente).</p>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700/50">
                                <Key className="w-8 h-8 text-slate-500" />
                            </div>
                            <p className="text-slate-300 font-medium text-lg">Você ainda não possui uma Chave de API.</p>
                            <p className="text-sm text-slate-500 mt-2">Clique no botão acima para liberar sua integração com n8n, Make e Zapier.</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="mt-12 mb-6">
                <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                    <span className="text-blue-500">{"</>"}</span> Como usar a API
                </h2>
                <p className="text-slate-400 mt-2">
                    Exemplos de código prontos para copiar e colar nas suas automações.
                    Nas requisições, passe a chave no cabeçalho <code className="bg-slate-800 px-1.5 py-0.5 rounded text-red-400 border border-slate-700 text-xs font-mono ml-1">Authorization: Bearer SEU_TOKEN</code>.
                </p>
            </div>

            <div className="space-y-6">
                <Card className="border-slate-800 bg-slate-900/30 overflow-hidden backdrop-blur-md">
                    <CardHeader className="border-b border-slate-800/50 pb-4 bg-transparent">
                        <CardTitle className="text-lg text-white">1. Buscar Horários Disponíveis</CardTitle>
                        <CardDescription className="text-slate-400">
                            Verifica todos os slots abertos para o seu evento em uma data específica.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 bg-black/60 relative group border-t border-slate-800/30">
                        <pre className="p-5 overflow-x-auto text-sm text-slate-300 font-mono leading-relaxed">
                            {curlSlots}
                        </pre>
                        <Button
                            size="sm"
                            variant="secondary"
                            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-700/80 hover:bg-slate-600 text-white border-none backdrop-blur-sm"
                            onClick={() => copyToClipboard(curlSlots, 'curl1')}
                        >
                            {copiedContent === 'curl1' ? <Check className="w-4 h-4 mr-2 text-emerald-400" /> : <Copy className="w-4 h-4 mr-2" />}
                            Copiar
                        </Button>
                    </CardContent>
                </Card>

                <Card className="border-slate-800 bg-slate-900/30 overflow-hidden backdrop-blur-md">
                    <CardHeader className="border-b border-slate-800/50 pb-4 bg-transparent">
                        <CardTitle className="text-lg text-white">2. Criar Agendamento</CardTitle>
                        <CardDescription className="text-slate-400">
                            Gera uma reunião definitiva em um horário livre, enviando os dados do cliente e gerando link do Meet.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 bg-black/60 relative group border-t border-slate-800/30">
                        <pre className="p-5 overflow-x-auto text-sm text-slate-300 font-mono leading-relaxed">
                            {curlBook}
                        </pre>
                        <Button
                            size="sm"
                            variant="secondary"
                            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-700/80 hover:bg-slate-600 text-white border-none backdrop-blur-sm"
                            onClick={() => copyToClipboard(curlBook, 'curl2')}
                        >
                            {copiedContent === 'curl2' ? <Check className="w-4 h-4 mr-2 text-emerald-400" /> : <Copy className="w-4 h-4 mr-2" />}
                            Copiar
                        </Button>
                    </CardContent>
                </Card>

                <Card className="border-slate-800 bg-slate-900/30 overflow-hidden backdrop-blur-md">
                    <CardHeader className="border-b border-slate-800/50 pb-4 bg-transparent">
                        <CardTitle className="text-lg text-white">3. Cancelar via API</CardTitle>
                        <CardDescription className="text-slate-400">
                            (Em breve) Você poderá cancelar agendas ativas usando requisição DELETE.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 bg-black/60 relative group border-t border-slate-800/30">
                        <pre className="p-5 overflow-x-auto text-sm text-slate-500 font-mono leading-relaxed italic">
                            {curlCancel}
                        </pre>
                        <Button
                            size="sm"
                            variant="secondary"
                            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-700/80 hover:bg-slate-600 text-white border-none backdrop-blur-sm"
                            onClick={() => copyToClipboard(curlCancel, 'curl3')}
                        >
                            {copiedContent === 'curl3' ? <Check className="w-4 h-4 mr-2 text-emerald-400" /> : <Copy className="w-4 h-4 mr-2" />}
                            Copiar
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
