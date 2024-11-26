"use client";

import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import '@rainbow-me/rainbowkit/styles.css'

export default function Navbar() {
  return (
    <header className="flex h-16 w-full items-center justify-between bg-[#3B38F4] px-4 sm:px-6 md:px-8">
      <Link href="/" className="flex items-center gap-2" prefetch={false}>
        <MountainIcon className="h-6 w-6 text-white" />
        <span className="text-lg font-bold text-white">Challenge Hub</span>
      </Link>
      <div className="flex items-center gap-4 lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full max-w-xs bg-background p-6 sm:p-8">
            <div className="flex flex-col gap-6">
              <Link href="/" className="flex items-center gap-2" prefetch={false}>
                <MountainIcon className="h-6 w-6" />
                <span className="text-lg font-bold text-C3">Challenge Hub</span>
              </Link>
              <nav className="flex flex-col gap-4">
                <Link href="/challenges" className="text-lg font-medium hover:text-primary transition-colors" prefetch={false}>
                  Challenges
                </Link>
                <Link href="#" className="text-lg font-medium hover:text-primary transition-colors" prefetch={false}>
                  About
                </Link>
              </nav>
              <div
          style={{
            position: "fixed",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "sans-serif",
          }}>
          <ConnectButton />
          </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <nav className="hidden lg:flex items-center gap-6">
        <Link href="/challenges" className="text-lg text-white font-medium hover:text-primary transition-colors" prefetch={false}>
          Challenges
        </Link>
        <Link href="#" className="text-lg text-white font-medium hover:text-primary transition-colors" prefetch={false}>
          About
        </Link>
      </nav>
      <div>
          <ConnectButton />
        </div>
    </header>
  );
}

function MenuIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function MountainIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}
