import type { ReactNode } from "react";
import Footer from "./Footer";

import { Toaster } from "sonner";
import Navbar from "./Navber";

interface IProps {
  children: ReactNode;
}

export default function CommonLayout({ children }: IProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-pink-500/20 selection:text-pink-600">
      {/* Top Navbar Container */}
      <Navbar />

      {/* Main Content Area */}
      <main className="">
        {children}
      </main>

      {/* Unified Toaster for notifications */}
      <Toaster position="top-right" richColors closeButton />

      {/* Footer */}
      <Footer />
    </div>
  );
}