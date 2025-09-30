export interface NotificationPayload {
  userId: string;
  title: string;
  body?: string;
}

export async function fetchNotifications(params: {
  userId: string;
  isRead?: boolean;
  limit?: number;
  offset?: number;
}) {
  const u = new URL("/api/notifications", window.location.origin);
  u.searchParams.set("userId", params.userId);
  if (params.isRead !== undefined)
    u.searchParams.set("isRead", params.isRead ? "true" : "false");
  if (params.limit != null) u.searchParams.set("limit", String(params.limit));
  if (params.offset != null)
    u.searchParams.set("offset", String(params.offset));
  const res = await fetch(u.toString());
  if (!res.ok) throw new Error("fetchNotifications failed");
  return (await res.json()) as { data: unknown[] };
}

export async function createNotification(payload: NotificationPayload) {
  const res = await fetch("/api/notifications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("createNotification failed");
  return (await res.json()) as { data: unknown };
}
