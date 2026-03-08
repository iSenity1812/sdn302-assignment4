import { cn } from "@/lib/utils";
import QueryProvider from "@/providers/query-provider";
import { AppHeader } from "@/shared/components/app-header";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Baloo_2, Comic_Neue } from "next/font/google";
import localFont from "next/font/local";
import { Toaster } from "sonner";

const baloo = Baloo_2({
  subsets: ['latin'],
  variable: '--font-baloo',
  weight: ['400', '500', '600', '700']
});
const comic = Comic_Neue({
  subsets: ['latin'],
  variable: '--font-comic',
  weight: ['300', '400', '700']
});

const geistSans = localFont({
  src: "../../public/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "../../public/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "SaaS Quiz",
  description: "Playful and educational quiz platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", baloo.variable, comic.variable)}>
      <body className={cn(
        "bg-violet-50 text-indigo-950", // Using comic as default body font
        geistSans.variable,
        geistMono.variable
      )}>
        <QueryProvider>
          <AppHeader />
          {children}
          <Toaster richColors position="top-right" />
        </QueryProvider>
      </body>
    </html>
  );
}
