# 1. Objetivo do Sistema

Criar uma plataforma digital de gestão e marketplace sustentável, onde cidadãos, cooperativas, empresas e ONGs interagem para promover a coleta, reciclagem, compra e doação de resíduos.

## Funcionalidades do Sistema

- **Mapeamento georreferenciado** de pontos de coleta e transações.
- **Marketplace completo** (compra, venda e doações).
- **Gamificação e incentivos ambientais** para engajar cidadãos e coletores.
- **Painéis de métricas e impacto** para ONGs e empresas parceiras.
- **Comunicação em tempo real** entre usuários (chat, notificações).
- **Controle de permissões e papéis** (Admin, Seller, Buyer, Collector, NGO, Company).

2. Papéis e Atores do Sistema

| Papel                  | Descrição                                                                 | Permissões principais                                           |
| ---------------------- | ------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Administrador (Admin)  | Superusuário responsável por gerenciar todo o sistema                     | Gerenciar usuários, entidades, denúncias, categorias, políticas |
| Empresa (Company)      | Cadastra pontos de coleta, vende materiais, acompanha métricas ambientais | Gerenciar equipe, cadastrar itens, ver dashboard de métricas    |
| ONG / Parceiro (NGO)   | Recebe doações, promove campanhas, monitora impacto                       | Gerenciar campanhas, visualizar impacto ambiental, relatórios   |
| Coletor (Collector)    | Coleta materiais, realiza entregas, ganha pontos                          | Atualizar status de coletas, receber recompensas                |
| Cidadão (User / Buyer) | Usuário comum que doa, compra ou vende materiais recicláveis              | Cadastrar doações, realizar pedidos, participar de missões      |
| Visitante (Guest)      | Pode navegar e visualizar pontos de coleta                                | Visualização limitada, sem transações                           |

## 3. Módulos Principais

### 3.1. Autenticação e Autorização

- Login, cadastro e redefinição de senha
- Integração com OAuth (Google, Facebook, Gov.br)
- Middleware de permissões usando CASL
- RBAC: papéis definidos com granularidade de domínio (por módulo)
- Sessões seguras (JWT + cookies httpOnly)
- Suporte a MFA opcional (Auth.js extensível)

---

### 3.2. Mapa e Geolocalização

- Baseado em Leaflet
- Renderiza pontos de coleta, itens disponíveis, empresas e ONGs
- Filtros: tipo de material, distância, status (ativo, inativo), tipo de operação (compra/doação)
- Clusters automáticos para exibir densidade
- Dados alimentados via Prisma → PostGIS (extensão geoespacial do Postgres)

---

### 3.3. Materiais e Itens

- CRUD completo de materiais e categorias (papel, vidro, metal, eletrônico, etc.)
- Cada item possui:
  - Localização (coordenadas)
  - Quantidade / unidade de medida
  - Tipo (venda, doação, coleta)
  - Fotos e descrição
  - Status (ativo, reservado, vendido, coletado)
- Sistema de bids/lances ou match direto (comprador–vendedor)

---

### 3.4. Marketplace e Transações

- Itens podem ser vendidos, comprados ou doados
- Pedidos (Orders) registram transações e status logístico
- Pagamentos (Payments) simulados inicialmente; integração futura com Stripe/Pix
- Histórico de operações armazenado por usuário e organização
- Possibilidade de doação direta para ONG (com rastreamento do impacto)

---

### 3.5. Comunicação e Realtime

- Socket.io como camada de eventos em tempo real
- Recursos:
  - Mensagens diretas (chat comprador ↔ vendedor/coletor)
  - Notificações instantâneas (novas mensagens, bids, aprovações)
  - Atualização automática de status de pedidos
  - Sistema de alertas de coletas agendadas
  - Logs e auditoria de mensagens (retenção mínima de 90 dias)

---

### 3.6. Métricas e Painéis (Empresas / ONGs)

- Dashboard analítico com:
  - Volume total coletado por tipo de material
  - Quantidade de doações recebidas
  - Emissão de CO₂ evitada (calculada a partir de pesos)
  - Impacto social (número de coletas, parceiros, campanhas ativas)
  - Ranking de coletores e cidadãos
  - Exportação de relatórios (PDF, CSV)
  - API interna para integração com órgãos públicos (licenciamento futuro)

---

### 3.7. Gamificação e Incentivos

- Sistema de EcoPoints (pontuação baseada em ações sustentáveis):
  - Coletar, doar, participar de campanhas
  - Converter pontos em recompensas (descontos, produtos, badges)
- Níveis de usuário: Bronze, Prata, Ouro, Verde
- Missões sustentáveis: desafios temporários (ex: “colete 5kg de plástico esta semana”)
- Leaderboard global por cidade e tipo de usuário
- Certificados ambientais digitais (para ONGs e empresas com impacto relevante)

---

### 3.8. Avaliações e Reputação

- Usuários podem avaliar transações (1–5 estrelas + comentário)
- Avaliação impacta o eco-score do perfil
- ONGs e empresas possuem perfil público verificado
- Moderadores podem revisar avaliações suspeitas

---

### 3.9. Administração (Backoffice)

- Gerenciar usuários, entidades, categorias e denúncias
- Painel de controle geral:
  - Atividades recentes
  - Métricas globais do sistema
  - Monitoramento de coletas, transações e mensagens
- Acesso exclusivo (role: ADMIN)

## 4. Requisitos Não Funcionais

| Categoria           | Especificação                                                       |
| ------------------- | ------------------------------------------------------------------- |
| Arquitetura         | DDD modular + App Router (Next.js 14+)                              |
| Banco de dados      | PostgreSQL com Prisma ORM e extensão PostGIS                        |
| Realtime            | Socket.io, namespaces /messages e /notifications                    |
| Segurança           | JWT + CASL RBAC + sanitização + CSP headers                         |
| Performance         | SSR/ISR híbrido, cache incremental e otimização de consultas Prisma |
| Disponibilidade     | Deploy Docker + Vercel/Railway, com readiness check                 |
| Observabilidade     | Logs estruturados (Pino), Sentry e monitoramento básico             |
| Testes              | Vitest (unitário), Playwright (e2e), mocks no Jest se necessário    |
| Internacionalização | Multi-idioma (PT-BR/EN) via next-intl                               |
| Documentação        | Storybook para componentes + Swagger/OpenAPI para rotas API         |
| Acessibilidade      | Conformidade com WCAG 2.1 AA                                        |

## 5. Modelo Conceitual — Entidades e Relacionamentos (Prisma-level)

### 5.1. Entidades Principais

- **User**
- **Organization** (Company/NGO)
- **Material**
- **Item**
- **Order**
- **Payment**
- **Message**
- **Notification**
- **Review**
- **Badge / Mission**
- **EcoScore / Reward**
- **Report** (denúncias)

### 5.2. Relacionamentos

| Entidade     | Relacionamentos                                                                        |
| ------------ | -------------------------------------------------------------------------------------- |
| User         | 1:1 Profile • 1:N Items • 1:N Orders • 1:N Reviews • N:M Organizations (colaboradores) |
| Organization | 1:N Items • 1:N Metrics • 1:N Members (Users)                                          |
| Material     | 1:N Items                                                                              |
| Item         | 1:1 Material • 1:N Bids • 1:N Orders • N:M Images                                      |
| Order        | 1:1 Payment • N:1 Buyer (User) • N:1 Seller (User/Org)                                 |
| Payment      | 1:1 Order                                                                              |
| Message      | N:1 Sender (User) • N:1 Receiver (User/Org) • opcionalmente 1:1 Item                   |
| Notification | N:1 User • tipo: message / bid / system / campaign                                     |
| Review       | N:1 Reviewer (User) • N:1 Target (User/Org) • N:1 Order                                |
| Mission      | N:M Users (participantes)                                                              |
| Badge        | N:M Users (recompensas)                                                                |
| Metric       | N:1 Organization (dados agregados)                                                     |
| Report       | N:1 Reporter (User) • N:1 Target (User/Item)                                           |

### 5.3. Métricas Ambientais (dados agregados)

Cada **Organization** terá métricas calculadas periodicamente:

- `totalMaterialsCollected`
- `totalCO2Saved`
- `donationsReceived`
- `transactionsCompleted`
- `campaignsActive`
- `ecoScoreAverage`
- `updatedAt`

Esses dados alimentam o **dashboard de impacto**.

### 5.4. Gameficação e EcoPoints

| Entidade  | Atributos principais                  | Descrição                     |
| --------- | ------------------------------------- | ----------------------------- |
| EcoScore  | points, level, userId, lastActivity   | Representa o score do usuário |
| Mission   | title, goalType, goalValue, expiresAt | Desafios de reciclagem        |
| Badge     | name, icon, criteria                  | Recompensa visual             |
| RewardLog | userId, missionId, pointsEarned, date | Histórico de ganhos           |

## 6. Fluxos Chave (Operacionais)

### 6.1. Cidadão

1. Cria conta e completa o perfil.
2. Visualiza o mapa e localiza ponto de coleta.
3. Cadastra um item para doação.
4. Recebe contato e entrega o item.
5. Ganha pontos e sobe no ranking.

### 6.2. Coletor

1. Se cadastra como Coletor.
2. Recebe solicitações próximas.
3. Atualiza status da coleta em tempo real.
4. Recebe feedback e pontos adicionais.

### 6.3. ONG / Empresa

1. Cadastra organização.
2. Publica campanhas de coleta.
3. Recebe doações e materiais.
4. Visualiza métricas no dashboard.
5. Emite certificados de impacto.

## Esquema conceitual - PRISMA ORM

## 1. Usuários e Autenticação

### User

Representa qualquer pessoa física que utiliza a plataforma.

**Campos:**

- `id`: identificador único (UUID)
- `name`: nome completo
- `email`: único, obrigatório
- `passwordHash`: hash da senha (ou nulo se usar OAuth)
- `avatarUrl`: imagem do usuário
- `role`: enum (`ADMIN`, `CITIZEN`, `COLLECTOR`, `COMPANY_MEMBER`, `NGO_MEMBER`)
- `ecoScoreId`: FK para tabela de gamificação
- `createdAt`, `updatedAt`: timestamps

**Relacionamentos:**

- 1:1 com **Profile**
- 1:N com **Item** (criados ou listados)
- 1:N com **Order** (como comprador)
- 1:N com **Review** (como autor)
- N:M com **Organization** (pode pertencer a várias organizações)
- 1:N com **Message** (enviadas e recebidas)
- 1:N com **Notification**
- 1:N com **Report** (denúncias feitas)

---

### Profile

Informações complementares do usuário.

**Campos:**

- `id`
- `userId`
- `bio`
- `phone`
- `location`: cidade/estado
- `latitude`, `longitude`
- `verified`: boolean (perfil validado)
- `visibility`: enum (`PUBLIC`, `PRIVATE`)
- `language`: idioma preferencial
- `theme`: preferências visuais
- `createdAt`, `updatedAt`

---

### Session / Account (Auth.js padrão)

Para login social e persistência.

- **Session** vincula tokens JWT.
- **Account** guarda provedores OAuth (Google, Facebook, etc.).

---

## 2. Organizações

### Organization

Entidade que representa empresas, cooperativas ou ONGs.

**Campos:**

- `id`
- `name`
- `slug`
- `description`
- `type`: enum (`COMPANY`, `NGO`, `COOPERATIVE`)
- `logoUrl`
- `email`
- `phone`
- `address`
- `latitude`, `longitude`
- `verified`: boolean
- `impactScore`: indicador de reputação ambiental
- `createdAt`, `updatedAt`

**Relacionamentos:**

- N:M com **User** (membros)
- 1:N com **Item** (itens cadastrados)
- 1:N com **Metric** (métricas de impacto)
- 1:N com **Campaign**
- 1:N com **Review** (avaliações recebidas)
- 1:N com **Report** (denúncias)
- 1:N com **Order** (vendas realizadas)

---

### OrganizationMember

Tabela pivot N:M entre User e Organization.

**Campos:**

- `userId`
- `organizationId`
- `role`: enum (`OWNER`, `MANAGER`, `OPERATOR`)
- `joinedAt`

---

## 3. Materiais e Itens

### Material

Catálogo base dos tipos de resíduos recicláveis.

**Campos:**

- `id`
- `name`: ex: “Plástico”, “Metal”
- `description`
- `icon`
- `color`
- `unit`: ex: “kg”, “unidade”
- `recycleValue`: valor médio de reciclagem (monetário ou em eco-pontos)
- `createdAt`, `updatedAt`

**Relacionamentos:**

- 1:N com **Item**

---

### Item

Registro individual de um material disponível.

**Campos:**

- `id`
- `userId`: dono ou vendedor
- `organizationId`: opcional (empresa dona)
- `materialId`
- `title`
- `description`
- `quantity`
- `unit`
- `price`
- `type`: enum (`SALE`, `DONATION`, `COLLECTION`)
- `status`: enum (`ACTIVE`, `RESERVED`, `SOLD`, `COLLECTED`, `INACTIVE`)
- `latitude`, `longitude`
- `city`, `state`
- `thumbnailUrl`
- `createdAt`, `updatedAt`

**Relacionamentos:**

- N:1 com **Material**
- N:1 com **User**
- N:1 com **Organization**
- 1:N com **Order**
- 1:N com **Bid**
- 1:N com **Message**
- 1:N com **ItemImage**

---

### ItemImage

Imagens adicionais do item.

**Campos:**

- `id`
- `itemId`
- `url`
- `isPrimary`
- `uploadedAt`

---

### Bid / Offer

Propostas feitas em itens de venda ou leilão.

**Campos:**

- `id`
- `itemId`
- `userId`
- `amount`
- `status`: enum (`PENDING`, `ACCEPTED`, `REJECTED`)
- `createdAt`, `updatedAt`

---

## 4. Transações e Pagamentos

### Order

Representa uma transação de venda, doação ou coleta.

**Campos:**

- `id`
- `buyerId`
- `sellerId` (User ou Organization)
- `itemId`
- `quantity`
- `totalPrice`
- `type`: enum (`SALE`, `DONATION`, `COLLECTION`)
- `status`: enum (`PENDING`, `PAID`, `DELIVERED`, `CANCELLED`, `COMPLETED`)
- `createdAt`, `updatedAt`

**Relacionamentos:**

- 1:1 com **Payment**
- 1:N com **Review**

---

### Payment

Informações financeiras associadas à transação.

**Campos:**

- `id`
- `orderId`
- `method`: enum (`PIX`, `CREDIT_CARD`, `CASH`, `OTHER`)
- `status`: enum (`WAITING`, `PAID`, `REFUNDED`, `FAILED`)
- `transactionId`
- `paidAt`, `createdAt`

---

## 5. Comunicação

### Message

Mensagens trocadas entre usuários e organizações.

**Campos:**

- `id`
- `senderId`
- `receiverId`
- `itemId` (opcional)
- `content`
- `type`: enum (`TEXT`, `IMAGE`, `SYSTEM`)
- `read`: boolean
- `createdAt`

**Relacionamentos:**

- N:1 com **User** (sender)
- N:1 com **User** (receiver)
- N:1 com **Item**

---

### Notification

Alertas enviados ao usuário.

**Campos:**

- `id`
- `userId`
- `type`: enum (`MESSAGE`, `BID`, `ORDER`, `SYSTEM`, `CAMPAIGN`)
- `title`
- `body`
- `read`: boolean
- `createdAt`

---

## 6. Avaliações e Relatórios

### Review

Avaliação de transações, usuários ou organizações.

**Campos:**

- `id`
- `authorId`
- `targetUserId` (ou `organizationId`)
- `orderId`
- `rating`: inteiro (1–5)
- `comment`
- `createdAt`

---

### Report

Denúncias de usuários, fraudes ou itens.

**Campos:**

- `id`
- `reporterId`
- `targetType`: enum (`USER`, `ITEM`, `ORGANIZATION`)
- `targetId`
- `reason`
- `status`: enum (`OPEN`, `RESOLVED`, `DISMISSED`)
- `createdAt`, `resolvedAt`

---

## 7. Campanhas e Métricas

### Campaign

Campanhas criadas por empresas/ONGs.

**Campos:**

- `id`
- `organizationId`
- `title`
- `description`
- `imageUrl`
- `goal`: ex: “500kg de plástico”
- `goalType`: enum (`WEIGHT`, `QUANTITY`, `DONATIONS`)
- `startDate`, `endDate`
- `status`: enum (`ACTIVE`, `COMPLETED`, `CANCELLED`)
- `createdAt`, `updatedAt`

---

### Metric

Indicadores ambientais e sociais das organizações.

**Campos:**

- `id`
- `organizationId`
- `totalMaterialsCollected`
- `totalCO2Saved` (kg)
- `donationsReceived`
- `transactionsCompleted`
- `campaignsActive`
- `ecoScoreAverage`
- `updatedAt`

---

## 8. Gamificação e Incentivos

### EcoScore

Pontuação acumulada do usuário.

**Campos:**

- `id`
- `userId`
- `points`
- `level`: enum (`BRONZE`, `SILVER`, `GOLD`, `GREEN`)
- `lastActivity`
- `createdAt`, `updatedAt`

---

### Mission

Missões ambientais disponíveis.

**Campos:**

- `id`
- `title`
- `description`
- `goalType`: enum (`COLLECT`, `DONATE`, `PURCHASE`, `CAMPAIGN`)
- `goalValue`
- `pointsReward`
- `expiresAt`
- `createdAt`

**Relacionamentos:**

- N:M com **User** (participantes)
- 1:N com **RewardLog**

---

### Badge

Recompensas visuais concedidas ao usuário.

**Campos:**

- `id`
- `name`
- `icon`
- `criteria`: descrição textual da conquista
- `createdAt`

**Relacionamentos:**

- N:M com **User**

---

### RewardLog

Histórico das recompensas e pontos ganhos.

**Campos:**

- `id`
- `userId`
- `missionId`
- `pointsEarned`
- `createdAt`

---

## 9. Estrutura Relacional Global

- **User** ↔ **Organization** — N:M via OrganizationMember
- **Organization** ↔ **Item** — 1:N
- **User** ↔ **Item** — 1:N (criação)
- **Item** ↔ **Order** ↔ **Payment** — 1:1
- **User** ↔ **Message** — N:1
- **User** ↔ **Notification** — 1:N
- **Organization** ↔ **Metric** — 1:N
- **User** ↔ **Mission** / **Badge** — N:M
- **User** ↔ **Review** ↔ **Order** — 1:N
- **Organization** ↔ **Campaign** — 1:N
- **Campaign** ↔ **User** (participantes) — N:M (futuro opcional)

---

## 10. Observações Técnicas

- Todos os `id` serão UUID.
- `createdAt` / `updatedAt` obrigatórios em todas as tabelas.
- Campos geográficos (`latitude`, `longitude`) devem usar PostGIS POINT.
- Tipos enum serão gerados no Prisma e replicados para CASL.
- Regras de autorização baseadas em role e ownership.
- Tabelas de auditoria futuras: `AuditLog` (para admins).
