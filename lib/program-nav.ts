import type { DayContent } from "@/types/day";

export function getAdjacentProgramDay(
  ordered: DayContent[],
  week: 1 | 2,
  day: number,
  direction: -1 | 1,
): { week: 1 | 2; day: number } | null {
  const idx = ordered.findIndex((d) => d.week === week && d.day === day);
  if (idx < 0) return null;
  const target = ordered[idx + direction];
  if (!target) return null;
  return { week: target.week, day: target.day };
}
