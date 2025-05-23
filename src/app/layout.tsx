
import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Movie Explorer',
  description: 'Search, discover, and save your favorite movies.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <body className={`flex flex-col min-h-screen`}>
        <ThemeProvider>
          <FavoritesProvider>
            <Header />
            <main className="flex-grow container mx-auto">
              {children}
            </main>
            <Footer />
            <Toaster />
          </FavoritesProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
