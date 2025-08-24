import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NIEPD CMS - Content Management System",
  description: "National Institute for Educational Professional Development - Content Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                // Theme handling
                const theme = localStorage.getItem('cms-theme') || 'system';
                const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                const actualTheme = theme === 'system' ? systemTheme : theme;
                document.documentElement.classList.add(actualTheme);
                
                // Language and direction handling
                const language = localStorage.getItem('cms-language') || 'ar';
                const direction = language === 'ar' ? 'rtl' : 'ltr';
                document.documentElement.setAttribute('lang', language);
                document.documentElement.setAttribute('dir', direction);
                
                // Add language class to body for CSS targeting
                document.documentElement.classList.add('lang-' + language);
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-readex`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
