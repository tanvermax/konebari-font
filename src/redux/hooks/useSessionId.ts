// hooks/useSessionId.ts
import { useMemo } from "react";
import { getSessionId } from "@/lib/guestStorage";
import { useAppSelector } from "@/redux/hook";

export const useSessionId = () => {
  const user = useAppSelector((state) => state.auth.user);
  const sessionId = useMemo(() => getSessionId(), []);
  const isLoggedIn = !!user;

  return {
    sessionId,
    userId: user?._id,
    isLoggedIn,
    headers: isLoggedIn ? {} : { "x-session-id": sessionId },
  };
};