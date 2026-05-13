import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { normalizePersist } from "@/lib/day-state";
import type { DayContent, DayPersist } from "@/types/day";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function isSupabaseConfigured(): boolean {
  return Boolean(url && anon);
}

let browserClient: SupabaseClient | null = null;

export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (!isSupabaseConfigured() || typeof window === "undefined") return null;
  if (!browserClient) {
    browserClient = createClient(url!, anon!, {
      auth: { persistSession: true, autoRefreshToken: true },
    });
  }
  return browserClient;
}

export async function ensureAnonymousUser(): Promise<string | null> {
  const sb = getSupabaseBrowserClient();
  if (!sb) return null;
  const { data } = await sb.auth.getSession();
  if (data.session?.user?.id) return data.session.user.id;
  const { data: signData, error } = await sb.auth.signInAnonymously();
  if (error) {
    console.warn("[supabase] anon sign-in", error.message);
    return null;
  }
  return signData.user?.id ?? null;
}

function dayKey(week: number, day: number): string {
  return `${week}-${day}`;
}

function localKey(week: number, day: number): string {
  return `rebuild-app:day-${week}-${day}`;
}

export function readLocalDay(week: number, day: number): DayPersist | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(localKey(week, day));
    if (!raw) return null;
    return JSON.parse(raw) as DayPersist;
  } catch {
    return null;
  }
}

export function writeLocalDay(
  week: number,
  day: number,
  payload: DayPersist,
): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(localKey(week, day), JSON.stringify(payload));
}

export async function readRemoteDay(
  week: number,
  day: number,
): Promise<DayPersist | null> {
  const sb = getSupabaseBrowserClient();
  if (!sb) return null;
  const uid = await ensureAnonymousUser();
  if (!uid) return null;
  const key = dayKey(week, day);
  const { data, error } = await sb
    .from("daily_entries")
    .select("payload")
    .eq("user_id", uid)
    .eq("day_key", key)
    .maybeSingle();
  if (error) {
    console.warn("[supabase] read", error.message);
    return null;
  }
  if (!data?.payload) return null;
  return data.payload as DayPersist;
}

export async function writeRemoteDay(
  week: number,
  day: number,
  payload: DayPersist,
): Promise<boolean> {
  const sb = getSupabaseBrowserClient();
  if (!sb) return false;
  const uid = await ensureAnonymousUser();
  if (!uid) return false;
  const key = dayKey(week, day);
  const { error } = await sb.from("daily_entries").upsert(
    {
      user_id: uid,
      day_key: key,
      payload,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,day_key" },
  );
  if (error) {
    console.warn("[supabase] write", error.message);
    return false;
  }
  return true;
}

export async function getDay(
  week: number,
  day: number,
  content: DayContent,
): Promise<DayPersist> {
  if (isSupabaseConfigured()) {
    const remote = await readRemoteDay(week, day);
    if (remote) return normalizePersist(remote, content);
  }
  const local = readLocalDay(week, day);
  return normalizePersist(local, content);
}

export async function saveDay(
  week: number,
  day: number,
  payload: DayPersist,
  content: DayContent,
): Promise<void> {
  const normalized = normalizePersist(payload, content);
  writeLocalDay(week, day, normalized);
  if (isSupabaseConfigured()) {
    await writeRemoteDay(week, day, normalized);
  }
}

export function loadAllLocalDays(): Record<string, DayPersist> {
  const out: Record<string, DayPersist> = {};
  if (typeof window === "undefined") return out;
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (!k?.startsWith("rebuild-app:day-")) continue;
    try {
      const raw = localStorage.getItem(k);
      if (!raw) continue;
      const suffix = k.replace("rebuild-app:day-", "");
      out[suffix] = JSON.parse(raw) as DayPersist;
    } catch {
      /* skip */
    }
  }
  return out;
}
