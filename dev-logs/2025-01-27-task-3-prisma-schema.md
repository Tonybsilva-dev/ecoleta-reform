# Log de Desenvolvimento - Tarefa 3: Schema Inicial do Prisma

**Data:** 27 de Janeiro de 2025  
**Tarefa:** Integrate Prisma ORM and Generate Initial Schema  
**Status:** ✅ CONCLUÍDA  

## Contexto

Implementação do schema inicial do Prisma com todos os modelos principais do Ecoleta, incluindo enums, relacionamentos complexos e integração com PostGIS para funcionalidades geoespaciais.

## Mudanças Implementadas

### 1. Enums Definidos

- ✅ **Role**: ADMIN, MEMBER, OWNER (para membros de organizações)
- ✅ **UserType**: CITIZEN, COLLECTOR, COMPANY, NGO (tipos de usuário)
- ✅ **ItemStatus**: ACTIVE, INACTIVE, SOLD, DONATED, COLLECTED
- ✅ **OrderStatus**: PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED
- ✅ **PaymentStatus**: PENDING, PAID, FAILED, REFUNDED

### 2. Modelos Principais

- ✅ **User**: Autenticação e dados básicos
- ✅ **Profile**: Informações pessoais e tipo de usuário
- ✅ **Organization**: Empresas e ONGs
- ✅ **Member**: Relacionamento many-to-many entre User e Organization
- ✅ **Point**: Pontos de coleta com geolocalização PostGIS
- ✅ **Item**: Materiais/itens para venda/doação/coleta

### 3. Modelos de Transação

- ✅ **Order**: Pedidos de compra/coleta
- ✅ **Payment**: Pagamentos e transações
- ✅ **Review**: Sistema de avaliações entre usuários
- ✅ **PointItem**: Relacionamento many-to-many entre Point e Item

### 4. Funcionalidades Geoespaciais

- ✅ **PostGIS Integration**: Campo `location` com tipo `geography(Point, 4326)`
- ✅ **Geolocalização**: Pontos de coleta com coordenadas precisas
- ✅ **Extensão Habilitada**: PostGIS configurado no schema

## Estrutura do Schema

### Enums

```prisma
enum Role {
  ADMIN
  MEMBER
  OWNER
}

enum UserType {
  CITIZEN
  COLLECTOR
  COMPANY
  NGO
}

enum ItemStatus {
  ACTIVE
  INACTIVE
  SOLD
  DONATED
  COLLECTED
}

enum OrderStatus {
  PENDING
  CONFIRMED
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

enum PaymentStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
}
```

### Modelos Principais

#### User & Profile

```prisma
model User {
  id           String   @id @default(cuid())
  email        String   @unique
  password     String?
  emailVerified DateTime?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  profile      Profile?
  memberships  Member[]
  createdItems Item[]
  orders       Order[]
  reviewerReviews Review[] @relation("ReviewerReviews")
  revieweeReviews Review[] @relation("RevieweeReviews")
}

model Profile {
  id        String   @id @default(cuid())
  name      String
  avatarUrl String?
  bio       String?
  phone     String?
  userType  UserType @default(CITIZEN)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  userId String @unique
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

#### Organization & Member

```prisma
model Organization {
  id          String   @id @default(cuid())
  name        String
  description String?
  website     String?
  logoUrl     String?
  domain      String?  @unique
  verified    Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  members Member[]
  points  Point[]
  items   Item[]
}

model Member {
  id             String   @id @default(cuid())
  role           Role     @default(MEMBER)
  joinedAt       DateTime @default(now())
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  userId         String
  organizationId String
  user           User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  @@unique([userId, organizationId])
}
```

#### Point (Geolocalização)

```prisma
model Point {
  id           String   @id @default(cuid())
  name         String
  description  String?
  address      String
  location     Unsupported("geography(Point, 4326)")
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  pointItems     PointItem[]
}
```

#### Item & Transações

```prisma
model Item {
  id          String     @id @default(cuid())
  title       String
  description String?
  imageUrl    String?
  status      ItemStatus @default(ACTIVE)
  price       Decimal?   @db.Decimal(10, 2)
  quantity    Int        @default(1)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  createdById String
  createdBy   User @relation(fields: [createdById], references: [id], onDelete: Cascade)
  
  organizationId String?
  organization   Organization? @relation(fields: [organizationId], references: [id], onDelete: SetNull)
  
  pointItems PointItem[]
  orders     Order[]
}

model Order {
  id          String      @id @default(cuid())
  status      OrderStatus @default(PENDING)
  totalAmount Decimal?    @db.Decimal(10, 2)
  notes       String?
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  userId  String
  itemId  String
  user    User @relation(fields: [userId], references: [id], onDelete: Cascade)
  item    Item @relation(fields: [itemId], references: [id], onDelete: Cascade)
  
  payment Payment?
}

model Payment {
  id            String        @id @default(cuid())
  amount        Decimal       @db.Decimal(10, 2)
  status        PaymentStatus @default(PENDING)
  paymentMethod String?
  transactionId String?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  orderId String @unique
  order   Order  @relation(fields: [orderId], references: [id], onDelete: Cascade)
}

model Review {
  id        String   @id @default(cuid())
  rating    Int      @db.SmallInt
  comment   String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  reviewerId String
  revieweeId String
  reviewer   User @relation("ReviewerReviews", fields: [reviewerId], references: [id], onDelete: Cascade)
  reviewee   User @relation("RevieweeReviews", fields: [revieweeId], references: [id], onDelete: Cascade)

  @@unique([reviewerId, revieweeId])
}
```

## Relacionamentos Implementados

### 1. User ↔ Profile (1:1)

- Um usuário tem um perfil
- Relacionamento obrigatório com `onDelete: Cascade`

### 2. User ↔ Organization (Many-to-Many via Member)

- Usuários podem pertencer a múltiplas organizações
- Tabela de junção `Member` com roles específicos
- Constraint único para evitar duplicatas

### 3. Organization ↔ Point (1:Many)

- Uma organização pode ter múltiplos pontos de coleta
- Pontos pertencem a uma organização específica

### 4. Point ↔ Item (Many-to-Many via PointItem)

- Pontos podem aceitar múltiplos tipos de itens
- Itens podem ser aceitos em múltiplos pontos
- Tabela de junção `PointItem`

### 5. User ↔ Item (1:Many)

- Usuários podem criar múltiplos itens
- Itens pertencem ao usuário que os criou

### 6. User ↔ Order (1:Many)

- Usuários podem fazer múltiplos pedidos
- Pedidos pertencem ao usuário que os fez

### 7. Order ↔ Payment (1:1)

- Cada pedido pode ter um pagamento
- Relacionamento obrigatório

### 8. User ↔ Review (Many-to-Many)

- Usuários podem avaliar outros usuários
- Relacionamento bidirecional com nomes explícitos
- Constraint único para evitar múltiplas avaliações

## Verificações Realizadas

- ✅ Schema validado com `npx prisma validate`
- ✅ Cliente Prisma gerado com sucesso
- ✅ Schema sincronizado com NeonDB via `npx prisma db push`
- ✅ Pipeline de QA executado com sucesso
- ✅ TypeScript check passou sem erros
- ✅ Linting e formatação aplicados
- ✅ Testes unitários executados com sucesso

## Próximos Passos

A Tarefa 3 está **100% concluída**. A próxima tarefa será a **Tarefa 4: "Define User and Profile Models in Prisma Schema"**, que já pode ser iniciada pois a dependência (Tarefa 3) foi satisfeita.

## Impacto

- **Banco de dados**: Schema completo implementado
- **PostGIS**: Funcionalidades geoespaciais habilitadas
- **Relacionamentos**: Estrutura complexa de dados definida
- **Desenvolvimento**: Base sólida para implementação das funcionalidades

## Comandos Úteis

```bash
# Validar schema
npx prisma validate

# Gerar cliente Prisma
npx prisma generate

# Sincronizar com banco
npx prisma db push

# Abrir Prisma Studio
npx prisma studio

# Executar migrações (quando necessário)
npx prisma migrate dev
```

---

**Desenvolvido por:** Tonybsilva-dev  
**Revisado em:** 27/01/2025  
**Status:** ✅ Concluído
