import { notFound } from "next/navigation";
import { DayShell } from "@/components/day/day-shell";
import {
  getDayContent,
  getOrderedProgramDays,
  resolveDefaultDayForDate,
} from "@/lib/content";
import { todayIsoInTimeZone } from "@/lib/dates";
import { getAdjacentProgramDay } from "@/lib/program-nav";

type PageProps = {
  searchParams?: Promise<{ week?: string; day?: string }>;
};

export default async function TodayPage({ searchParams }: PageProps) {
  const sp = (await searchParams) ?? {};
  const w = sp.week ? Number(sp.week) : undefined;
  const d = sp.day ? Number(sp.day) : undefined;

  let content = null;
  if ((w === 1 || w === 2) && d && d >= 1 && d <= 7) {
    content = getDayContent(w, d);
  }
  if (!content) {
    content = resolveDefaultDayForDate(todayIsoInTimeZone());
  }
  if (!content) notFound();

  const ordered = getOrderedProgramDays();
  const prev = getAdjacentProgramDay(ordered, content.week, content.day, -1);
  const next = getAdjacentProgramDay(ordered, content.week, content.day, 1);

  return <DayShell content={content} prev={prev} next={next} />;
}
