"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { DayPersist } from "@/types/day";

type Props = {
  persist: DayPersist;
  onChange: (next: DayPersist) => void;
  onBlurPersist: () => void;
};

export function GratitudeCard({ persist, onChange, onBlurPersist }: Props) {
  return (
    <Card className="rounded-3xl border-border bg-card shadow-[0_1px_0_rgba(31,27,23,0.04)]">
      <CardHeader className="pb-2">
        <CardTitle className="font-display text-xl font-medium text-ink">
          Hoy agradezco
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-6 pt-0">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="space-y-2 border-b border-border/70 pb-4 last:border-0 last:pb-0"
          >
            <label className="label-caps text-gold">{i + 1}</label>
            <Textarea
              value={persist.gratitude[i] ?? ""}
              onChange={(e) => {
                const nextGratitude: [string, string, string] = [
                  i === 0 ? e.target.value : persist.gratitude[0],
                  i === 1 ? e.target.value : persist.gratitude[1],
                  i === 2 ? e.target.value : persist.gratitude[2],
                ];
                onChange({ ...persist, gratitude: nextGratitude });
              }}
              onBlur={onBlurPersist}
              rows={3}
              className="rounded-2xl border-border bg-background text-base"
              placeholder="Escribe lo primero que te venga."
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
