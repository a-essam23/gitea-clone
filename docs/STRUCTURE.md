# Project File Structure

## 1. Introduction

This document provides a high-level overview of the intended file and directory structure for the project. It outlines where to place components, pages, and logic based on the co-location principles defined in our guidelines.

**Note:** This structure is a starting point and is expected to evolve as the project grows and new features are added. Its purpose is to establish a clear and consistent foundation.

---

## 2. Root Directory Structure

The `src` directory is organized to separate global concerns from page-specific logic.

```
/src
├── app/                  # Application routes and pages
├── components/           # Globally shared, reusable components
│   ├── layout/           # Main layout components (Header, Footer, Sidebar)
│   └── ui/               # Unmodified shadcn/ui components (e.g., button.tsx)
├── lib/                  # Utility functions and library initializations (e.g., cn.ts)
├── stores/               # Global Zustand stores (e.g., authStore)
└── styles/               # Global stylesheets
```

---

## 3. Repository Page Structure (`app/[user]/[repo]/`)

Following Gitea's routing, the main repository view will live at the `/[user]/[repo]` route. All logic, components, and types specific to this view will be co-located within this directory.

### 3.1. Directory Layout

```
/src/app/[user]/[repo]
├── page.tsx               # Entry point: Fetches data and assembles the page layout
├── components/            # Folder for all components used exclusively on this page
├── actions.ts             # Server Actions to fetch data from the Gitea API
└── types.ts               # TypeScript interfaces for this page's data structures
```

### 3.2. Component Breakdown

The repository page will be composed of several distinct, high-level components. These components will reside in `/src/app/[user]/[repo]/components/`.

- `repo-header.tsx`

  - **Responsibility:** Displays the repository breadcrumbs (owner/name), a "Public/Private" badge, and the primary action buttons for watching, starring, and forking.

- `repo-nav-tabs.tsx`

  - **Responsibility:** Renders the main navigation tabs for the repository view ("Code", "Issues", "Pull Requests", etc.) along with their respective item counters.

- `repo-action-bar.tsx`

  - **Responsibility:** The secondary action bar that contains the branch/tag selector dropdown and the "Clone" URL dropdown button.

- `latest-commit.tsx`

  - **Responsibility:** A small component that displays information about the latest commit for the current branch, including the author, message, and commit SHA.

- `file-browser.tsx`

  - **Responsibility:** The main component for displaying the file and directory tree. It will render a list of items, each with its name, last commit message, and last update time. This will likely be composed of smaller sub-components (e.g., `file-list-item.tsx`).

- `readme-viewer.tsx`
  - **Responsibility:** Fetches the rendered HTML for the repository's README file and displays it below the file browser.

This component-based architecture will allow us to build each section of the page in isolation before assembling them in the main `page.tsx` file.
