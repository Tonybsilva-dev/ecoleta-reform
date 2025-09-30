export interface MessagePayload {
  senderId: string;
  recipientId: string;
  content: string;
}

export async function fetchMessages(params: {
  userId: string;
  scope?: "received" | "sent";
  limit?: number;
  offset?: number;
}) {
  const u = new URL("/api/messages", window.location.origin);
  u.searchParams.set("userId", params.userId);
  if (params.scope) u.searchParams.set("with", params.scope);
  if (params.limit != null) u.searchParams.set("limit", String(params.limit));
  if (params.offset != null)
    u.searchParams.set("offset", String(params.offset));
  const res = await fetch(u.toString());
  if (!res.ok) throw new Error("fetchMessages failed");
  return (await res.json()) as { data: unknown[] };
}

export async function createMessage(payload: MessagePayload) {
  const res = await fetch("/api/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("createMessage failed");
  return (await res.json()) as { data: unknown };
}
