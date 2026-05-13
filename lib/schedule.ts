"use client";

const START_KEY = "rebuild-app:start-date";
const ONBOARD_KEY = "rebuild-app:onboarded";

/** Fecha de inicio del programa (día 1) — por defecto 14 may 2026. */
export const DEFAULT_PROGRAM_START = "2026-05-14";

export function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function getOnboarded(): boolean {
  if (!isBrowser()) return false;
  return localStorage.getItem(ONBOARD_KEY) === "1";
}

export function setOnboarded(): void {
  if (!isBrowser()) return;
  localStorage.setItem(ONBOARD_KEY, "1");
}

export function getProgramStartDate(): string {
  if (!isBrowser()) return DEFAULT_PROGRAM_START;
  return localStorage.getItem(START_KEY) ?? DEFAULT_PROGRAM_START;
}

export function setProgramStartDate(isoDate: string): void {
  if (!isBrowser()) return;
  localStorage.setItem(START_KEY, isoDate);
}

export function ensureProgramStartOnFirstLaunch(): void {
  if (!isBrowser()) return;
  if (!localStorage.getItem(START_KEY)) {
    localStorage.setItem(START_KEY, DEFAULT_PROGRAM_START);
  }
}
