import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import { visit } from "unist-util-visit";
import { toString } from "mdast-util-to-string";
import type { Root } from "mdast";
import type { DayContent, EnergyState, Exercise } from "@/types/day";

const CONTENT_DIR = path.join(process.cwd(), "content", "days");

function extractSection(body: string, title: string): string {
  /** Split on headings so blank lines inside a section cannot end the match (see `$` + `m` bug). */
  const parts = body.split(/^##\s+/m);
  for (const part of parts) {
    const p = part.trimStart();
    const lineEnd = p.indexOf("\n");
    const heading = lineEnd === -1 ? p.trim() : p.slice(0, lineEnd).trim();
    if (heading === title) {
      return lineEnd === -1 ? "" : p.slice(lineEnd + 1).trim();
    }
  }
  return "";
}

function parseListItems(markdown: string): string[] {
  if (!markdown.trim()) return [];
  const tree = unified().use(remarkParse).parse(markdown.trim()) as Root;
  const items: string[] = [];
  visit(tree, "listItem", (node) => {
    const text = toString(node).replace(/^\[[ x]\]\s*/i, "").trim();
    if (text) items.push(text);
  });
  return items;
}

function parseExercises(section: string): Exercise[] {
  const lines = section.split(/\r?\n/);
  const exercises: Exercise[] = [];
  let current: Exercise | null = null;
  for (const raw of lines) {
    const line = raw.trim();
    const m = line.match(/^- \[ \]\s+(.+?)\s*[—–-]\s*(.+)$/);
    if (m) {
      if (current) exercises.push(current);
      current = { name: m[1].trim(), setsReps: m[2].trim() };
      continue;
    }
    if (line.startsWith(">") && current) {
      current.note = line.replace(/^>\s*/, "").trim();
      continue;
    }
  }
  if (current) exercises.push(current);
  return exercises;
}

function parseScripture(section: string): { text: string; reference: string } {
  const lines = section.split(/\r?\n/).map((l) => l.trim());
  let text = "";
  let reference = "";
  for (const line of lines) {
    if (line.startsWith(">")) {
      text = line.replace(/^>\s*/, "").replace(/^"|"$/g, "").trim();
    }
    if (/^[—–-]\s*.+/.test(line)) {
      reference = line.replace(/^[—–-]\s*/, "").trim();
    }
  }
  return { text, reference };
}

function parseReflectionTopic(section: string): string | undefined {
  const m = section.match(/Tema:\s*(.+)/i);
  return m?.[1]?.trim();
}

function isEnergyState(value: string): value is EnergyState {
  return [
    "Gentle Strength",
    "Nervous System Reset",
    "Playful Energy",
    "Recovery & Presence",
    "Stable Strength",
    "Soft Feminine Flow",
    "Rebuild Momentum",
    "Athletic Reawakening",
    "Light & Lean",
    "Strong Feminine Energy",
    "Silence & Presence",
    "Deep Recovery",
    "Deep Inner Recovery",
    "Powerful & Grounded",
    "Flow & Mobility",
    "Confident Momentum",
    "Athletic Clarity",
    "Peaceful Discipline",
  ].includes(value);
}

export function parseDayMarkdown(raw: string): DayContent {
  const { data, content: body } = matter(raw);
  const week = Number(data.week);
  const day = Number(data.day);
  if (week !== 1 && week !== 2) throw new Error("Invalid week in frontmatter");
  if (!Number.isFinite(day) || day < 1 || day > 7) {
    throw new Error("Invalid day in frontmatter");
  }

  const energyRaw = String(data.energyState ?? "");
  const energyState: EnergyState = isEnergyState(energyRaw)
    ? energyRaw
    : "Recovery & Presence";

  const workoutSection = extractSection(body, "Workout");
  const glowSection = extractSection(body, "Glow");
  const spiritualSection = extractSection(body, "Spiritual");
  const scriptureSection = extractSection(body, "Scripture");
  const reflectionSection = extractSection(body, "Reflection");

  const exercises = parseExercises(workoutSection);
  const glow = parseListItems(glowSection);
  const spiritual = parseListItems(spiritualSection);
  const scripture = parseScripture(scriptureSection);
  const reflectionTopic = parseReflectionTopic(reflectionSection);

  const isRetreat = Boolean(data.isRetreat);

  return {
    week: week as 1 | 2,
    day,
    weekday: String(data.weekday ?? ""),
    date: String(data.date ?? ""),
    energyState,
    hormonalPhase: String(data.hormonalPhase ?? ""),
    isRetreat,
    workout: {
      title: String(data.workoutTitle ?? ""),
      durationMin: Number(data.workoutDuration ?? 0),
      exercises,
    },
    glow,
    spiritual,
    scripture,
    reflectionTopic,
  };
}

export function parseDayFile(filePath: string): DayContent {
  const raw = fs.readFileSync(filePath, "utf8");
  return parseDayMarkdown(raw);
}

let cache: DayContent[] | null = null;

export function getAllDayContents(): DayContent[] {
  if (cache) return cache;
  if (!fs.existsSync(CONTENT_DIR)) {
    cache = [];
    return cache;
  }
  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  cache = files.map((f) => parseDayFile(path.join(CONTENT_DIR, f)));
  return cache;
}

export function getDayContent(week: 1 | 2, day: number): DayContent | null {
  return (
    getAllDayContents().find((d) => d.week === week && d.day === day) ?? null
  );
}

export function getOrderedProgramDays(): DayContent[] {
  return [...getAllDayContents()].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
}

export function findDayByCalendarDate(isoDate: string): DayContent | null {
  return getAllDayContents().find((d) => d.date === isoDate) ?? null;
}

export function resolveDefaultDayForDate(isoDate: string): DayContent {
  const ordered = getOrderedProgramDays();
  if (!ordered.length) {
    throw new Error("No hay contenido de días configurado.");
  }
  const exact = findDayByCalendarDate(isoDate);
  if (exact) return exact;
  const t = new Date(isoDate + "T12:00:00").getTime();
  let last: DayContent | null = null;
  for (const d of ordered) {
    const dt = new Date(d.date + "T12:00:00").getTime();
    if (dt <= t) last = d;
    if (dt >= t) return d;
  }
  return last ?? ordered[0];
}
