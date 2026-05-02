import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Presupuesto Motos",
  description: "Calculadora de presupuestos para motos",
  icons: {
    icon: "/cetrogar.jpg",
  },
  manifest: "/manifest.json",

};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0d0761" />
      </head>

      <body className="relative z-10 min-h-screen flex flex-col bg-[url('/cetrogarbanner.png')] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('/cetrogarbanner.png')` }}>
        {children}
      </body>
    </html>
  );
}
