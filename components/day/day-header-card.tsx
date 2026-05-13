import type { DayContent } from "@/types/day";
import { Card, CardContent } from "@/components/ui/card";

export function DayHeaderCard({ content }: { content: DayContent }) {
  const formatted = new Date(content.date + "T12:00:00").toLocaleDateString(
    "es-ES",
    { day: "numeric", month: "short" },
  );

  return (
    <Card className="rounded-3xl border-border bg-card shadow-[0_1px_0_rgba(31,27,23,0.04)]">
      <CardContent className="space-y-4 p-6">
        <p className="label-caps">
          Semana {content.week} · Día {content.day}
        </p>
        <div>
          <h1 className="font-display text-4xl font-medium leading-tight text-ink md:text-[2.5rem]">
            {content.weekday}
          </h1>
          <p className="mt-2 text-sm capitalize text-ink-soft">{formatted}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-border" aria-hidden />
          <p className="font-display text-center text-base font-medium text-gold">
            {content.energyState}
          </p>
          <span className="h-px flex-1 bg-border" aria-hidden />
        </div>
        <p className="text-center text-xs text-ink-soft">
          Fase: {content.hormonalPhase}
        </p>
      </CardContent>
    </Card>
  );
}
