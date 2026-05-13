import type { DayContent, DayPersist } from "@/types/day";

export function emptyPersist(content: DayContent): DayPersist {
  return {
    workoutChecks: content.workout.exercises.map(() => false),
    glowChecks: content.glow.map(() => false),
    spiritualChecks: content.spiritual.map(() => false),
    gratitude: ["", "", ""],
    mood: null,
    scriptureReflection: "",
    workoutMarkedComplete: false,
  };
}

function padOrTrim<T>(arr: T[] | undefined, len: T, length: number): T[] {
  const base = Array.isArray(arr) ? [...arr] : [];
  while (base.length < length) base.push(len);
  if (base.length > length) base.length = length;
  return base;
}

export function normalizePersist(
  partial: Partial<DayPersist> | null,
  content: DayContent,
): DayPersist {
  const empty = emptyPersist(content);
  if (!partial) return empty;
  return {
    workoutChecks: padOrTrim(
      partial.workoutChecks,
      false,
      content.workout.exercises.length,
    ),
    glowChecks: padOrTrim(partial.glowChecks, false, content.glow.length),
    spiritualChecks: padOrTrim(
      partial.spiritualChecks,
      false,
      content.spiritual.length,
    ),
    gratitude: [
      partial.gratitude?.[0] ?? "",
      partial.gratitude?.[1] ?? "",
      partial.gratitude?.[2] ?? "",
    ],
    mood: partial.mood ?? null,
    scriptureReflection: partial.scriptureReflection ?? "",
    workoutMarkedComplete: partial.workoutMarkedComplete ?? false,
  };
}

export function countSpiritualChecked(p: DayPersist): number {
  return p.spiritualChecks.filter(Boolean).length;
}

export function isWorkoutFullyChecked(p: DayPersist): boolean {
  if (!p.workoutChecks.length) return false;
  return p.workoutChecks.every(Boolean);
}

export function dayCompletionScore(
  content: DayContent,
  p: DayPersist,
): number {
  if (content.isRetreat) {
    const s = countSpiritualChecked(p);
    return Math.min(1, s / Math.max(1, content.spiritual.length));
  }
  const w =
    content.workout.exercises.length === 0
      ? 1
      : p.workoutChecks.filter(Boolean).length /
        content.workout.exercises.length;
  const g =
    content.glow.length === 0
      ? 1
      : p.glowChecks.filter(Boolean).length / content.glow.length;
  const sp =
    content.spiritual.length === 0
      ? 1
      : countSpiritualChecked(p) / content.spiritual.length;
  const mood = p.mood ? 1 : 0;
  return (w + g + sp + mood) / 4;
}

export function isDayCompleted(content: DayContent, p: DayPersist): boolean {
  if (content.isRetreat) return countSpiritualChecked(p) >= 1;
  return p.workoutMarkedComplete && isWorkoutFullyChecked(p);
}

export function spiritualStreakDays(
  ordered: DayContent[],
  entries: Record<string, DayPersist>,
  todayIso: string,
): number {
  const upTo = ordered
    .filter((d) => d.date <= todayIso)
    .sort((a, b) => b.date.localeCompare(a.date));
  let streak = 0;
  for (const d of upTo) {
    const key = `${d.week}-${d.day}`;
    const p = entries[key];
    if (!p || countSpiritualChecked(p) < 1) break;
    streak++;
  }
  return streak;
}
