"use client";

import {
  BarChart3,
  Bell,
  Building2,
  Flag,
  Home,
  LogOut,
  Package,
  Search,
  Users,
} from "lucide-react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const navigation = [
  { name: "Visão Geral", href: "/admin", icon: Home },
  { name: "Usuários", href: "/admin/users", icon: Users },
  { name: "Organizações", href: "/admin/organizations", icon: Building2 },
  { name: "Materiais", href: "/admin/materials", icon: Package },
  { name: "Relatórios", href: "/admin/reports", icon: BarChart3 },
  { name: "Denúncias", href: "/admin/reports-management", icon: Flag },
  { name: "Notificações", href: "/admin/notifications", icon: Bell },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="flex w-64 flex-shrink-0 flex-col border-gray-700 border-r bg-gray-800">
        {/* Header */}
        <div className="border-gray-700 border-b p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg">
              <span className="font-bold text-white text-xl">E</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-white">Sustainable</span>
              <span className="font-medium text-gray-300 text-xs">
                Marketplace Platform
              </span>
            </div>
          </div>
          <div className="mt-4">
            <span className="font-medium text-gray-200 text-sm">
              Sustainable Platform Admin Portal
            </span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4">
          <nav className="space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-200 transition-colors hover:bg-gray-700 hover:text-white"
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="border-gray-700 border-t p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={session?.user?.image || ""} />
              <AvatarFallback className="bg-purple-500 font-bold text-white">
                {session?.user?.name?.charAt(0) || "A"}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate font-semibold text-sm text-white">
                {session?.user?.name || "System Administrator"}
              </span>
              <span className="truncate font-medium text-gray-300 text-xs">
                ADMIN
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => signOut()}
              className="h-8 w-8 text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-4 border-gray-200 border-b bg-white px-6">
          <div className="flex flex-1 items-center gap-4">
            <div className="relative max-w-md flex-1">
              <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search marketplace..."
                className="h-10 rounded-lg border-gray-300 pl-10 focus:border-green-500 focus:ring-green-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-lg hover:bg-gray-100"
            >
              <Bell className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={session?.user?.image || ""} />
                <AvatarFallback className="bg-purple-500 font-bold text-white text-xs">
                  {session?.user?.name?.charAt(0) || "A"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-semibold text-gray-900 text-sm">
                  System Administrator
                </span>
                <span className="text-gray-500 text-xs">ADMIN</span>
              </div>
            </div>
            <Button className="rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 hover:bg-gray-200">
              Export Data
            </Button>
            <Button className="rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700">
              Generate Report
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-gray-50 p-6">{children}</main>
      </div>
    </div>
  );
}
