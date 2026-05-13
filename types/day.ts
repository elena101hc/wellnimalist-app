export type EnergyState =
  | "Gentle Strength"
  | "Nervous System Reset"
  | "Playful Energy"
  | "Recovery & Presence"
  | "Stable Strength"
  | "Soft Feminine Flow"
  | "Rebuild Momentum"
  | "Athletic Reawakening"
  | "Light & Lean"
  | "Strong Feminine Energy"
  | "Silence & Presence"
  | "Deep Recovery"
  | "Deep Inner Recovery"
  | "Powerful & Grounded"
  | "Flow & Mobility"
  | "Confident Momentum"
  | "Athletic Clarity"
  | "Peaceful Discipline";

export interface Exercise {
  name: string;
  setsReps: string;
  note?: string;
}

export interface DayContent {
  week: 1 | 2;
  day: number;
  weekday: string;
  date: string;
  energyState: EnergyState;
  hormonalPhase: string;
  isRetreat?: boolean;
  workout: {
    title: string;
    durationMin: number;
    exercises: Exercise[];
  };
  glow: string[];
  spiritual: string[];
  scripture: {
    text: string;
    reference: string;
  };
  reflectionTopic?: string;
}

export interface DayPersist {
  workoutChecks: boolean[];
  glowChecks: boolean[];
  spiritualChecks: boolean[];
  gratitude: [string, string, string];
  mood: string | null;
  scriptureReflection: string;
  workoutMarkedComplete: boolean;
}

export const MOOD_OPTIONS = [
  "Paz",
  "Cansada",
  "Ansiosa",
  "Enraizada",
  "Esperanzada",
  "Emocional",
  "Con energía",
] as const;

export type MoodOption = (typeof MOOD_OPTIONS)[number];
