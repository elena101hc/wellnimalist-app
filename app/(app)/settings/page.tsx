"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import { isSupabaseConfigured } from "@/lib/storage";

export default function SettingsPage() {
  const [dark, setDark] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      setDark(localStorage.getItem("rebuild-app:theme") === "dark");
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.classList.toggle("dark", dark);
    try {
      localStorage.setItem("rebuild-app:theme", dark ? "dark" : "light");
    } catch {
      /* ignore */
    }
  }, [dark, hydrated]);

  return (
    <div className="space-y-6">
      <div>
        <p className="label-caps text-gold">Ajustes</p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink">
          Preferencias
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          Cambios pequeños, sin ruido. Tú decides cómo se siente la interfaz.
        </p>
      </div>

      <Card className="rounded-3xl border-border bg-card">
        <CardHeader>
          <CardTitle className="font-display text-lg">Apariencia</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-ink">Modo oscuro cálido</p>
            <p className="text-xs text-ink-soft">
              Tonos profundos, sin negro puro.
            </p>
          </div>
          <Toggle
            variant="outline"
            pressed={dark}
            onPressedChange={(next) => setDark(Boolean(next))}
            className="rounded-full px-4"
          >
            {dark ? "On" : "Off"}
          </Toggle>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-border bg-card">
        <CardHeader>
          <CardTitle className="font-display text-lg">Datos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-ink-soft">
          <p>
            Tus marcas se guardan en este dispositivo.{" "}
            {isSupabaseConfigured()
              ? "También sincronizamos de forma segura cuando hay sesión anónima activa."
              : "Si más adelante conectas Supabase, podrás sincronizar sin perder lo que ya escribiste aquí."}
          </p>
        </CardContent>
      </Card>

      <Link
        href="/today"
        className="inline-flex text-sm font-medium text-gold underline-offset-4 hover:underline"
      >
        Volver a hoy
      </Link>
    </div>
  );
}
