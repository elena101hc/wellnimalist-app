"use client";

import type { DayContent } from "@/types/day";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { softHaptic } from "@/lib/haptics";
import { countSpiritualChecked } from "@/lib/day-state";
import type { DayPersist } from "@/types/day";

type Props = {
  content: DayContent;
  persist: DayPersist;
  onChange: (next: DayPersist) => void;
};

export function SpiritualCard({ content, persist, onChange }: Props) {
  const total = content.spiritual.length;
  const done = countSpiritualChecked(persist);

  return (
    <Card className="rounded-3xl border-border bg-card shadow-[0_1px_0_rgba(31,27,23,0.04)]">
      <CardHeader className="space-y-2 pb-2">
        <CardTitle className="font-display text-xl font-medium text-ink">
          Espiritualidad
        </CardTitle>
        <p className="text-sm leading-relaxed text-ink-soft">
          No hace falta marcar todo. Estas prácticas están aquí como invitación,
          no como exigencia.
        </p>
      </CardHeader>
      <CardContent className="space-y-3 p-6 pt-0">
        <ul className="space-y-3">
          {content.spiritual.map((item, i) => {
            const checked = persist.spiritualChecks[i] ?? false;
            return (
              <li key={`${item}-${i}`}>
                <label className="flex cursor-pointer items-start gap-3">
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(v) => {
                      softHaptic();
                      const next = [...persist.spiritualChecks];
                      next[i] = Boolean(v);
                      onChange({ ...persist, spiritualChecks: next });
                    }}
                    className="mt-0.5 size-7 min-h-7 min-w-7"
                  />
                  <span className="text-sm text-ink">{item}</span>
                </label>
              </li>
            );
          })}
        </ul>
        <p className="rounded-2xl bg-surface-2/60 px-3 py-2 text-center text-xs text-ink-soft">
          {done} de {total} prácticas hoy
        </p>
      </CardContent>
    </Card>
  );
}
