const DEFAULT_WS_URL =
  typeof window !== "undefined"
    ? (() => {
        const override =
          (process.env.NEXT_PUBLIC_WS_URL as string | undefined) ||
          ((window as any).__NEXT_PUBLIC_WS_URL__ as string | undefined);
        if (override) return override;
        const url = new URL("/api/ws", window.location.origin);
        url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
        return url.toString();
      })()
    : process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3000/api/ws";

export function getResolvedWsUrl(): string {
  return DEFAULT_WS_URL;
}

export type WsMessage =
  | { type: "connected" }
  | { type: "pong" }
  | { type: "message:new"; payload: unknown }
  | { type: "error"; message: string };

export function createWebSocket(url = DEFAULT_WS_URL): WebSocket {
  const ws = new WebSocket(url);
  return ws;
}

export function sendPing(ws: WebSocket) {
  ws.send(JSON.stringify({ type: "ping" }));
}

export function sendMessage(ws: WebSocket, payload: unknown) {
  ws.send(JSON.stringify({ type: "message:send", payload }));
}
