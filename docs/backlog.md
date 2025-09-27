| Épico | Task | Subtask | Responsável | Prioridade | Status |
|--------|-------|----------|--------------|-------------|---------|

# 🧱 FASE 1 — MVP (Infra, Auth, Itens, Mapa, Marketplace)

| Setup & Infraestrutura | Criar estrutura base Next.js + DDD | Estruturar pastas /domains, /core, /app | Antonio | Alta | 🔲 |
| Setup & Infraestrutura | Configurar Tailwind + Shadcn | Instalar e gerar tema base | Antonio | Alta | 🔲 |
| Setup & Infraestrutura | Integrar Prisma + Postgres | Definir schema inicial e conectar | Antonio | Alta | 🔲 |
| Setup & Infraestrutura | Configurar Docker + Docker Compose | Postgres, Next, Socket, Redis (futuro) | Antonio | Média | 🔲 |

| Autenticação & Autorização | Configurar Auth.js | Adapter Prisma + rotas /api/auth | Antonio | Alta | 🔲 |
| Autenticação & Autorização | Criar enum de Roles e seeds iniciais | Admin, Citizen, Collector, Company, NGO | Antonio | Alta | 🔲 |
| Autenticação & Autorização | Implementar CASL | Middleware de permissões e abilities | Antonio | Alta | 🔲 |
| Autenticação & Autorização | Formulários de login/signup | react-hook-form + validações zod | Antonio | Média | 🔲 |

| Usuários & Perfis | Criar modelo User/Profile no Prisma | Relacionamento 1:1 + Role | Antonio | Alta | 🔲 |
| Usuários & Perfis | Página de perfil do usuário | UI, upload avatar, dados pessoais | Antonio | Média | 🔲 |
| Usuários & Perfis | Validação e visibilidade pública | toggle PUBLIC/PRIVATE | Antonio | Média | 🔲 |

| Organizações | Criar modelo Organization e OrganizationMember | Company/NGO/Coop + pivot user-org | Antonio | Alta | 🔲 |
| Organizações | Cadastro e listagem de organizações | Formulário + card list + filtros | Antonio | Média | 🔲 |
| Organizações | Validação de membros e permissões | Owner, Manager, Operator | Antonio | Média | 🔲 |

| Materiais & Itens | Criar modelo Material e Item | Campos base + status enum | Antonio | Alta | 🔲 |
| Materiais & Itens | CRUD Material e Item | UI + server actions | Antonio | Alta | 🔲 |
| Materiais & Itens | Upload múltiplo de imagens | item-images + storage local/S3 | Antonio | Média | 🔲 |
| Materiais & Itens | Filtros e pesquisa por tipo de material | Prisma query + debounce | Antonio | Média | 🔲 |

| Marketplace | Criar modelo Order e Payment | Relacionamentos Item ↔ Order ↔ Payment | Antonio | Alta | 🔲 |
| Marketplace | Fluxo de compra/doação | Selecionar item → confirmar → registrar order | Antonio | Alta | 🔲 |
| Marketplace | Histórico de transações | Lista e status de pedidos | Antonio | Média | 🔲 |

| Mapa & Geolocalização | Integrar Leaflet | Exibir pontos de coleta e itens ativos | Antonio | Alta | 🔲 |
| Mapa & Geolocalização | Clusterização e filtros | Distância, tipo de material, status | Antonio | Média | 🔲 |
| Mapa & Geolocalização | Interação mapa ↔ item details | OnClick → modal do item | Antonio | Média | 🔲 |

# 💬 FASE 2 — EXPANSÃO (Comunicação, Reviews, Campanhas, Gamificação)

| Chat & Notificações | Criar modelo Message e Notification | Prisma + enums | Antonio | Alta | 🔲 |
| Chat & Notificações | Implementar Socket.io server | Namespaces /messages /notifications | Antonio | Alta | 🔲 |
| Chat & Notificações | Hooks de realtime no front | Zustand store + useSocket | Antonio | Alta | 🔲 |
| Chat & Notificações | UI chat (listagem + envio) | Shadcn dialog + message bubbles | Antonio | Média | 🔲 |

| Avaliações & Denúncias | Modelo Review e Report | Relacionar com Order e User | Antonio | Alta | 🔲 |
| Avaliações & Denúncias | Formulário de avaliação pós-transação | Rating + comentário | Antonio | Média | 🔲 |
| Avaliações & Denúncias | Sistema de denúncias | Form + listagem admin | Antonio | Média | 🔲 |

| Campanhas & Missões | Modelo Campaign | Organização, objetivo e data limite | Antonio | Alta | 🔲 |
| Campanhas & Missões | CRUD de campanhas | UI, criação, listagem e filtros | Antonio | Média | 🔲 |
| Campanhas & Missões | Integração com dashboard público | Cards + progresso | Antonio | Média | 🔲 |

| Gamificação & Recompensas | Modelo EcoScore, Mission, Badge, RewardLog | Estrutura base | Antonio | Alta | 🔲 |
| Gamificação & Recompensas | Atribuição de pontos e níveis | Bronze → Verde | Antonio | Alta | 🔲 |
| Gamificação & Recompensas | Missões periódicas | Jobs + metas dinâmicas | Antonio | Média | 🔲 |
| Gamificação & Recompensas | Leaderboard público | Ranking por cidade e tipo | Antonio | Média | 🔲 |

# 📊 FASE 3 — MÉTRICAS, DASHBOARD, ADMIN

| Dashboards & Métricas | Modelo Metric | Indicadores ambientais e sociais | Antonio | Alta | 🔲 |
| Dashboards & Métricas | Dashboard de ONG/Empresa | KPIs (volume, CO2, doações) | Antonio | Alta | 🔲 |
| Dashboards & Métricas | Relatórios exportáveis | PDF/CSV | Antonio | Média | 🔲 |

| Painel Administrativo | Gestão global | Users, Items, Reports, Campaigns | Antonio | Alta | 🔲 |
| Painel Administrativo | Controle de permissões CASL | CRUD + atualização dinâmica | Antonio | Média | 🔲 |
| Painel Administrativo | Monitoramento de logs | Activity log básico | Antonio | Média | 🔲 |

| Testes & QA | Configurar Vitest + Playwright | Setup base | Antonio | Alta | 🔲 |
| Testes & QA | Criar testes unitários Auth/Items | Casos críticos | Antonio | Média | 🔲 |
| Testes & QA | Testes e2e com Playwright | Fluxos login, item, order | Antonio | Média | 🔲 |

| Deploy & Observabilidade | Configurar CI/CD no GitHub Actions | Build + Prisma Migrate + Deploy | Antonio | Alta | 🔲 |
| Deploy & Observabilidade | Monitoramento com Pino/Sentry | Logs e erros | Antonio | Média | 🔲 |
| Deploy & Observabilidade | Documentação final (README/Swagger) | Setup + API docs | Antonio | Média | 🔲 |
