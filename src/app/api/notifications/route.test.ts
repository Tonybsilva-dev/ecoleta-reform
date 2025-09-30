import { describe, expect, it } from "vitest";
import { GET, POST } from "./route";

function makeReq(url: string, init?: RequestInit) {
  return new Request(url, init) as unknown as import("next/server").NextRequest;
}

describe("/api/notifications", () => {
  it("should 400 on invalid GET query", async () => {
    const res = await GET(makeReq("http://localhost/api/notifications"));
    expect(res.status).toBe(400);
  });

  it("should 400 on invalid POST body", async () => {
    const res = await POST(
      makeReq("http://localhost/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      }),
    );
    expect(res.status).toBe(400);
  });
});
