// src/lib/account-actions.ts

type ActionType = "favorite" | "watchlist";
type MediaType = "movie" | "tv";

export async function toggleMediaState(
  accountId: number,
  mediaType: MediaType,
  mediaId: number,
  action: ActionType,
  isActive: boolean,
) {
  const response = await fetch(`/api/account/${action}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      account_id: accountId,
      media_type: mediaType,
      media_id: mediaId,
      // The brackets dynamically set the key to either "favorite" or "watchlist"
      [action]: isActive,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update ${action} state`);
  }

  return response.json();
}
