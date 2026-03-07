import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Agenda Fácil — Agendamento Inteligente",
  description: "Plataforma de agendamento online inteligente. Gerencie seus horários, sincronize com Google Calendar e permita que clientes agendem automaticamente.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster
          richColors
          position="top-right"
          toastOptions={{
            style: {
              background: '#1A2035',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#F1F5F9',
            },
          }}
        />
      </body>
    </html>
  );
}
