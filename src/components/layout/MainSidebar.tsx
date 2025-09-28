"use client";

import {
  BarChart3,
  Building2,
  Home,
  Leaf,
  LogOut,
  Map as MapIcon,
  Menu,
  Package,
  Plus,
  Settings,
  ShoppingCart,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  description?: string;
}

interface MainSidebarProps {
  className?: string;
}

export function MainSidebar({ className }: MainSidebarProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const userType = session?.user?.userType;
  const userRole = session?.user?.role;

  // Itens de navegação baseados no tipo de usuário
  const getNavigationItems = (): NavigationItem[] => {
    const baseItems: NavigationItem[] = [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: Home,
        description: "Visão geral da sua conta",
      },
      {
        name: "Mapa",
        href: "/map",
        icon: MapIcon,
        description: "Explore itens próximos a você",
      },
      {
        name: "Meus Itens",
        href: "/items",
        icon: Package,
        description: "Gerencie seus itens",
      },
      {
        name: "Criar Item",
        href: "/items/create",
        icon: Plus,
        description: "Adicione um novo item",
      },
    ];

    // Adicionar itens específicos baseados no tipo de usuário
    if (userType === "COMPANY" || userType === "NGO") {
      baseItems.push(
        {
          name: "Organização",
          href: "/organization",
          icon: Building2,
          description: "Gerencie sua organização",
        },
        {
          name: "Membros",
          href: "/organization/members",
          icon: Users,
          description: "Gerencie membros da equipe",
        },
      );
    }

    if (userType === "COLLECTOR") {
      baseItems.push({
        name: "Coletas",
        href: "/collections",
        icon: ShoppingCart,
        description: "Gerencie suas coletas",
      });
    }

    // Adicionar métricas para todos os usuários
    baseItems.push(
      {
        name: "Métricas",
        href: "/metrics",
        icon: BarChart3,
        description: "Acompanhe seu impacto",
      },
      {
        name: "EcoPoints",
        href: "/ecopoints",
        icon: Leaf,
        description: "Seus pontos sustentáveis",
      },
    );

    // Adicionar configurações no final
    baseItems.push({
      name: "Configurações",
      href: "/settings",
      icon: Settings,
      description: "Configurações da conta",
    });

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleMobileMenu}
          className="bg-white shadow-md"
        >
          {isMobileMenuOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 h-full w-full bg-black bg-opacity-50 lg:hidden"
          onClick={toggleMobileMenu}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              toggleMobileMenu();
            }
          }}
          aria-label="Fechar menu"
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform border-gray-200 border-r bg-white transition-transform duration-300 ease-in-out lg:static lg:inset-0 lg:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
          className,
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-gray-200 border-b p-6">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-green-600">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-gray-900 text-xl">Ecoleta</span>
            </div>
          </div>

          {/* User Info */}
          <div className="border-gray-200 border-b p-6">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <span className="font-semibold text-green-600 text-sm">
                  {session?.user?.name?.charAt(0) ||
                    session?.user?.email?.charAt(0) ||
                    "U"}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-gray-900 text-sm">
                  {session?.user?.name || session?.user?.email}
                </p>
                <p className="truncate text-gray-500 text-xs">
                  {userType === "CITIZEN" && "Cidadão"}
                  {userType === "COLLECTOR" && "Coletor"}
                  {userType === "COMPANY" && "Empresa"}
                  {userType === "NGO" && "ONG"}
                  {userRole === "ADMIN" && "Administrador"}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 overflow-y-auto p-4">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "group flex items-center space-x-3 rounded-lg px-3 py-2 font-medium text-sm transition-colors duration-200",
                    isActive(item.href)
                      ? "border border-green-200 bg-green-50 text-green-700"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 flex-shrink-0",
                      isActive(item.href)
                        ? "text-green-600"
                        : "text-gray-400 group-hover:text-gray-600",
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="truncate">{item.name}</span>
                      {item.badge && (
                        <span className="ml-2 rounded-full bg-green-100 px-2 py-1 font-medium text-green-800 text-xs">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="truncate text-gray-500 text-xs">
                        {item.description}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-gray-200 border-t p-4">
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="w-full justify-start text-gray-700 hover:border-red-200 hover:text-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
