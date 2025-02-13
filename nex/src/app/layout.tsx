import type { Metadata } from "next";
import "./globals.css";
import "./scrollbar.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { GeistSans } from "geist/font/sans";
import { Toaster } from "@/components/ui/sonner";
import { esES } from "@clerk/localizations";
import Provider from "@/context/provider";

export const metadata: Metadata = {
  title: "Nex - Inicio",
  description: "Conecta con otros usuarios. Proyecto creado por Alonso Mangas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <ClerkProvider
      localization={esES}
      appearance={{
        variables: {
          colorPrimary: "rgb(217 70 239)",
        },
        layout: {
          unsafe_disableDevelopmentModeWarnings: true,
        },
      }}
    >
      <html lang="en" className={GeistSans.className} suppressHydrationWarning>
        <body className="antialiased">
          <Provider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <div className="min-h-screen">
                <Navbar />

                <main className="lg:py-8">
                  {/* Contenedor para centrar el contenido */}
                  <div className="max-w-7xl lg:mx-auto lg:px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      <div className="hidden lg:block lg:col-span-3">
                        <Sidebar />
                      </div>
                      <div className="lg:col-span-9">{children}</div>
                    </div>
                  </div>
                </main>
              </div>
              <Toaster
                toastOptions={{
                  className: "rounded-full",
                }}
                className={GeistSans.className}
              />
            </ThemeProvider>
          </Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}
