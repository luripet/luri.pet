"use client";

import useSWR from "swr";
import type { LanyardData } from "@/types/lanyard";

const DISCORD_ID = "1143759602446508183";
const LANYARD_API = `https://api.lanyard.rest/v1/users/${DISCORD_ID}`;

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error("Failed to fetch Lanyard data");
    return r.json();
  });

export function useLanyard() {
  const { data, error, isLoading } = useSWR<{ data: LanyardData }>(
    LANYARD_API,
    fetcher,
    {
      refreshInterval: 10_000,
      revalidateOnFocus: true,
    }
  );

  return {
    presence: data?.data ?? null,
    error: error as Error | null,
    isLoading,
  };
}
