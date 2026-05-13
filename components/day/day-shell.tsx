"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { DayContent, DayPersist } from "@/types/day";
import { getDay, saveDay } from "@/lib/storage";
import {
  normalizePersist,
  isWorkoutFullyChecked,
} from "@/lib/day-state";
import { DayHeaderCard } from "@/components/day/day-header-card";
import { WorkoutCard } from "@/components/day/workout-card";
import { GlowCard } from "@/components/day/glow-card";
import { SpiritualCard } from "@/components/day/spiritual-card";
import { ScriptureCard } from "@/components/day/scripture-card";
import { GratitudeCard } from "@/components/day/gratitude-card";
import { MoodCard } from "@/components/day/mood-card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { softHaptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";

type Props = {
  content: DayContent;
  prev: { week: 1 | 2; day: number } | null;
  next: { week: 1 | 2; day: number } | null;
};

function hrefForDay(week: number, day: number) {
  return `/today?week=${week}&day=${day}`;
}

export function DayShell({ content, prev, next }: Props) {
  const [persist, setPersist] = useState<DayPersist | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [gymOpen, setGymOpen] = useState(false);
  const skipSave = useRef(true);
  const persistRef = useRef<DayPersist | null>(null);

  useEffect(() => {
    persistRef.current = persist;
  }, [persist]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const data = await getDay(content.week, content.day, content);
      if (cancelled) return;
      setPersist(data);
      setLoaded(true);
      skipSave.current = true;
    })();
    return () => {
      cancelled = true;
    };
  }, [content]);

  useEffect(() => {
    if (!loaded || !persist) return;
    if (skipSave.current) {
      skipSave.current = false;
      return;
    }
    const t = setTimeout(() => {
      void saveDay(content.week, content.day, persist, content);
    }, 600);
    return () => clearTimeout(t);
  }, [persist, loaded, content]);

  const flushSave = useCallback(async () => {
    if (!persist) return;
    await saveDay(content.week, content.day, persist, content);
  }, [content, persist]);

  const onChange = useCallback(
    (nextPersist: DayPersist) => {
      setPersist(normalizePersist(nextPersist, content));
    },
    [content],
  );

  if (!persist) {
    return (
      <div className="space-y-4 py-10 text-center text-sm text-ink-soft">
        Cargando tu día…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-3">
        {prev ? (
          <Link
            href={hrefForDay(prev.week, prev.day)}
            aria-label="Día anterior"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "rounded-full text-ink-soft hover:text-ink",
            )}
          >
            <ChevronLeft className="size-5" />
          </Link>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-ink-soft/40"
            disabled
            aria-label="Día anterior"
          >
            <ChevronLeft className="size-5" />
          </Button>
        )}
        <p className="text-center text-xs uppercase tracking-[0.2em] text-ink-soft">
          Two-week rebuild
        </p>
        {next ? (
          <Link
            href={hrefForDay(next.week, next.day)}
            aria-label="Día siguiente"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "rounded-full text-ink-soft hover:text-ink",
            )}
          >
            <ChevronRight className="size-5" />
          </Link>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-ink-soft/40"
            disabled
            aria-label="Día siguiente"
          >
            <ChevronRight className="size-5" />
          </Button>
        )}
      </header>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${content.week}-${content.day}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-6"
        >
          <DayHeaderCard content={content} />
          <WorkoutCard
            content={content}
            persist={persist}
            onChange={onChange}
            onRequestGymMode={() => setGymOpen(true)}
          />
          <GlowCard content={content} persist={persist} onChange={onChange} />
          <SpiritualCard
            content={content}
            persist={persist}
            onChange={onChange}
          />
          <ScriptureCard
            content={content}
            persist={persist}
            onChange={onChange}
          />
          <GratitudeCard
            persist={persist}
            onChange={onChange}
            onBlurPersist={flushSave}
          />
          <MoodCard persist={persist} onChange={onChange} />
        </motion.div>
      </AnimatePresence>

      <Sheet open={gymOpen} onOpenChange={setGymOpen}>
        <SheetContent
          side="bottom"
          className="h-[88dvh] rounded-t-3xl border-border"
          showCloseButton
        >
          <SheetHeader>
            <SheetTitle className="font-display text-xl">
              Modo gimnasio
            </SheetTitle>
          </SheetHeader>
          <div className="space-y-4 overflow-y-auto px-1 pb-6">
            <p className="text-sm text-ink-soft">
              Solo lo esencial: ejercicios y marcas. Cuando termines, cierra esta
              vista.
            </p>
            <ul className="space-y-5">
              {content.workout.exercises.map((ex, i) => {
                const checked = persist.workoutChecks[i] ?? false;
                return (
                  <li key={`gym-${ex.name}-${i}`}>
                    <label className="flex cursor-pointer items-start gap-4">
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(v) => {
                          softHaptic();
                          const next = [...persist.workoutChecks];
                          next[i] = Boolean(v);
                          onChange({ ...persist, workoutChecks: next });
                        }}
                        className="mt-1 size-9 min-h-9 min-w-9 rounded-lg"
                      />
                      <span className="space-y-1">
                        <span className="block text-base font-medium text-ink">
                          {ex.name}
                        </span>
                        <span className="block text-sm text-ink-soft">
                          {ex.setsReps}
                        </span>
                        {ex.note ? (
                          <span className="block text-sm text-ink-soft">
                            {ex.note}
                          </span>
                        ) : null}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
            <Button
              type="button"
              className="w-full rounded-full"
              disabled={!isWorkoutFullyChecked(persist)}
              onClick={() => {
                onChange({ ...persist, workoutMarkedComplete: true });
                setGymOpen(false);
              }}
            >
              Marcar entrenamiento completo
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
