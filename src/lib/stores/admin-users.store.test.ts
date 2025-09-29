import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { type AdminUserRow, useAdminUsersStore } from "./admin-users.store";

function setUsers(users: AdminUserRow[]) {
  useAdminUsersStore.setState({
    users,
    total: users.length,
    error: null,
    isUpdatingId: null,
  });
}

describe("admin-users.store (optimistic updates)", () => {
  const user: AdminUserRow = {
    id: "u1",
    name: "User One",
    email: "user1@example.com",
    image: null,
    createdAt: new Date().toISOString(),
    profile: { role: "MEMBER", userType: "CITIZEN", isActive: true },
  };

  beforeEach(() => {
    // reset store state
    useAdminUsersStore.setState({
      users: [],
      total: 0,
      page: 1,
      pageSize: 10,
      query: "",
      loading: false,
      error: null,
      isUpdatingId: null,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should optimistically toggle isActive and keep state on success", async () => {
    setUsers([user]);
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue({ ok: true, json: async () => ({ success: true }) }),
    );

    const store = useAdminUsersStore;
    const { updateUser } = store.getState();
    await updateUser("u1", { isActive: false });

    const state = store.getState();
    expect(state.users.length).toBe(1);
    const u = state.users.find((x) => x.id === "u1");
    expect(u?.profile?.isActive).toBe(false);
    expect(state.isUpdatingId).toBeNull();
    expect(state.error).toBeNull();
  });

  it("should revert state on failure and set error", async () => {
    setUsers([user]);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, json: async () => ({}) }),
    );

    const store = useAdminUsersStore;
    const { updateUser } = store.getState();
    await updateUser("u1", { isActive: false });

    const state = store.getState();
    expect(state.users.length).toBe(1);
    const u = state.users.find((x) => x.id === "u1");
    expect(u?.profile?.isActive).toBe(true); // reverted
    expect(state.error).toBeTruthy();
    expect(state.isUpdatingId).toBeNull();
  });
});
