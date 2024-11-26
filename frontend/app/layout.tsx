import type { Metadata } from "next";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from "./providers";
import Navbar from "./components/navbar";
import { Inter } from "next/font/google";

export const metadata: Metadata = {
  title: "Challenge Hub - Engage with your community",
  description: "Create and participate in challenges with your community",
};

const inter = Inter({ subsets: ["latin"] });
const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`min-h-screen bg-background font-sans antialiased ${fontSans.variable}`}>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
