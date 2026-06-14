# Copilot Instructions

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build
npm run lint     # Run ESLint
```

No test suite is configured.

## Architecture

This is a **Next.js 16 App Router** project (React 19, TypeScript strict mode) that displays movie data from the TMDB API.

```
src/
  app/           # Next.js App Router: pages, layouts, API routes
  components/
    ui/          # shadcn/ui components (auto-generated, don't hand-edit)
    Navbar.tsx   # App-level components
  lib/
    tmdb.ts      # Pre-configured Axios instance for TMDB API
    utils.ts     # cn() helper for className merging
```

**Data flow**: All TMDB API calls go through the `tmdb` Axios instance in `src/lib/tmdb.ts`, which injects the bearer token automatically. The token is read from `process.env.TMDB_API_TOKEN` (defined in `.env.local`).

## Key Conventions

**Styling**: Tailwind CSS v4 with CSS variables defined in `src/app/globals.css`. Always use the `cn()` utility from `@/lib/utils` to merge class names:
```ts
import { cn } from "@/lib/utils"
className={cn("base-classes", conditionalClass && "conditional")}
```

**UI components**: shadcn/ui with the `radix-mira` style and **Tabler Icons** (`@tabler/icons-react`). Add new components via `npx shadcn add <component>` — do not hand-write UI primitives that shadcn can generate.

**Path alias**: `@/` maps to `src/`. Always use this alias for imports (e.g., `@/lib/utils`, `@/components/ui/button`).

**React Compiler**: Enabled in `next.config.ts`. Avoid manual `useMemo`/`useCallback` unless there's a specific reason — the compiler handles memoization automatically.

**TMDB API**: Use the `tmdb` Axios instance for all API calls. It targets `https://api.themoviedb.org/3`. Prefer server components / Route Handlers for TMDB fetches to avoid exposing the token to the client.
