import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/theme-provider';
import { ThemeToggleButton } from '@/components/theme-toggle-button';

export const metadata: Metadata = {
  title: 'Whispering Poet - AI Poem Generator',
  description: 'Craft beautiful poems with AI. Enter a theme, choose a style, and let Whispering Poet inspire you.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=Alegreya&display=swap" rel="stylesheet"/>
        <link href="https://fonts.googleapis.com/css2?family=Belleza&display=swap" rel="stylesheet"/>
      </head>
      <body className="font-body antialiased">
        <ThemeProvider>
          <div className="fixed top-4 right-4 z-50">
            <ThemeToggleButton />
          </div>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
