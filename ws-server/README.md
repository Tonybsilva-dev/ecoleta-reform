# WS Server (container)

Containeriza o `scripts/ws-local.ts` para provisionar um servidor WebSocket dedicado.

## Opção A: docker-compose com Nginx (recomendado para testes locais)

```bash
# na raiz do projeto
docker compose -f ws-server/docker-compose.yml up --build
# Proxy disponível em http://localhost:8080 (ws://localhost:8080)
```

- O Nginx faz proxy para o serviço `ws` (porta interna 4001) e já lida com `Upgrade/Connection`.
- Para o frontend local, defina:

```bash
export NEXT_PUBLIC_WS_URL=ws://localhost:8080
npm run dev
```

## Opção B: Build & Run direto da imagem

```bash
# build
docker build -t ecoleta-ws ./ws-server

# run local (porta direta, sem proxy)
docker run --rm -p 4001:4001 ecoleta-ws
```

## Produção em servidor próprio

1. Suba ambos serviços ou integre o Nginx do seu host:

- Reverse proxy (Nginx/Caddy) com TLS → exponha `wss://seu-dominio` para o container `ws` porta 4001
- Configure timeouts adequados e cabeçalhos `Upgrade/Connection`

2. No Ecoleta (Vercel):

- Preview/Prod: defina `NEXT_PUBLIC_WS_URL=wss://seu-dominio`
- Faça redeploy e valide na página `/sandbox`

## Deploy (Railway/Render/Fly)

- Faça o deploy da imagem `ecoleta-ws` (ou aponte o repositório com este Dockerfile).
- Exponha a porta 4001 (ou use um proxy HTTPS do provedor para `wss`).
- Anote a URL pública `wss://...`.

## Vercel (feature flag)

- Preview: `NEXT_PUBLIC_WS_URL=wss://<sua-url>`
- Production: `NEXT_PUBLIC_WS_URL` apontando para o mesmo endpoint quando quiser ativar.
