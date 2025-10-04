import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase';
import { ThemeProvider } from '@/components/theme-provider';
import { ReactQueryProvider } from '@/components/react-query-provider';

export const metadata: Metadata = {
  title: 'OyeBhukkaD',
  description: 'Your AI-powered health and fitness companion.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <FirebaseClientProvider>
              {children}
              <Toaster />
            </FirebaseClientProvider>
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
