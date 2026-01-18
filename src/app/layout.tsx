import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GrayVally Business Card Maker — Professional Business Card Designer",
  description: "Design print-ready business cards with premium templates, live preview, and export tools from GrayVally Business Card Maker.",
  keywords: ["business card", "card maker", "design tool", "print-ready", "professional cards", "GrayVally"],
  authors: [{ name: "GrayVally" }],
  icons: {
    icon: "/favicon.ico",
    apple: "/GrayVally.png",
  },
  openGraph: {
    title: "GrayVally Business Card Maker — Professional Business Card Designer",
    description: "Design print-ready business cards with premium templates and live preview.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/GrayVally.png" />
        {/* Google Fonts for all font options */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto:wght@400;500;700&family=Open+Sans:wght@400;600;700&family=Lato:wght@400;700&family=Montserrat:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&family=Nunito:wght@400;600;700&family=Raleway:wght@400;500;600;700&family=Ubuntu:wght@400;500;700&family=Work+Sans:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Merriweather:wght@400;700&family=Lora:wght@400;500;600;700&family=Crimson+Text:wght@400;600;700&family=Source+Serif+4:wght@400;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Fira+Code:wght@400;500;600;700&family=Source+Code+Pro:wght@400;500;600;700&family=Oswald:wght@400;500;600;700&family=Bebas+Neue&family=Archivo+Black&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
