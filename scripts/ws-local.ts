// Simple local WebSocket server for development only
// Usage: npm run ws:dev

import { WebSocketServer } from "ws";

const PORT = Number(process.env.WS_PORT || 4001);
const wss = new WebSocketServer({ port: PORT });

// eslint-disable-next-line no-console
console.log(`[ws-local] listening on ws://localhost:${PORT}`);

wss.on("connection", (socket) => {
  // eslint-disable-next-line no-console
  console.log("[ws-local] client connected");
  socket.send(JSON.stringify({ type: "connected" }));

  socket.on("message", (raw) => {
    try {
      const msg = JSON.parse(String(raw || "{}")) as {
        type?: string;
        payload?: unknown;
      };
      if (msg.type === "ping") {
        socket.send(JSON.stringify({ type: "pong" }));
      } else if (msg.type === "message:send") {
        socket.send(
          JSON.stringify({ type: "message:new", payload: msg.payload ?? null }),
        );
      } else {
        socket.send(JSON.stringify({ type: "connected" }));
      }
    } catch {
      socket.send(JSON.stringify({ type: "error", message: "invalid_json" }));
    }
  });

  socket.on("close", () => {
    // eslint-disable-next-line no-console
    console.log("[ws-local] client disconnected");
  });
});
