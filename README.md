# Two-Week Rebuild (Wellnimalist)

Web app mobile-first en español para acompañar 14 días de reconstrucción (cuerpo, cuidado, espiritualidad católica, gratitud y estado de ánimo).

## Requisitos

- Node.js 20+
- [pnpm](https://pnpm.io/) (recomendado) o npm

## Instalación en local

```bash
cd "wellnimalist app"
pnpm install   # o: npm install
pnpm dev       # o: npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). La primera vez verás la bienvenida; al pulsar **Comenzar** se guarda el inicio del programa (por defecto **14 de mayo de 2026**) y se abre **Hoy**.

## Contenido de los días (Markdown)

Los días viven en `content/days/` como `week-1-day-1.md` … `week-2-day-7.md`.

Cada archivo tiene **frontmatter YAML** y secciones `## Workout`, `## Glow`, `## Spiritual`, `## Scripture`, `## Reflection` (misma estructura que en la plantilla del repo). Tras editar, vuelve a ejecutar `pnpm build` o recarga el entorno de desarrollo para ver los cambios.

El parser está en `lib/content.ts` (gray-matter + remark para listas).

## Supabase (opcional)

Sin variables de entorno, la app usa **solo `localStorage`** en el navegador (clave `rebuild-app:day-{semana}-{día}`).

Para sincronizar en la nube:

1. Crea un proyecto en [Supabase](https://supabase.com).
2. **Authentication → Providers → Anonymous** — actívalo.
3. En **SQL Editor**, ejecuta el script de `supabase/schema.sql` (tabla `daily_entries` + RLS).
4. Crea un archivo `.env.local` en la raíz del proyecto:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

5. `pnpm dev` de nuevo. La app intentará **sesión anónima** y hará upsert en `daily_entries`; en paralelo sigue guardando en local por si falla la red.

## Despliegue en Vercel

1. Inicializa git en la carpeta del proyecto (si aún no lo tienes), haz commit y súbelo a GitHub/GitLab/Bitbucket.
2. En [Vercel](https://vercel.com), **Add New… → Project** e importa el repo. Vercel suele detectar **Next.js** solo.
3. **Build & Output:** deja los valores por defecto (`pnpm build` / `next build` si usas pnpm gracias a `packageManager` en `package.json`; con npm, `npm run build`).
4. **Environment Variables** (en el proyecto de Vercel, no en un archivo subido): si usas Supabase, añade `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` (mismos nombres que en local). Si no las pones, la app sigue funcionando solo con `localStorage` en el navegador de cada visitante.
5. **Deploy.** No hace falta `vercel.json` para este proyecto.

**Carpeta con espacio en el nombre:** el paquete npm se llama `wellnimalist`; si clonas en una ruta con espacios, usa comillas en la terminal (`cd "wellnimalist app"`). En Git puedes renombrar la carpeta del repo a `wellnimalist` sin cambiar el código.

## Calendario de ejemplo en el repo

- Inicio: **14 may 2026** (jueves).
- **23 y 24 may 2026**: días de **retiro** (`isRetreat: true`), sin entreno estructurado; copy orientado a descanso y oración.

Puedes cambiar fechas y textos editando los `.md` y, si quieres otro día 1, ajusta `DEFAULT_PROGRAM_START` en `lib/schedule.ts` o el valor guardado en `localStorage` bajo `rebuild-app:start-date`.

## Scripts

- `pnpm dev` — desarrollo (Turbopack).
- `pnpm build` — compilación de producción.
- `pnpm start` — sirve el build.
- `pnpm lint` — ESLint.

## Notas técnicas

- Next.js 15 (App Router), React 19, TypeScript, Tailwind v4, shadcn/ui (Base UI), Framer Motion, Lucide.
- La navegación prev/next del día evita importar `fs` en el cliente (`lib/program-nav.ts` + datos calculados en el servidor en `app/(app)/today/page.tsx`).
