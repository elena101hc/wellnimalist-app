"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { DayContent, DayPersist } from "@/types/day";
import { loadAllLocalDays } from "@/lib/storage";
import {
  dayCompletionScore,
  isDayCompleted,
  normalizePersist,
  spiritualStreakDays,
} from "@/lib/day-state";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { todayIsoInTimeZone } from "@/lib/dates";

type Props = {
  days: DayContent[];
};

export function DashboardView({ days }: Props) {
  const [entries, setEntries] = useState<Record<string, DayPersist>>({});

  useEffect(() => {
    setEntries(loadAllLocalDays());
  }, []);

  const normalizedMap = useMemo(() => {
    const out: Record<string, DayPersist> = {};
    for (const d of days) {
      const key = `${d.week}-${d.day}`;
      out[key] = normalizePersist(entries[key] ?? null, d);
    }
    return out;
  }, [days, entries]);

  const completed = days.filter((d) =>
    isDayCompleted(d, normalizedMap[`${d.week}-${d.day}`]),
  ).length;

  const streak = spiritualStreakDays(days, normalizedMap, todayIsoInTimeZone());

  const gratitudeCount = days.reduce((acc, d) => {
    const p = normalizedMap[`${d.week}-${d.day}`];
    const g = p.gratitude.filter((x) => x.trim().length > 0).length;
    return acc + g;
  }, 0);

  const total = days.length || 14;
  const ringPercent = Math.round((completed / total) * 100);

  return (
    <div className="space-y-8">
      <div>
        <p className="label-caps text-gold">Progreso</p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink">
          Tu recorrido
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          Un resumen honesto, sin puntos ni castigos. Solo lo que ya has vivido.
        </p>
      </div>

      <Card className="rounded-3xl border-border bg-card">
        <CardContent className="flex items-center gap-6 p-6">
          <div className="relative grid size-28 shrink-0 place-items-center">
            <div
              className="col-start-1 row-start-1 size-28 rounded-full"
              style={{
                background: `conic-gradient(var(--gold) ${ringPercent}%, var(--surface-2) 0)`,
              }}
              aria-hidden
            />
            <div className="col-start-1 row-start-1 flex size-[4.5rem] flex-col items-center justify-center rounded-full bg-card text-center">
              <span className="font-display text-lg leading-none text-ink">
                {completed}
              </span>
              <span className="mt-1 text-[0.6rem] uppercase tracking-[0.18em] text-ink-soft">
                de {total}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-ink">Días con cierre cuidadoso</p>
            <p className="text-sm text-ink-soft">
              Un día cuenta como cerrado cuando completas el entreno (si aplica)
              o, en retiro, marcas al menos una práctica espiritual.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-border bg-card">
        <CardContent className="space-y-3 p-6">
          <p className="text-sm font-medium text-ink">Racha espiritual</p>
          <p className="text-3xl font-display text-gold">{streak}</p>
          <p className="text-sm text-ink-soft">
            Días seguidos con al menos una práctica espiritual registrada.
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-border bg-card">
        <CardContent className="space-y-4 p-6">
          <p className="text-sm font-medium text-ink">Mapa de catorce días</p>
          <div className="grid grid-cols-7 gap-2">
            {days.map((d) => {
              const key = `${d.week}-${d.day}`;
              const p = normalizedMap[key];
              const score = dayCompletionScore(d, p);
              const bg =
                score === 0
                  ? "bg-surface-2/60"
                  : score < 0.35
                    ? "bg-blush/50"
                    : score < 0.7
                      ? "bg-blush-deep/50"
                      : "bg-gold/50";
              return (
                <div
                  key={key}
                  title={`${d.weekday} · ${d.date}`}
                  className={cn(
                    "aspect-square rounded-xl border border-border/60",
                    bg,
                  )}
                />
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-border bg-card">
        <CardContent className="space-y-3 p-6">
          <p className="text-sm font-medium text-ink">Estados de ánimo</p>
          <div className="flex flex-wrap gap-2">
            {days.map((d) => {
              const key = `${d.week}-${d.day}`;
              const mood = normalizedMap[key].mood;
              if (!mood) return null;
              return (
                <span
                  key={`${key}-mood`}
                  className="rounded-full border border-border bg-background px-3 py-1 text-xs text-ink-soft"
                >
                  <span className="text-[0.6rem] uppercase tracking-[0.16em] text-gold">
                    {d.weekday}
                  </span>
                  <span className="ml-2 text-ink">{mood}</span>
                </span>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-border bg-card">
        <CardContent className="space-y-3 p-6">
          <p className="text-sm font-medium text-ink">Gratitud acumulada</p>
          <p className="text-3xl font-display text-ink">{gratitudeCount}</p>
          <p className="text-sm text-ink-soft">Entradas escritas en total.</p>
          <Progress value={Math.min(100, (gratitudeCount / 42) * 100)} />
        </CardContent>
      </Card>

      <div className="text-center text-sm text-ink-soft">
        <Link
          href="/settings"
          className="font-medium text-gold underline-offset-4 hover:underline"
        >
          Ajustes
        </Link>
      </div>
    </div>
  );
}
