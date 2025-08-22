import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { MarketDataProvider } from "@/contexts/MarketDataContext";
import { PortfolioProvider } from "@/contexts/PortfolioContext";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Navigation } from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CryptoEx - Professional Cryptocurrency Exchange",
  description: "Advanced cryptocurrency trading platform with real-time market data, portfolio management, and professional trading tools.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <MarketDataProvider>
              <PortfolioProvider>
                <div className="min-h-screen bg-background">
                  <Navigation />
                  <main className="pt-16">
                    {children}
                  </main>
                </div>
                <Toaster />
              </PortfolioProvider>
            </MarketDataProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}