"use client";

import { MOOD_OPTIONS } from "@/types/day";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import { softHaptic } from "@/lib/haptics";
import type { DayPersist } from "@/types/day";

type Props = {
  persist: DayPersist;
  onChange: (next: DayPersist) => void;
};

export function MoodCard({ persist, onChange }: Props) {
  return (
    <Card className="rounded-3xl border-border bg-card shadow-[0_1px_0_rgba(31,27,23,0.04)]">
      <CardHeader className="pb-2">
        <CardTitle className="font-display text-xl font-medium text-ink">
          ¿Cómo te has sentido hoy?
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {MOOD_OPTIONS.map((m) => {
            const selected = persist.mood === m;
            return (
              <Toggle
                key={m}
                variant="outline"
                pressed={selected}
                onPressedChange={() => {
                  softHaptic();
                  onChange({
                    ...persist,
                    mood: selected ? null : m,
                  });
                }}
                className={cn(
                  "h-auto min-h-9 shrink-0 rounded-full px-3 py-2 text-xs font-medium transition-colors",
                  selected
                    ? "border-gold bg-blush/40 text-ink"
                    : "border-border text-ink-soft hover:text-ink",
                )}
              >
                {m}
              </Toggle>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
