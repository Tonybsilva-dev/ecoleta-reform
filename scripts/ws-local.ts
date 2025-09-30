import { type WebSocket, WebSocketServer } from "ws";

const port = Number(process.env.WS_PORT || 4001);
const server = new WebSocketServer({ port });

function safeSend(socket: WebSocket, payload: unknown) {
  try {
    socket.send(JSON.stringify(payload));
  } catch (err) {
    console.error("[ws-local] send error", err);
  }
}

server.on("listening", () => {
  console.log(`[ws-local] listening on ws://localhost:${port}`);
});

server.on("connection", (socket) => {
  console.log("[ws-local] client connected");
  safeSend(socket, { type: "connected" });

  socket.on("message", (raw) => {
    let msg: { type?: string; payload?: unknown } = {};
    try {
      msg = JSON.parse(String(raw));
    } catch {
      console.warn("[ws-local] invalid json, echoing raw");
      safeSend(socket, { type: "error", message: "invalid_json" });
      return;
    }

    if (msg.type === "ping") {
      console.log("[ws-local] <- ping");
      safeSend(socket, { type: "pong" });
      return;
    }

    if (msg.type === "message:send") {
      console.log("[ws-local] <- message:send", msg.payload);
      safeSend(socket, { type: "message:new", payload: msg.payload ?? null });
      return;
    }

    console.log("[ws-local] <- other, sending connected");
    safeSend(socket, { type: "connected" });
  });

  socket.on("close", () => {
    console.log("[ws-local] client disconnected");
  });
});

server.on("error", (err) => {
  console.error("[ws-local] server error", err);
});
