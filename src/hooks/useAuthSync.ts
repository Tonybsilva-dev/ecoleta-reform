import type { UserType } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useAuthStore } from "@/lib/stores/auth.store";

export function useAuthSync() {
  const { data: session, status } = useSession();
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    setLoading(status === "loading");

    if (session?.user) {
      setUser({
        id: session.user.id,
        email: session.user.email || "",
        name: session.user.name || null,
        image: session.user.image || null,
        hasSelectedRole: session.user.hasSelectedRole || false,
        userType: session.user.userType as UserType,
      });
    } else if (status === "unauthenticated") {
      setUser(null);
    }
  }, [session, status, setUser, setLoading]);

  return { session, status };
}
