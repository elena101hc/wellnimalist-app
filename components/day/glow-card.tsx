"use client";

import {
  Apple,
  Droplet,
  Moon,
  Sparkles,
  Sun,
  type LucideIcon,
} from "lucide-react";
import type { DayContent } from "@/types/day";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { softHaptic } from "@/lib/haptics";
import type { DayPersist } from "@/types/day";

function iconFor(label: string): LucideIcon {
  const l = label.toLowerCase();
  if (l.includes("hidrat") || l.includes("agua")) return Droplet;
  if (l.includes("luz") || l.includes("sol")) return Sun;
  if (l.includes("sueño") || l.includes("noche") || l.includes("magnesio"))
    return Moon;
  if (l.includes("comida") || l.includes("proteína") || l.includes("electrol"))
    return Apple;
  return Sparkles;
}

type Props = {
  content: DayContent;
  persist: DayPersist;
  onChange: (next: DayPersist) => void;
};

export function GlowCard({ content, persist, onChange }: Props) {
  if (!content.glow.length) return null;

  return (
    <Card className="rounded-3xl border-border bg-card shadow-[0_1px_0_rgba(31,27,23,0.04)]">
      <CardHeader className="pb-2">
        <CardTitle className="font-display text-xl font-medium text-ink">
          Cuidado del día
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 p-6 pt-0">
        <ul className="space-y-3">
          {content.glow.map((item, i) => {
            const Icon = iconFor(item);
            const checked = persist.glowChecks[i] ?? false;
            return (
              <li key={`${item}-${i}`}>
                <label className="flex cursor-pointer items-start gap-3">
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(v) => {
                      softHaptic();
                      const next = [...persist.glowChecks];
                      next[i] = Boolean(v);
                      onChange({ ...persist, glowChecks: next });
                    }}
                    className="mt-0.5 size-7 min-h-7 min-w-7"
                  />
                  <Icon
                    className={cn(
                      "mt-0.5 size-4 shrink-0 text-gold",
                      checked && "text-success",
                    )}
                    aria-hidden
                  />
                  <span className="text-sm text-ink">{item}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
