# Project Development Guidelines

## 1. Introduction

This document outlines the development conventions for this project. Adhering to these guidelines is required to ensure consistency, quality, and a streamlined development process for all contributors.

---

## 2. Core Philosophy: Server-First

This project uses the Next.js App Router. We prioritize server-side rendering and logic to enhance performance and security.

- **Server Components by Default:** All components must be Server Components unless client-side interactivity is required.
- **Server-Side Data Fetching:** API calls to Gitea must be handled by Server Actions co-located with their respective pages.

---

## 3. Directory Structure

We use a **page-based co-location** structure. All files exclusively used by a specific route are stored within that route's directory in the `app/` folder. Globally shared files are kept in root-level directories like `src/components` and `src/stores`.

### Root Directories

- `src/app/`: Contains all application routes.
- `src/components/`: Contains globally reusable components (e.g., `<Card>`, `<Button>`) and layouts (`src/components/layout/`).
- `src/lib/`: For utility functions and library initializations (e.g., `cn.ts`).
- `src/stores/`: For globally shared Zustand stores (e.g., authentication, theme).

### Page-Specific Structure (`app/[user]/[repo]/`)

```
src/app/[user]/[repo]/
├── page.tsx               # The main entry point for the route
├── components/            # Components used ONLY on this page
│   ├── file-browser.tsx
│   └── repo-header.tsx
├── actions.ts             # Server Actions for fetching this page's data
├── store.ts               # Optional: A Zustand store for this page's client state
└── types.ts               # TypeScript types specific to this page
```

---

## 4. Component Architecture

### 4.1. Component Pattern

All React components must follow this structure for consistency and type safety.

```tsx
import React from "react";

interface MyComponentProps {
  title: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title }) => {
  return (
    <div>
      <h1>{title}</h1>
    </div>
  );
};

export default MyComponent;
```

### 4.2. Server vs. Client Components

Only add the `"use client";` directive when a component requires browser-specific functionality.

**Use `"use client";` for components that need:**

- Event Listeners (`onClick`, `onChange`)
- State and Lifecycle Hooks (`useState`, `useEffect`)
- Browser-Only APIs (`window`, `localStorage`)
- Client-Side State Hooks (e.g., from Zustand)

**Best Practice:** Keep client-side logic as minimal and as deep in the component tree as possible.

---

## 5. State Management

**Zustand** is the preferred library for managing client-side state.

- **Global Stores:** For application-wide state (e.g., auth), create stores in `src/stores/`.
- **Local Stores:** For complex state tied to a specific page, create stores inside that page's directory (e.g., `src/app/[user]/[repo]/stores/repo-form.store.ts`).

---

## 6. Styling

- **Tailwind CSS:** All styling must be done with Tailwind CSS utility classes.
- **Shadcn/ui:** Use `shadcn/ui` components from `src/components/ui` as the primary building blocks.
- **Conditional Classes:** Use the `cn` utility (a combination of `clsx` and `tailwind-merge`) for conditional styling.

---

## 7. Version Control

- **Branching:** Use `feature/short-description` or `fix/bug-name` for branch names.
- **Commits:** Adhere to the [**Conventional Commits**](https://www.conventionalcommits.org/en/v1.0.0/) specification.
  - Examples: `feat: add file browser component`, `fix: correct branch selector state`, `docs: update API.md`
