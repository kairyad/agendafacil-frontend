import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { CheckCircle, Video, Calendar as CalendarIcon, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface ConfirmationModalProps {
    isOpen: boolean
    onClose: () => void
    appointment: any
}

export function ConfirmationModal({ isOpen, onClose, appointment }: ConfirmationModalProps) {
    if (!appointment) return null

    const appointmentDate = new Date(appointment.startTime || appointment.start_time)
    const appointmentEnd = new Date(appointment.endTime || appointment.end_time)

    const handleAddToGoogle = () => {
        const start = appointmentDate.toISOString().replace(/-|:|\.\d\d\d/g, "")
        const end = appointmentEnd.toISOString().replace(/-|:|\.\d\d\d/g, "")
        const title = encodeURIComponent(appointment.title || 'Agendamento')
        const details = encodeURIComponent('Gerado via Agenda Fácil')
        const location = encodeURIComponent(appointment.meetLink || appointment.meet_link || 'Vídeoconferência')

        window.open(`https://calendar.google.com/calendar/r/eventedit?dates=${start}/${end}&text=${title}&details=${details}&location=${location}`, '_blank')
    }

    const meetLink = appointment.meetLink || appointment.meet_link

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md text-center p-8">
                <DialogHeader>
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-sm ring-1 ring-green-100">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <DialogTitle className="text-2xl font-bold text-center">Agendamento Confirmado! 🎉</DialogTitle>
                    <DialogDescription className="text-center text-base mt-2">
                        Um email de confirmação com o link da reunião foi enviado para você e para o anfitrião.
                    </DialogDescription>
                </DialogHeader>

                <div className="bg-gray-50 border p-5 rounded-lg text-left mt-4 mb-6">
                    <p className="font-bold text-gray-900 text-lg border-b pb-3 mb-3">{appointment.title || 'Seu Agendamento'}</p>
                    <div className="space-y-3">
                        <div className="flex items-center text-gray-600">
                            <CalendarIcon className="w-4 h-4 mr-3 text-blue-600" />
                            <span className="font-medium">{format(appointmentDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                            <Clock className="w-4 h-4 mr-3 text-blue-600" />
                            <span className="font-medium">{format(appointmentDate, 'HH:mm')} - {format(appointmentEnd, 'HH:mm')}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    {meetLink && (
                        <Button
                            className="w-full bg-blue-600 text-white hover:bg-blue-700 py-6 font-semibold"
                            onClick={() => window.open(meetLink, '_blank')}
                        >
                            <Video className="w-5 h-5 mr-3" />
                            Testar Acesso ao Google Meet
                        </Button>
                    )}

                    <Button
                        variant="outline"
                        className="w-full py-6 font-semibold border-gray-300 text-gray-700 hover:bg-gray-50"
                        onClick={handleAddToGoogle}
                    >
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1024px-Google_%22G%22_logo.svg.png" className="w-4 h-4 mr-3" alt="Google" />
                        Adicionar na minha Agenda
                    </Button>

                    <Button variant="ghost" onClick={onClose} className="w-full text-gray-500 hover:text-gray-900 mt-2">
                        Fechar janela
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
