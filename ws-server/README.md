# WS Server (container)

Containeriza o `scripts/ws-local.ts` para provisionar um servidor WebSocket dedicado.

## Build & Run

```bash
# build
docker build -t ecoleta-ws ./ws-server

# run local
docker run --rm -p 4001:4001 ecoleta-ws
```

## Deploy (ex.: Railway/Render)

- Faça o deploy da imagem `ecoleta-ws` (ou aponte o repositório com este Dockerfile).
- Exponha a porta 4001.
- Anote a URL pública `wss://...`.

## Vercel (feature flag)

- Preview: `NEXT_PUBLIC_WS_URL=wss://<sua-url>`
- Production: não definir (usa Edge quando disponível).
