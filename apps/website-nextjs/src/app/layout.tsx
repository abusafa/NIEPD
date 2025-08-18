import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProvider } from "@/contexts/AppContext";

export const metadata: Metadata = {
  title: "المعهد الوطني للتطوير المهني التعليمي | National Institute for Professional Educational Development",
  description: "نسعى لتطوير القدرات المهنية للمعلمين والقيادات التعليمية لتحقيق التميز في التعليم | We strive to develop the professional capabilities of teachers and educational leaders to achieve excellence in education",
  keywords: "تطوير مهني, تعليم, معلمين, قيادات تعليمية, professional development, education, teachers, educational leadership",
  authors: [{ name: "NIEPD" }],
  creator: "National Institute for Professional Educational Development",
  publisher: "NIEPD",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "ar_SA",
    alternateLocale: "en_US",
    title: "المعهد الوطني للتطوير المهني التعليمي",
    description: "نسعى لتطوير القدرات المهنية للمعلمين والقيادات التعليمية لتحقيق التميز في التعليم",
    siteName: "NIEPD",
  },
  twitter: {
    card: "summary_large_image",
    site: "@niepd_sa",
    creator: "@niepd_sa",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#00808A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/logos/png/شعار المعهد الوطني للتطوير المهني التعليمي-06-01.png" />
      </head>
      <body className="font-arabic antialiased bg-white text-secondary-900">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
