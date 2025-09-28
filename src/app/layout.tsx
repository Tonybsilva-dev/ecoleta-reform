import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ToastProvider } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Ecoleta Reform - Marketplace Sustentável",
  description:
    "Plataforma de marketplace sustentável para coleta e reciclagem de resíduos",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={cn("min-h-screen bg-background font-funnel antialiased")}
        suppressHydrationWarning
      >
        <AuthProvider>
          {children}
          <ToastProvider />
        </AuthProvider>
      </body>
    </html>
  );
}
