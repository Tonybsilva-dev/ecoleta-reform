# Padrão de Testes

Estrutura sugerida:

- Testes colocalizados ao lado do arquivo alvo:
  - `src/app/(protected)/dashboard/items/page.tsx`
    - `page.spec.tsx` (unit/integration)
    - `page.e2e.ts` (e2e opcional)
- Infra compartilhada em `tests/`:
  - `tests/in-memory/` — cliente Prisma em memória
  - `tests/factory/` — factories de entidades

Execução:

- `npm run test:ci` — roda vitest
- Banco in-memory por padrão. Para forçar DB real:
  - `FORCE_DB_TESTS=true npm run test:ci`
