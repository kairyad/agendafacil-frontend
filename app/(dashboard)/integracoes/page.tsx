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

    useEffect(() => {
        if (!authLoading && user) {
            // API Token is returned in the getMe payload if it exists
            setApiToken(user.apiToken || null)
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
    const eventSlug = 'nome_do_evento' // Example

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
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Integrações & API</h1>
                <p className="text-gray-500">
                    Gerencie suas chaves de API e integre o Agenda Fácil a outras ferramentas como n8n, Make, ou seu próprio sistema.
                </p>
            </div>

            <Card className="border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-2 w-full"></div>
                <CardHeader className="bg-white pb-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-xl flex items-center gap-2">
                                <Key className="w-5 h-5 text-blue-600" /> Chave de Api (Token)
                            </CardTitle>
                            <CardDescription className="mt-1.5">
                                Use esta chave para autenticar requisições HTTP na nossa API. Guarde-a em segurança.
                            </CardDescription>
                        </div>
                        <Button
                            onClick={generateToken}
                            disabled={generating}
                            variant={apiToken ? "outline" : "default"}
                            className={apiToken ? "" : "bg-blue-600 hover:bg-blue-700"}
                        >
                            {generating ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : null}
                            {apiToken ? 'Gerar Nova Chave' : 'Gerar Chave de API'}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="bg-gray-50/50 border-t pt-6">
                    {apiToken ? (
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-gray-700">Seu Token Ativo</label>
                            <div className="flex items-center gap-2">
                                <code className="flex-1 block p-3 bg-gray-900 text-green-400 rounded-lg text-sm font-mono overflow-x-auto whitespace-nowrap">
                                    {apiToken}
                                </code>
                                <Button
                                    variant="outline"
                                    className="shrink-0 relative overflow-hidden bg-white hover:bg-gray-50 h-11 px-4"
                                    onClick={() => copyToClipboard(apiToken, 'token')}
                                >
                                    {copiedContent === 'token' ? (
                                        <Check className="w-4 h-4 text-green-600" />
                                    ) : (
                                        <Copy className="w-4 h-4 text-gray-500" />
                                    )}
                                </Button>
                            </div>
                            <div className="flex items-start gap-2 text-amber-600 bg-amber-50 p-3 rounded-md mt-4 text-sm font-medium border border-amber-100">
                                <ShieldAlert className="w-5 h-5 shrink-0" />
                                <p>Atenção: A chave permite acesso em seu nome. Nunca exponha publicamente no frontend (lado do cliente).</p>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500 font-medium">Você ainda não gerou uma chave de API.</p>
                            <p className="text-sm text-gray-400 mt-1">Clique no botão acima para criar sua primeira integração.</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="mt-8 mb-4">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
                    <Code2 className="w-6 h-6 text-blue-600" /> Como usar a API
                </h2>
                <p className="text-gray-500 mt-2">
                    Exemplos de código prontos para copiar e colar nas suas automações.
                    Nas requisições, passe a chave no cabeçalho <code className="bg-gray-100 px-1 py-0.5 rounded text-red-500 text-xs">Authorization: Bearer SEU_TOKEN</code>.
                </p>
            </div>

            <div className="space-y-6">
                <Card className="shadow-sm border-gray-200">
                    <CardHeader className="bg-white border-b pb-4">
                        <CardTitle className="text-lg">1. Buscar Horários Disponíveis</CardTitle>
                        <CardDescription>
                            Verifica todos os slots abertos para um tipo de evento numa data específica.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 bg-gray-950 rounded-b-xl relative group">
                        <pre className="p-4 overflow-x-auto text-sm text-gray-300 font-mono leading-relaxed">
                            {curlSlots}
                        </pre>
                        <Button
                            size="sm"
                            variant="secondary"
                            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => copyToClipboard(curlSlots, 'curl1')}
                        >
                            {copiedContent === 'curl1' ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                            Copiar
                        </Button>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-gray-200">
                    <CardHeader className="bg-white border-b pb-4">
                        <CardTitle className="text-lg">2. Criar Agendamento</CardTitle>
                        <CardDescription>
                            Gera uma reunião definitiva em um horário livre, enviando os dados do cliente.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 bg-gray-950 rounded-b-xl relative group">
                        <pre className="p-4 overflow-x-auto text-sm text-gray-300 font-mono leading-relaxed">
                            {curlBook}
                        </pre>
                        <Button
                            size="sm"
                            variant="secondary"
                            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => copyToClipboard(curlBook, 'curl2')}
                        >
                            {copiedContent === 'curl2' ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                            Copiar
                        </Button>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-gray-200">
                    <CardHeader className="bg-white border-b pb-4">
                        <CardTitle className="text-lg">3. Cancelar via API</CardTitle>
                        <CardDescription>
                            Futuramente, você poderá cancelar agendas enviando uma requisição DELETE como abaixo:
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 bg-gray-950 rounded-b-xl relative group">
                        <pre className="p-4 overflow-x-auto text-sm text-gray-400 font-mono leading-relaxed italic">
                            {curlCancel}
                        </pre>
                        <Button
                            size="sm"
                            variant="secondary"
                            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => copyToClipboard(curlCancel, 'curl3')}
                        >
                            {copiedContent === 'curl3' ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                            Copiar
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
