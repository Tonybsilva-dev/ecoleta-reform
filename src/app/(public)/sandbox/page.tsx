"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  createWebSocket,
  getResolvedWsUrl,
  sendMessage,
  sendPing,
} from "@/lib/ws";

export default function SandboxPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [wsOpen, setWsOpen] = useState(false);

  // Native WS setup
  useEffect(() => {
    const instance = createWebSocket();
    setWs(instance);
    const push = (line: string) =>
      setLogs((prev) =>
        [`${new Date().toLocaleTimeString()} | WS ${line}`, ...prev].slice(
          0,
          200,
        ),
      );
    const onOpen = () => {
      setWsOpen(true);
      push("open");
    };
    const onClose = () => {
      setWsOpen(false);
      push("close");
    };
    const onMessage = (e: MessageEvent) => push(String(e.data));
    instance.addEventListener("open", onOpen);
    instance.addEventListener("close", onClose);
    instance.addEventListener("message", onMessage);
    return () => {
      instance.removeEventListener("open", onOpen);
      instance.removeEventListener("close", onClose);
      instance.removeEventListener("message", onMessage);
      instance.close();
    };
  }, []);

  const sioPing = () => undefined;
  const sioSend = () => undefined;
  const clear = () => {
    setLogs([]);
    try {
      ws?.close();
    } catch {}
    const next = createWebSocket();
    setWs(next);
    next.addEventListener("open", () => setWsOpen(true));
    next.addEventListener("close", () => setWsOpen(false));
  };
  const reconnect = () => {
    try {
      ws?.close();
    } catch {}
    const next = createWebSocket();
    setWs(next);
    setLogs((prev) => ["reconnecting...", ...prev]);
    next.addEventListener("open", () => setWsOpen(true));
    next.addEventListener("close", () => setWsOpen(false));
  };
  const wsPing = () => {
    if (ws && ws.readyState === WebSocket.OPEN) sendPing(ws);
  };
  const wsSend = () => {
    if (ws && ws.readyState === WebSocket.OPEN)
      sendMessage(ws, { text: "hello from WS" });
  };

  return (
    <div className="container mx-auto space-y-6 px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Sandbox</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <span className="text-sm">Socket status: </span>
            <span className={wsOpen ? "text-green-600" : "text-gray-500"}>
              {wsOpen ? "online" : "offline"}
            </span>
            <span className="text-muted-foreground text-xs">
              URL: {getResolvedWsUrl()}
            </span>
            <Button size="sm" onClick={sioPing} disabled>
              Enviar ping
            </Button>
            <Button size="sm" variant="outline" onClick={sioSend} disabled>
              Enviar message:send
            </Button>
            <Button size="sm" variant="secondary" onClick={clear}>
              Limpar logs
            </Button>
            <div className="ml-auto flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={reconnect}>
                Reconnect WS
              </Button>
              <Button size="sm" variant="secondary" onClick={wsPing}>
                WS ping
              </Button>
              <Button size="sm" variant="secondary" onClick={wsSend}>
                WS message:send
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-[400px] space-y-1 overflow-auto font-mono text-sm">
            {logs.length === 0 ? (
              <div className="text-muted-foreground">Sem eventos ainda.</div>
            ) : (
              logs.map((l) => <div key={`${l}`}>{l}</div>)
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
