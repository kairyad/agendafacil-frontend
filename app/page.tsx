import Link from 'next/link'
import { Calendar, Clock, Globe, ArrowRight, Shield, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-200">
      {/* Navbar */}
      <nav className="border-b bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-2xl tracking-tight flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            Agenda Fácil
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-600 font-medium hover:text-gray-900 transition-colors">
              Entrar
            </Link>
            <Link href="/register">
              <Button className="bg-blue-600 hover:bg-blue-700 font-semibold shadow-md shadow-blue-500/20">
                Criar Conta
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main>
        <div className="max-w-7xl mx-auto px-6 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium mb-8">
            <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
            O novo padrão em agendamentos
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-gray-900">
            Agendamentos fáceis.<br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Menos e-mails. Mais foco.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 mb-10 max-w-3xl mx-auto leading-relaxed">
            O Agenda Fácil simplifica sua vida conectando-se ao seu calendário,
            permitindo que clientes reservem horários automaticamente sem o vai-e-vem de mensagens.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="h-14 px-8 text-lg bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/20 group">
                Comece gratuitamente
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-gray-300 hover:bg-gray-50 text-gray-700">
                Já tenho uma conta
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Preview */}
        <div className="bg-gray-50 py-24 border-t">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900">Tudo que você precisa para gerenciar seu tempo</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Disponibilidade Inteligente</h3>
                <p className="text-gray-500 leading-relaxed">
                  Configure seus horários de trabalho e deixe o Agenda Fácil fazer o resto. Nunca mais tenha horários sobrepostos.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Links Personalizados</h3>
                <p className="text-gray-500 leading-relaxed">
                  Compartilhe seu link exclusivo (ex: agendafacil.com/seu-nome) e permita que clientes agendem com um clique.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Sincronização Google</h3>
                <p className="text-gray-500 leading-relaxed">
                  Integração total com o Google Calendar. Eventos são adicionados automaticamente com links do Google Meet.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-12 text-center text-gray-500">
        <div className="flex items-center justify-center gap-2 font-bold text-xl text-gray-900 mb-4">
          <div className="bg-gray-900 p-1 rounded">
            <Calendar className="w-4 h-4 text-white" />
          </div>
          Agenda Fácil
        </div>
        <p>© {new Date().getFullYear()} Agenda Fácil. Todos os direitos reservados.</p>
      </footer>
    </div>
  )
}
