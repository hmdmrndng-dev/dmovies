import { useState, useEffect } from "react";
import { toggleMediaState } from "@/lib/account-actions";

export function useMediaAction({
  initialState,
  user,
  mediaId,
  mediaType = "movie",
  actionType,
  onRequireLogin,
}: {
  initialState: boolean;
  user: any;
  mediaId: number;
  mediaType?: "movie" | "tv";
  actionType: "favorite" | "watchlist";
  onRequireLogin: () => void;
}) {
  const [isActive, setIsActive] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsActive(initialState);
  }, [initialState]);

  async function toggle() {
    if (!user) {
      onRequireLogin();
      return;
    }

    setIsLoading(true);
    const nextState = !isActive;
    setIsActive(nextState); 

    try {
      await toggleMediaState(
        user.id,
        mediaType,
        mediaId,
        actionType,
        nextState,
      );
    } catch {
      setIsActive(!nextState); // Rollback on error
    } finally {
      setIsLoading(false);
    }
  }

  return { isActive, isLoading, toggle };
}
