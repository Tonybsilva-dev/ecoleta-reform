"use client";

import {
  BarChart3,
  Bell,
  Building2,
  FileText,
  Home,
  Package,
  Settings,
  Shield,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navigation = [
  {
    name: "Visão Geral",
    href: "/admin",
    icon: Home,
  },
  {
    name: "Usuários",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Organizações",
    href: "/admin/organizations",
    icon: Building2,
  },
  {
    name: "Materiais",
    href: "/admin/materials",
    icon: Package,
  },
  {
    name: "Relatórios",
    href: "/admin/reports",
    icon: BarChart3,
  },
  {
    name: "Denúncias",
    href: "/admin/reports-management",
    icon: FileText,
  },
  {
    name: "Notificações",
    href: "/admin/notifications",
    icon: Bell,
  },
  {
    name: "Configurações",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r bg-white px-6 pb-4 shadow-sm">
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-lg">Admin</h1>
              <p className="text-gray-500 text-xs">Ecoleta Reform</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col">
          <ul className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul className="-mx-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          "group flex gap-x-3 rounded-md p-2 font-semibold text-sm leading-6 transition-colors",
                          isActive
                            ? "bg-green-50 text-green-700"
                            : "text-gray-700 hover:bg-gray-50 hover:text-green-700",
                        )}
                      >
                        <item.icon
                          className={cn(
                            "h-6 w-6 shrink-0",
                            isActive
                              ? "text-green-700"
                              : "text-gray-400 group-hover:text-green-700",
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
