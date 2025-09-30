export const runtime = "edge";

// In Edge Runtime, WebSocketPair exists but TypeScript lib doesn't declare it.
// We cast to any to satisfy the type checker while keeping runtime behavior.
export async function GET(_req: Request) {
  // Some platforms may not expose the Upgrade header in dev; let the runtime handle it.

  const pair = new (globalThis as any).WebSocketPair();
  const client = pair[0];
  const server = pair[1];

  server.accept();

  server.addEventListener("message", (event: MessageEvent) => {
    console.log("[ws] message event", event?.data);
    try {
      const msg = JSON.parse(String((event as any).data || "{}")) as {
        type?: string;
        payload?: unknown;
      };
      if (msg.type === "ping") {
        console.log("[ws] <- ping");
        server.send(JSON.stringify({ type: "pong" }));
      } else if (msg.type === "message:send") {
        // echo demo
        console.log("[ws] <- message:send", msg.payload);
        server.send(
          JSON.stringify({ type: "message:new", payload: msg.payload ?? null }),
        );
      } else {
        console.log("[ws] <- other, sending connected");
        server.send(JSON.stringify({ type: "connected" }));
      }
    } catch {
      console.error("[ws] invalid JSON");
      server.send(JSON.stringify({ type: "error", message: "invalid_json" }));
    }
  });

  server.addEventListener("close", () => {
    console.log("[ws] closed");
  });

  console.log("[ws] accepted and sending connected");
  server.send(JSON.stringify({ type: "connected" }));

  return new Response(null, { status: 101, webSocket: client } as any);
}
