# Sandbox de WebSocket nativo (Edge) + Fallback local

## Contexto

- Precisávamos testar WebSocket nativo (Edge Runtime) localmente e em produção (Vercel), sem depender de Socket.io.
- Criamos uma página `sandbox` para validar conexão, ping e mensagens, além de um servidor WS local para desenvolvimento rápido.

## Mudanças Principais

- Rota pública `/(public)/sandbox` com UI de testes de WS.
  - Status online/offline
  - Exibe a URL resolvida do WS
  - Botões: Reconnect WS, WS ping, WS message:send
  - Botão "Limpar logs" agora limpa e reconecta imediatamente
- Endpoint Edge `GET /api/ws` utilizando `WebSocketPair` com logs informativos de eventos
- Cliente WS (`src/lib/ws.ts`)
  - Resolve URL automaticamente para `origin/api/ws`
  - Permite override via `NEXT_PUBLIC_WS_URL` (env) ou `window.__NEXT_PUBLIC_WS_URL__` (debug)
- Fallback local para desenvolvimento
  - Script `npm run ws:dev` inicia `ws://localhost:4001` (arquivo `scripts/ws-local.ts`)
  - Em dev, setar `NEXT_PUBLIC_WS_URL=ws://localhost:4001` no `.env.local`
- Scripts adicionais
  - `npm run dev:vercel` (emula Edge Runtime localmente)

## Arquivos Relevantes

- `src/app/(public)/sandbox/page.tsx`
- `src/app/api/ws/route.ts`
- `src/lib/ws.ts`
- `scripts/ws-local.ts`
- `package.json` (scripts: `ws:dev`, `dev:vercel`)

## Como Testar

### Fallback local (rápido)

1. `npm run ws:dev`
2. `.env.local` → `NEXT_PUBLIC_WS_URL=ws://localhost:4001`
3. `npm run dev`
4. Abrir `/sandbox`

### Edge local (sem fallback)

1. Remover/comentar `NEXT_PUBLIC_WS_URL` do `.env.local`
2. `npm run dev:vercel`
3. Abrir `/sandbox` e validar URL `ws://localhost:3000/api/ws`

### Produção (Vercel)

- Não definir `NEXT_PUBLIC_WS_URL`
- Cliente usa `wss://<domínio>/api/ws` automaticamente

## Impacto

- Fluxo de testes de WS confiável em dev e paridade com produção (Edge).
- Código de Socket.io removido para evitar conflitos/confusão.

## Próximos Passos

- Expandir sandbox com casos de negócio (ex.: notifications reais) quando definirmos contratos.

# WebSocket Sandbox & Edge Flow — Atualizações finais

- Removido `src/test/example.test.tsx` para reduzir ruído; ajuste temporário havia sido feito, mas decidimos manter a suíte focada.
- Adicionadas APIs nativas (App Router) para `messages` e `notifications` com validação Zod:
  - `GET/POST /api/messages`
  - `GET/POST /api/notifications`
- Criados serviços frontend de consumo:
  - `src/lib/api/messages.ts`
  - `src/lib/api/notifications.ts`
- Ajustes de tipagem em `tests/in-memory/prisma-mock.ts` (substituindo `any` por `Record/unknown`).
- Testes básicos de validação (400) para as rotas de API.
- QA: testes e type-check verdes; alguns avisos de lint não bloqueantes permanecem em áreas não relacionadas.

# Colocalização de Testes E2E

- Movidos testes de `tests/e2e/` para junto dos módulos:
  - `src/app/(protected)/admin/users/page.e2e.ts`
  - `src/app/(protected)/dashboard/items/[id]/page.e2e.ts`
- Ajustada configuração do Playwright:
  - `testDir: "src"`
  - `testMatch: "**/*.e2e.ts"`
- Removida pasta `tests/e2e/` antiga.
- Benefícios: testes próximos ao código, melhor organização, padrão consistente (.spec para unitários, .e2e para e2e).
