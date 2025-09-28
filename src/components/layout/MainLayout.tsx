"use client";

import type { ReactNode } from "react";

import { MainSidebar } from "./MainSidebar";

interface MainLayoutProps {
  children: ReactNode;
  className?: string;
}

export function MainLayout({ children, className }: MainLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <MainSidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden lg:ml-0">
        <main className="flex-1 overflow-y-auto">
          <div className={className || "p-6"}>{children}</div>
        </main>
      </div>
    </div>
  );
}
