"use client";

import { useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import type { DayContent } from "@/types/day";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { softHaptic } from "@/lib/haptics";
import { isWorkoutFullyChecked } from "@/lib/day-state";
import type { DayPersist } from "@/types/day";

type Props = {
  content: DayContent;
  persist: DayPersist;
  onChange: (next: DayPersist) => void;
  onRequestGymMode: () => void;
};

export function WorkoutCard({
  content,
  persist,
  onChange,
  onRequestGymMode,
}: Props) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  const onPointerDown = () => {
    clearTimer();
    timer.current = setTimeout(() => {
      onRequestGymMode();
    }, 650);
  };

  const onPointerUp = () => {
    clearTimer();
  };

  if (content.isRetreat) {
    return (
      <Card className="rounded-3xl border-border bg-card shadow-[0_1px_0_rgba(31,27,23,0.04)]">
        <CardHeader className="pb-2">
          <CardTitle className="font-display text-xl font-medium text-ink">
            Cuerpo en pausa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 p-6 pt-0 text-sm text-ink-soft">
          <p>
            Hoy no hay entreno estructurado: estás en retiro. Camina, descansa
            y escucha lo que necesitas.
          </p>
        </CardContent>
      </Card>
    );
  }

  const doneVisual =
    persist.workoutMarkedComplete && isWorkoutFullyChecked(persist);

  return (
    <Card
      className={cn(
        "rounded-3xl border bg-card shadow-[0_1px_0_rgba(31,27,23,0.04)] transition-colors",
        doneVisual ? "border-success/60" : "border-border",
      )}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-2">
        <div className="flex items-start gap-2">
          {doneVisual ? (
            <CheckCircle2
              className="mt-0.5 size-5 text-success"
              aria-hidden
            />
          ) : null}
          <div>
            <CardTitle className="font-display text-xl font-medium text-ink">
              Entrenamiento
            </CardTitle>
            <p className="mt-1 text-sm text-ink-soft">{content.workout.title}</p>
          </div>
        </div>
        {content.workout.durationMin > 0 ? (
          <span className="label-caps text-gold">
            {content.workout.durationMin} min
          </span>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-4 p-6 pt-0">
        <ul className="space-y-4">
          {content.workout.exercises.map((ex, i) => {
            const checked = persist.workoutChecks[i] ?? false;
            return (
              <li key={`${ex.name}-${i}`} className="space-y-1">
                <label className="flex cursor-pointer items-start gap-3">
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(v) => {
                      softHaptic();
                      const next = [...persist.workoutChecks];
                      next[i] = Boolean(v);
                      onChange({ ...persist, workoutChecks: next });
                    }}
                    className="mt-0.5 size-7 min-h-7 min-w-7"
                  />
                  <span className="space-y-1">
                    <span className="block text-sm font-medium text-ink">
                      {ex.name}{" "}
                      <span className="font-normal text-ink-soft">
                        — {ex.setsReps}
                      </span>
                    </span>
                    {ex.note ? (
                      <span className="block text-sm text-ink-soft">{ex.note}</span>
                    ) : null}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
        <motion.div layout>
          <Button
            type="button"
            variant="outline"
            className="w-full rounded-full border-border"
            disabled={!isWorkoutFullyChecked(persist)}
            onClick={() => {
              softHaptic();
              onChange({
                ...persist,
                workoutMarkedComplete: true,
              });
            }}
          >
            {persist.workoutMarkedComplete && isWorkoutFullyChecked(persist)
              ? "Hecho."
              : "Marcar entrenamiento completo"}
          </Button>
        </motion.div>
        <p className="text-center text-[0.65rem] uppercase tracking-[0.18em] text-ink-soft">
          Mantén pulsada la tarjeta para modo gimnasio
        </p>
      </CardContent>
    </Card>
  );
}
