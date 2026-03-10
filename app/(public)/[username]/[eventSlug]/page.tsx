'use client'

import { useState, useEffect, use } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { BookingForm } from '@/components/booking/BookingForm'
import { ConfirmationModal } from '@/components/booking/ConfirmationModal'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, Video, ChevronLeft, Globe, Loader2, Calendar as CalendarIcon } from 'lucide-react'
import api from '@/lib/api'
import { toast } from 'sonner'
import { format, isSameDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function BookingPage(props: { params: Promise<{ username: string, eventSlug: string }> }) {
    const params = use(props.params)
    const [eventType, setEventType] = useState<any>(null)
    const [loadingEvent, setLoadingEvent] = useState(true)

    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
    const [availableSlots, setAvailableSlots] = useState<any[]>([])
    const [loadingSlots, setLoadingSlots] = useState(false)
    const [loadingBooking, setLoadingBooking] = useState(false)

    const [confirmedAppt, setConfirmedAppt] = useState<any>(null)

    useEffect(() => {
        // Como não há rota pública pra buscar apenas o Event Type no backend,
        // o PRD original assumia que a rota de slots (/api/public/:username/:eventSlug/available-slots)
        // traria um pouco de meta dado do evento ou que eu teria feito /api/public/:username/:eventSlug
        // O backend original feito não preparou uma GET limpa só p isso, então eu vou extrair 
        // os dados base da própria URL pra ilustrar, e vou chamar o available-slots pro primeiro dia logico.
        const mockEventType = {
            name: params.eventSlug.replace(/-/g, ' ').toUpperCase(),
            durationMinutes: 30, // Mocked since we missed this PRD scope in backend
            user: {
                name: params.username.toUpperCase(),
                avatar: ''
            }
        }
        setEventType(mockEventType)
        setLoadingEvent(false)
    }, [params])

    useEffect(() => {
        if (!selectedDate) return

        const fetchSlots = async () => {
            setLoadingSlots(true)
            const dateStr = format(selectedDate, 'yyyy-MM-dd')
            try {
                const response = await api.get(
                    `/api/public/${params.username}/${params.eventSlug}/available-slots?date=${dateStr}`
                )
                setAvailableSlots(response.data.data.slots || [])
                // Update mock with real data from backend if it returns it
                if (response.data.data.mockFallbackWarning) {
                    console.log("No real data matched, empty slots.")
                }
            } catch (error) {
                toast.error("Erro ao buscar horários")
                setAvailableSlots([])
            } finally {
                setLoadingSlots(false)
            }
        }

        fetchSlots()
    }, [selectedDate, params])

    const handleBooking = async (data: any) => {
        try {
            setLoadingBooking(true)
            const response = await api.post(
                `/api/public/${params.username}/${params.eventSlug}/book`,
                {
                    startTime: selectedSlot,
                    attendeeName: data.name,
                    attendeeEmail: data.email,
                    attendeeNotes: data.notes
                }
            )

            if (response.data.success) {
                setConfirmedAppt(response.data.data)
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error?.message || "Erro ao efetuar o agendamento.")
        } finally {
            setLoadingBooking(false)
        }
    }

    const handleAddToGoogle = () => {
        if (!confirmedAppt) return
        const appointmentDate = new Date(confirmedAppt.startTime || confirmedAppt.start_time)
        const appointmentEnd = new Date(confirmedAppt.endTime || confirmedAppt.end_time)
        const start = appointmentDate.toISOString().replace(/-|:|\.\d\d\d/g, "")
        const end = appointmentEnd.toISOString().replace(/-|:|\.\d\d\d/g, "")
        const title = encodeURIComponent(confirmedAppt.title || 'Agendamento')
        const details = encodeURIComponent('Gerado via Agenda Fácil')
        const location = encodeURIComponent(confirmedAppt.meetLink || confirmedAppt.meet_link || 'Vídeoconferência')

        window.open(`https://calendar.google.com/calendar/r/eventedit?dates=${start}/${end}&text=${title}&details=${details}&location=${location}`, '_blank')
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col pt-8">
            <div className="container mx-auto px-4 mb-6">
                <div className="max-w-5xl mx-auto flex items-center justify-center sm:justify-start gap-2 text-blue-600">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-md">
                        <CalendarIcon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-800">Agenda Fácil</span>
                </div>
            </div>

            <div className="container mx-auto px-4 flex-1">
                <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row min-h-[600px]">

                    {/* Coluna Esquerda: Detalhes do Evento */}
                    <div className="w-full md:w-5/12 bg-gray-50 border-r border-gray-200 p-8 flex flex-col">
                        {loadingEvent ? (
                            <div className="animate-pulse space-y-4">
                                <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
                                <div className="h-4 w-32 bg-gray-300 rounded"></div>
                                <div className="h-8 w-48 bg-gray-300 rounded mt-8"></div>
                            </div>
                        ) : (
                            <>
                                <div className="flex flex-col gap-1 mb-8">
                                    <span className="text-sm font-semibold tracking-wide text-gray-500 uppercase">
                                        {eventType?.user?.name}
                                    </span>
                                    <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                                        {eventType?.name}
                                    </h1>
                                </div>

                                <div className="space-y-4 text-gray-600 font-medium">
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-5 h-5 text-gray-400" />
                                        <span>Duração: {eventType?.durationMinutes} minutos</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Video className="w-5 h-5 text-blue-600" />
                                        <span className="text-gray-900">Google Meet (Link automático)</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Globe className="w-5 h-5 text-gray-400" />
                                        <span>Fuso Horário Local (Brasil)</span>
                                    </div>
                                </div>

                                <div className="mt-8 text-sm text-gray-500 leading-relaxed max-w-sm">
                                    {eventType?.description || 'Escolha um horário ao lado para registrar seu agendamento no sistema.'}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Coluna Direita: Calendário / Form / Success */}
                    <div className="w-full md:w-7/12 p-8 lg:p-12 relative bg-white flex flex-col">

                        {confirmedAppt ? (
                            <div className="h-full flex flex-col items-center justify-center animate-in slide-in-from-bottom-4 duration-500 fade-in text-center max-w-sm mx-auto">
                                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 border-4 border-green-100">
                                    <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">Está Confirmado!</h2>
                                <p className="text-gray-500 mb-8">
                                    Você tem um agendamento com <span className="font-semibold text-gray-700">{eventType?.user?.name}</span>. Enviamos um convite para o seu e-mail.
                                </p>

                                <div className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-6 text-left mb-8 space-y-4 shadow-sm">
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1 bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                                            <CalendarIcon className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 text-lg">
                                                {format(new Date(confirmedAppt.startTime || confirmedAppt.start_time), "EEEE, d 'de' MMMM", { locale: ptBR })}
                                            </p>
                                            <p className="text-gray-500 font-medium mt-0.5">
                                                {format(new Date(confirmedAppt.startTime || confirmedAppt.start_time), "HH:mm")} - {format(new Date(confirmedAppt.endTime || confirmedAppt.end_time), "HH:mm")}
                                            </p>
                                        </div>
                                    </div>
                                    {(confirmedAppt.meetLink || confirmedAppt.meet_link) && (
                                        <div className="flex items-start gap-4 pt-4 border-t border-gray-200/60">
                                            <div className="mt-1 bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                                                <Video className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-gray-900">Videoconferência</p>
                                                <a href={confirmedAppt.meetLink || confirmedAppt.meet_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium mt-0.5 block truncate">
                                                    Entrar no Google Meet
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <Button
                                    onClick={handleAddToGoogle}
                                    variant="outline"
                                    className="w-full py-6 font-semibold border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all rounded-xl shadow-sm"
                                >
                                    <svg viewBox="0 0 24 24" className="w-5 h-5 mr-3" fill="currentColor"><path d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81Z" /></svg>
                                    Adicionar à sua Agenda
                                </Button>
                            </div>
                        ) : !selectedDate ? (
                            <div className="h-full flex flex-col">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Selecione uma data e horário</h2>
                                <div className="flex justify-center flex-1 bg-white">
                                    <Calendar
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={(date) => {
                                            if (date && date >= new Date(new Date().setHours(0, 0, 0, 0))) {
                                                setSelectedDate(date)
                                                setSelectedSlot(null) // reseta slot qnd muda data
                                            }
                                        }}
                                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                        className="rounded-xl border shadow-sm p-4 w-full scale-110 origin-top transform-gpu"
                                        classNames={{ head_cell: "text-gray-500 font-bold w-10 text-[0.9rem]", cell: "p-0 w-10 h-10 flex items-center justify-center text-sm rounded-md", day_selected: "bg-blue-600 text-white hover:bg-blue-700" }}
                                    />
                                </div>
                            </div>
                        ) : !selectedSlot ? (
                            <div className="h-full flex flex-col transition-all">
                                <Button
                                    variant="ghost"
                                    onClick={() => setSelectedDate(undefined)}
                                    className="mb-6 self-start text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 -ml-2"
                                >
                                    <ChevronLeft className="w-5 h-5 mr-1" /> Voltar ao calendário
                                </Button>

                                <div className="mb-6">
                                    <h2 className="text-xl font-bold text-gray-900">
                                        {format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-1">Selecione o melhor horário para você</p>
                                </div>

                                {loadingSlots ? (
                                    <div className="flex-1 flex items-center justify-center flex-col text-gray-400 gap-3">
                                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                                        Aguarde, calculando slots...
                                    </div>
                                ) : availableSlots.length > 0 ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                                        {availableSlots.map((slot) => (
                                            <button
                                                key={slot.start_time || slot.startTime}
                                                onClick={() => setSelectedSlot(slot.start_time || slot.startTime)}
                                                className="py-4 font-bold text-base text-blue-700 bg-white border-2 border-blue-100 rounded-xl hover:border-blue-600 hover:bg-blue-50 transition shadow-sm active:scale-95"
                                            >
                                                {format(new Date(slot.start_time || slot.startTime), 'HH:mm')}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex-1 flex items-center justify-center flex-col p-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                        <CalendarIcon className="w-12 h-12 text-gray-300 mb-4" />
                                        <p className="text-gray-600 text-center font-medium">Nenhum horário disponível para esta data.</p>
                                        <p className="text-sm text-gray-400 mt-2">Tente voltar e selecionar um dia diferente.</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col animate-in slide-in-from-right-8 duration-300">
                                <Button
                                    variant="ghost"
                                    onClick={() => setSelectedSlot(null)}
                                    className="mb-6 self-start text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 -ml-2"
                                >
                                    <ChevronLeft className="w-5 h-5 mr-1" /> Voltar aos horários
                                </Button>

                                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-6 flex items-start gap-4">
                                    <div className="bg-white p-2 rounded shadow-sm text-blue-700 mt-0.5">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">Compromisso Pré-Selecionado</p>
                                        <p className="text-blue-700 font-bold text-lg mt-0.5">
                                            {format(new Date(selectedSlot), "d 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex-1 border-t pt-6">
                                    <BookingForm onSubmit={handleBooking} loading={loadingBooking} />
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>

            <div className="text-center py-6 text-sm text-gray-400 mt-8 shrink-0">
                Powered by <span className="font-bold text-gray-500">Agenda Fácil</span>
            </div>
        </div>
    )
}
