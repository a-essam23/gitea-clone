# Gitea UI Clone - AI Coding Agent Instructions

## Project Architecture Overview

This is a **Next.js App Router** project that recreates Gitea's frontend using modern React patterns. The core architecture prioritizes **server-first rendering** with strict component co-location principles.

### Key Architectural Decisions

- **Server Components by default** - Only add `"use client"` when browser APIs or interactivity is required
- **Page-based co-location** - All route-specific code lives within that route's `app/` directory
- **API integration** - Uses Gitea's REST API (dev target: `https://demo.gitea.com/api/v1`) via Server Actions
- **State management** - Zustand for client state, with stores co-located by scope (global vs page-specific)

## Critical File Organization Pattern

```
src/app/[user]/[repo]/          # Main repository route
├── page.tsx                    # Entry point - assembles layout components
├── components/                 # Route-exclusive components
│   ├── repo-header.tsx        # Breadcrumbs, stars, watch/fork buttons
│   ├── repo-nav-tabs.tsx      # "Code", "Issues", "PR" tabs with counters
│   ├── repo-action-bar.tsx    # Branch selector, clone dropdown
│   ├── latest-commit.tsx      # Last commit info display
│   ├── file-browser.tsx       # Directory/file listing with commit messages
│   └── readme-viewer.tsx      # Rendered README below file browser
├── actions.ts                  # Server Actions for Gitea API calls
├── types.ts                    # TypeScript interfaces for this page
└── store.ts                    # Optional page-specific Zustand store
```

## Essential Development Commands

```bash
# Development with Turbopack (faster)
pnpm dev

# Production build with Turbopack
pnpm build --turbopack

# Linting
pnpm lint
```

## Component Architecture Patterns

### Standard Component Structure

```tsx
import React from "react";

interface ComponentProps {
  title: string;
}

const Component: React.FC<ComponentProps> = ({ title }) => {
  return <div>{title}</div>;
};

export default Component;
```

### When to Use Client Components

Only add `"use client";` for:

- Event handlers (`onClick`, `onChange`)
- React hooks (`useState`, `useEffect`)
- Browser APIs (`window`, `localStorage`)
- Zustand client stores

**Critical**: Keep client logic minimal and deep in component tree.

## API Integration Patterns

### Server Actions Pattern (in `actions.ts`)

```tsx
import { cache } from "react";

export const getRepository = cache(async (owner: string, repo: string) => {
  const response = await fetch(`/repos/${owner}/${repo}`);
  return response.json() as IGetRepoResponse;
});
```

### Key Gitea API Endpoints

- `GET /repos/{owner}/{repo}` - Repository metadata
- `GET /repos/{owner}/{repo}/contents/{path}` - File/directory listing
- `GET /repos/{owner}/{repo}/branches` - Branch list for selector
- `GET /repos/{owner}/{repo}/commits?limit=1` - Latest commit for display
- `POST /markdown` - Server-side markdown rendering (prevents XSS)

## Styling and UI Standards

- **Tailwind CSS only** - No custom CSS except in `globals.css`
- **shadcn/ui components** - Use from `@/components/ui` & To install new components use `pnpm dlx shadcn@latest add [component]`
- **Conditional styling** - Use `cn()` utility (combines `clsx` + `tailwind-merge`)
- **shadcn configuration** - New York style, RSC enabled, Lucide icons

## State Management Strategy

### Global State (`src/stores/`)

```tsx
// For app-wide concerns like auth, theme
export const useAuthStore = create<AuthState>((set) => ({
  // ...
}));
```

### Page-specific State (co-located in route directory)

```tsx
// src/app/[user]/[repo]/store.ts
export const useRepoStore = create<RepoState>((set) => ({
  // Complex repository page state
}));
```

## TypeScript Integration

- **API types** - Comprehensive interfaces defined in `docs/API.md`
- **Page-specific types** - Co-located in each route's `types.ts`
- **Response types** - Follow pattern: `IGet{Resource}Response`, `IPost{Resource}Response`

## Version Control Conventions

- **Branches**: `feature/short-description` or `fix/bug-name`
- **Commits**: Conventional Commits format (`feat:`, `fix:`, `docs:`, etc.)

## Documentation Sources

Always reference these project docs before making architectural decisions:

- `docs/STRUCTURE.md` - Detailed file organization patterns
- `docs/GUIDELINES.md` - Complete development conventions
- `docs/API.md` - Gitea API specification with TypeScript interfaces
- `docs/AGENT.md` - AI collaboration protocol (Plan-Confirm-Execute cycle)

## Critical Integration Points

- **Markdown rendering** - Must use Gitea's `/markdown` endpoint for security
- **File content** - Base64 decode content from `/contents/{filepath}`
- **Branch navigation** - Branch selector affects all subsequent API calls via `ref` parameter
- **URL structure** - Mirrors Gitea's `/{user}/{repo}` routing exactly
