import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientSessionProvider from "@/components/providers/SessionProvider";
import { auth } from "@/auth";
import { CommandMenu } from "@/components/layout/CommandMenu";
import FloatingTicketButton from "@/components/FloatingTicketButton";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Rudratic HR",
    default: "Rudratic Technologies HR Management System"
  },
  description: "Enterprise-grade HR Platform by Rudratic Technologies",
};

export default async function RootLayout({
  // Root Layout wrapping everything
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >

          <ClientSessionProvider session={session}>
            <CommandMenu />
            {children}
            <Toaster />
            <SonnerToaster richColors position="top-right" />
            <FloatingTicketButton />
          </ClientSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
