import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/floating-actions";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "dmovies-sooty",
  description:
    "I built this app to showcase my skills in working with real-world APIs. It connects to the TMDB API using Axios to fetch live movie data and display it in a clean, responsive layout.",

  authors: [
    { name: "Hamodi Marandang", url: "https://github.com/hmdmrndng-dev" },
    { name: "Hamodi Marandang", url: "https://hmdmrndng.vercel.app/" },
  ],
  creator: "Hamodi Marandang",
  publisher: "Hamodi Marandang",

  keywords: [
    "Portfolio",
    "Movie App",
    "TMDB API",
    "Next.js",
    "React",
    "Shadcn UI",
    "Tailwind CSS",
    "hmdmrndng"
  ],

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main>{children}</main>
          <Footer />
          <FloatingActions />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
