# Implementação de Imagens Base64 no Ecoleta

## Resumo das Mudanças

### 1. Schema do Prisma Atualizado

- Adicionado campo `base64` na tabela `item_images`
- Campo `url` agora é opcional
- Suporte para ambos: URLs e dados base64

### 2. Validação Zod Atualizada

- Novo campo `imageBase64` no schema de criação
- Validação customizada para garantir pelo menos uma imagem
- Suporte para até 5 imagens

### 3. API de Criação de Itens

- Suporte para `imageUrls` (URLs) ou `imageBase64` (base64)
- Processamento automático baseado no tipo de dados
- Logs detalhados para debug

### 4. Componente de Formulário

- Conversão automática de arquivos para base64
- Preview de imagens base64
- Validação de formato

## Como Usar

### Frontend (React)

```typescript
// Converter arquivo para base64
const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Enviar para API
const itemData = {
  title: "Meu Item",
  description: "Descrição do item",
  imageBase64: ["data:image/jpeg;base64,/9j/4AAQ..."], // Array de base64
};
```

### API (Backend)

```typescript
// A API aceita ambos os formatos
const response = await fetch("/api/items", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    // ... outros campos
    imageBase64: ["data:image/jpeg;base64,..."], // Base64
    // OU
    imageUrls: ["/uploads/image.jpg"], // URLs
  }),
});
```

## Vantagens do Base64

- ✅ Não requer upload separado
- ✅ Dados autocontidos
- ✅ Funciona offline
- ✅ Sem dependência de storage externo

## Desvantagens

- ❌ Tamanho maior (~33% overhead)
- ❌ Não otimizado para grandes imagens
- ❌ Pode impactar performance

## Recomendação

Use base64 para:

- Imagens pequenas (< 1MB)
- Prototipagem rápida
- Casos onde não há storage externo

Use URLs para:

- Imagens grandes
- Produção
- Quando há CDN/storage otimizado
