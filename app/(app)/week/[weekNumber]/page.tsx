import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllDayContents } from "@/lib/content";
import { Card, CardContent } from "@/components/ui/card";

type PageProps = {
  params: Promise<{ weekNumber: string }>;
};

export default async function WeekPage({ params }: PageProps) {
  const { weekNumber } = await params;
  const week = Number(weekNumber);
  if (week !== 1 && week !== 2) notFound();

  const days = getAllDayContents()
    .filter((d) => d.week === week)
    .sort((a, b) => a.day - b.day);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="label-caps text-gold">Semana {week}</p>
        <h1 className="font-display text-3xl font-medium text-ink">
          Vista de semana
        </h1>
        <p className="text-sm text-ink-soft">
          Elige un día para abrirlo con calma. Puedes moverte entre semanas
          desde aquí.
        </p>
      </div>

      <div className="flex gap-2">
        <Link
          href="/week/1"
          className={`rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] ${
            week === 1
              ? "border-gold bg-blush/40 text-ink"
              : "border-border text-ink-soft hover:text-ink"
          }`}
        >
          Semana 1
        </Link>
        <Link
          href="/week/2"
          className={`rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] ${
            week === 2
              ? "border-gold bg-blush/40 text-ink"
              : "border-border text-ink-soft hover:text-ink"
          }`}
        >
          Semana 2
        </Link>
      </div>

      <div className="space-y-4">
        {days.map((d) => (
          <Link
            key={`${d.week}-${d.day}`}
            href={`/today?week=${d.week}&day=${d.day}`}
            className="block"
          >
            <Card className="rounded-3xl border-border bg-card transition-colors hover:border-gold/50">
              <CardContent className="flex items-center justify-between gap-3 p-5">
                <div>
                  <p className="label-caps">Día {d.day}</p>
                  <p className="font-display text-xl text-ink">{d.weekday}</p>
                  <p className="text-xs text-ink-soft">{d.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gold">{d.energyState}</p>
                  {d.isRetreat ? (
                    <p className="mt-1 text-xs text-ink-soft">Retiro</p>
                  ) : (
                    <p className="mt-1 text-xs text-ink-soft">
                      {d.workout.title}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
