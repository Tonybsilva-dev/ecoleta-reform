"use client";

import { Building2, Mail, MapPin, Phone } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNotifications } from "@/hooks/useNotifications";
import { useAdminUsersStore } from "@/lib/stores/admin-users.store";

function AdminUsersPageInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { showError, showSuccess, showInfo } = useNotifications();

  const page = Number(params.get("page") ?? "1");
  const pageSize = 10;
  const queryParam = params.get("q") ?? "";

  const {
    users,
    total,
    page: storePage,
    pageSize: storePageSize,
    query,
    loading,
    error,
    isUpdatingId,
    setQuery,
    setPage,
    fetchUsers,
    updateUser,
  } = useAdminUsersStore();

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / pageSize)),
    [total],
  );

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const onSearch = useCallback(() => {
    const sp = new URLSearchParams(params.toString());
    if (query) sp.set("q", query);
    else sp.delete("q");
    sp.set("page", "1");
    router.push(`/admin/users?${sp.toString()}`);
  }, [params, query, router]);

  const load = useCallback(async () => {
    try {
      await fetchUsers();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Erro desconhecido";
      showError("Erro ao carregar usuários", message);
    }
  }, [fetchUsers, showError]);

  // 1) Sincroniza store com URL (sem fetch)
  useEffect(() => {
    if (storePage !== page) setPage(page);
    if (storePageSize !== pageSize) {
      // manter pageSize fixo no store
    }
    if (query !== queryParam) setQuery(queryParam);
  }, [page, queryParam, setPage, setQuery, storePage, storePageSize, query]);

  // 2) Dispara fetch somente quando valores efetivos do store mudarem
  const lastFetchRef = useRef<{ page: number; query: string }>({
    page: -1,
    query: "__",
  });
  useEffect(() => {
    const last = lastFetchRef.current;
    if (last.page === storePage && last.query === query) return;
    lastFetchRef.current = { page: storePage, query };
    void load();
  }, [storePage, query, load]);

  // Debounce de busca (Heurística 7 - eficiência)
  useEffect(() => {
    const t = setTimeout(() => {
      if (query !== queryParam) onSearch();
    }, 300);
    return () => clearTimeout(t);
  }, [query, queryParam, onSearch]);

  // Toast de erro global do store (Heurística 9)
  useEffect(() => {
    if (error) {
      showError("Erro ao carregar/atualizar usuários", error);
    }
  }, [error, showError]);

  const changePage = (next: number) => {
    const sp = new URLSearchParams(params.toString());
    sp.set("page", String(next));
    router.push(`/admin/users?${sp.toString()}`);
  };

  const onUpdateUser = async (
    userId: string,
    updates: Partial<{
      role: "ADMIN" | "MEMBER" | "OWNER" | null;
      isActive: boolean;
    }>,
  ) => {
    try {
      const success = await updateUser(userId, updates);
      if (success) {
        // Heurística 1/9: feedback claro + Undo
        const actionLabel =
          updates.isActive !== undefined
            ? updates.isActive
              ? "reativado"
              : "desativado"
            : updates.role
              ? `role: ${updates.role}`
              : "atualizado";

        // Mostrar toast com Undo para operações de (des)ativação
        if (updates.isActive !== undefined) {
          const prev = !updates.isActive;
          toast.success(`Usuário ${actionLabel}`, {
            description: "Alteração aplicada",
            action: {
              label: "Desfazer",
              onClick: async () => {
                await updateUser(userId, { isActive: prev });
                showInfo("Ação desfeita");
              },
            },
            duration: 5000,
          });
        } else {
          if (updates.role !== undefined) {
            const current = (users.find((x) => x.id === userId)?.profile
              ?.role ?? "MEMBER") as "ADMIN" | "MEMBER" | "OWNER" | null;
            toast.success(`Usuário ${actionLabel}`, {
              description: "Role atualizada",
              action: {
                label: "Desfazer",
                onClick: async () => {
                  await updateUser(userId, { role: current });
                  showInfo("Role revertida");
                },
              },
              duration: 5000,
            });
          } else {
            showSuccess(`Usuário ${actionLabel}`);
          }
        }
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Erro desconhecido";
      showError("Erro ao atualizar usuário", message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h1 className="mb-2 font-bold text-2xl text-gray-900">Usuários</h1>
        <p className="text-gray-600">Gerencie roles e status dos usuários.</p>
      </div>

      {/* Região aria-live para leitores de tela */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {loading
          ? "Carregando usuários"
          : error
            ? `Erro: ${error}`
            : `${total} usuários carregados`}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Input
            placeholder="Buscar por nome ou email"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
          />
          <Button onClick={onSearch} disabled={loading}>
            Buscar
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            {/* Heurística 1: visibilidade do status (carregando/erro/vazio) */}
            {loading ? (
              <div className="space-y-3 p-4">
                {[1, 2, 3, 4, 5].map((n) => (
                  <div
                    key={`sk-${n}`}
                    className="animate-pulse border-b px-4 py-3"
                  >
                    <div className="h-4 w-1/3 rounded bg-gray-200" />
                    <div className="mt-2 h-3 w-1/5 rounded bg-gray-200" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="p-6 text-center">
                <p className="mb-2 text-gray-700">Erro ao carregar usuários</p>
                <p className="mb-4 text-gray-500 text-sm">{error}</p>
                <Button variant="outline" onClick={() => fetchUsers()}>
                  Tentar novamente
                </Button>
              </div>
            ) : users.length === 0 ? (
              <div className="p-10 text-center">
                <p className="mb-2 font-medium text-gray-900 text-lg">
                  Nenhum usuário encontrado
                </p>
                <p className="text-gray-500 text-sm">
                  Ajuste sua busca ou tente novamente mais tarde.
                </p>
              </div>
            ) : (
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-100 text-left text-gray-700 text-sm">
                    <th className="px-4 py-3">Nome</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Tipo</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-t">
                      <td className="px-4 py-3 text-sm">{u.name ?? "-"}</td>
                      <td className="px-4 py-3 text-sm">{u.email}</td>
                      <td className="px-4 py-3 text-sm">
                        <Badge variant="secondary">
                          {u.profile?.userType ?? "CITIZEN"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Select
                          value={
                            (u.profile?.role ?? "MEMBER") as
                              | "ADMIN"
                              | "MEMBER"
                              | "OWNER"
                          }
                          onValueChange={async (
                            val: "ADMIN" | "MEMBER" | "OWNER",
                          ) => {
                            if (val === "ADMIN") {
                              const confirmed = confirm(
                                "Promover para ADMIN concede acesso total. Deseja continuar?",
                              );
                              if (!confirmed) return;
                            }
                            await onUpdateUser(u.id, { role: val });
                          }}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ADMIN">ADMIN</SelectItem>
                            <SelectItem value="OWNER">OWNER</SelectItem>
                            <SelectItem value="MEMBER">MEMBER</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {u.profile?.isActive ? (
                          <Badge className="bg-emerald-200 text-emerald-900 dark:bg-emerald-600 dark:text-emerald-50">
                            Ativo
                          </Badge>
                        ) : (
                          <Badge className="bg-neutral-700 text-neutral-100">
                            Inativo
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              Ações
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUserId(u.id);
                                setDetailsOpen(true);
                              }}
                            >
                              Ver detalhes
                            </DropdownMenuItem>
                            {u.profile?.isActive ? (
                              <DropdownMenuItem
                                onClick={() =>
                                  onUpdateUser(u.id, { isActive: false })
                                }
                              >
                                {isUpdatingId === u.id
                                  ? "Processando..."
                                  : "Desativar"}
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() =>
                                  onUpdateUser(u.id, { isActive: true })
                                }
                              >
                                {isUpdatingId === u.id
                                  ? "Processando..."
                                  : "Reativar"}
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="overflow-hidden p-0 sm:max-w-lg">
          <DialogHeader className="sr-only">
            <DialogTitle>Detalhes do usuário</DialogTitle>
          </DialogHeader>
          {(() => {
            const u = users.find((x) => x.id === selectedUserId);
            if (!u)
              return (
                <div className="px-6 py-6">
                  <p className="text-gray-500 text-sm">
                    Usuário não encontrado
                  </p>
                </div>
              );
            const initials = (u.name || u.email || "U").charAt(0).toUpperCase();
            return (
              <div className="flex flex-col">
                {/* Header com fundo e ação (dots) */}
                <div className="relative h-36 w-full">
                  <div
                    className="absolute inset-0 bg-gradient-to-b from-gray-200 to-gray-100"
                    aria-hidden
                  />
                  {/* Avatar centralizado sobreposto ao header */}
                  <div className="-translate-x-1/2 -translate-y-1/2 absolute top-full left-1/2">
                    <Avatar
                      className={`h-24 w-24 border-5 shadow-md ring-4 ring-white ${u.profile?.isActive ? "border-green-200" : "border-red-200"}`}
                    >
                      <AvatarImage
                        src={u.image ?? undefined}
                        alt={u.name ?? u.email}
                      />
                      <AvatarFallback className="bg-emerald-600 font-semibold text-white">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="px-6 pt-14 pb-6">
                  <div className="text-center">
                    <h3 className="font-semibold text-gray-900 text-xl">
                      {u.name ?? "Usuário"}
                    </h3>
                    <p className="text-gray-500">
                      {u.profile?.role ?? "MEMBER"} ·{" "}
                      {u.profile?.userType ?? "CITIZEN"}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-center gap-2">
                    <Button variant="outline" size="sm" className="w-3/5">
                      Perfil completo
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" className="w-1/5" variant="outline">
                          Actions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {u.profile?.isActive ? (
                          <DropdownMenuItem
                            onClick={() =>
                              onUpdateUser(u.id, { isActive: false })
                            }
                          >
                            Desativar
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() =>
                              onUpdateUser(u.id, { isActive: true })
                            }
                          >
                            Reativar
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Lista de informações */}
                  <div className="mt-6 space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <a
                        href={`mailto:${u.email}`}
                        className="font-medium text-gray-900 underline"
                      >
                        {u.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>—</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>—</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <Building2 className="h-4 w-4 text-gray-400" />
                      <span>{u.profile?.userType ?? "CITIZEN"}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      <div className="flex items-center justify-between">
        <span className="text-gray-600 text-sm">
          Página {page} de {totalPages} — {total} usuários
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={page <= 1 || loading}
            onClick={() => changePage(page - 1)}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            disabled={page >= totalPages || loading}
            onClick={() => changePage(page + 1)}
          >
            Próxima
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  function AdminUsersSkeleton() {
    return (
      <div className="space-y-6 p-4" aria-busy="true" aria-live="polite">
        <div>
          <div className="mb-2 h-7 w-40 rounded bg-gray-200" />
          <div className="flex gap-2">
            <div className="h-10 w-80 rounded bg-gray-200" />
            <div className="h-10 w-28 rounded bg-gray-200" />
          </div>
        </div>
        <div className="rounded-md border">
          {[1, 2, 3, 4, 5, 6].map((rowId) => (
            <div
              key={`row-skel-${rowId}`}
              className="animate-pulse border-b px-4 py-4 last:border-b-0"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-48 rounded bg-gray-200" />
                  <div className="h-3 w-32 rounded bg-gray-200" />
                </div>
                <div className="flex gap-3">
                  <div className="h-8 w-32 rounded bg-gray-200" />
                  <div className="h-8 w-20 rounded bg-gray-200" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <Suspense fallback={<AdminUsersSkeleton />}>
      <AdminUsersPageInner />
    </Suspense>
  );
}
