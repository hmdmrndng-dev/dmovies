import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/app/shared/floating-actions";
import { Analytics } from "@vercel/analytics/next";
import { cookies } from "next/headers";
import { tmdb } from "@/lib/tmdb";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

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
    "hmdmrndng",
  ],

  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("tmdb_session_id")?.value || null;

  let user = null;
  if (sessionId) {
    try {
      const response = await tmdb.get(
        `https://api.themoviedb.org/3/account?session_id=${sessionId}`,
      );
      user = response.data;
    } catch (e) {
      console.error(e);
      toast.error("Failed to fetch user data. Please try again later.", {
        duration: 5000,
      });
    }
  }

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
          <Navbar user={user} />
          <main>
            {children}
            <Toaster />
          </main>
          <Footer />
          <FloatingActions />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
