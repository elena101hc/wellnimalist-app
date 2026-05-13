"use client";

import { useState } from "react";
import type { DayContent } from "@/types/day";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import type { DayPersist } from "@/types/day";

type Props = {
  content: DayContent;
  persist: DayPersist;
  onChange: (next: DayPersist) => void;
};

export function ScriptureCard({ content, persist, onChange }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card className="rounded-3xl border-border bg-card shadow-[0_1px_0_rgba(31,27,23,0.04)]">
        <CardHeader className="pb-2">
          <CardTitle className="font-display text-xl font-medium text-ink">
            Palabra del día
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-6 pt-0">
          <blockquote className="font-display text-balance text-xl italic leading-snug text-ink md:text-2xl">
            “{content.scripture.text}”
          </blockquote>
          <p className="text-sm text-gold">{content.scripture.reference}</p>
          {content.reflectionTopic ? (
            <p className="text-sm text-ink-soft">{content.reflectionTopic}</p>
          ) : null}
          <Button
            type="button"
            variant="ghost"
            className="rounded-full px-4 text-sm text-ink-soft hover:text-ink"
            onClick={() => setOpen(true)}
          >
            Reflexión
          </Button>
        </CardContent>
      </Card>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="rounded-t-3xl border-border">
          <SheetHeader>
            <SheetTitle className="font-display text-xl">
              Tu reflexión
            </SheetTitle>
            <SheetDescription className="text-ink-soft">
              Escribe con libertad. Esto es solo para ti.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-4 space-y-3">
            <Textarea
              value={persist.scriptureReflection}
              onChange={(e) =>
                onChange({
                  ...persist,
                  scriptureReflection: e.target.value,
                })
              }
              rows={8}
              className="rounded-2xl border-border bg-background text-base"
              placeholder="Aquí puedes detenerte un momento…"
            />
            <Button
              type="button"
              variant="outline"
              className="w-full rounded-full border-border"
              onClick={() => setOpen(false)}
            >
              Cerrar
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
