# Gitea UI Clone - Next.js Repository Browser

A modern, high-fidelity frontend clone of Gitea's repository interface built with Next.js, TypeScript, and Tailwind CSS. This project demonstrates how to build a sophisticated Git repository browser using Gitea's REST API as a headless backend.

![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0+-38B2AC?style=flat-square&logo=tailwind-css)
![Zustand](https://img.shields.io/badge/Zustand-5.0+-FF6B6B?style=flat-square)

## 🌟 Features Implemented

### ✅ Core Repository Functionality

- [x] **Repository Overview** - Display repository metadata, description, and statistics
- [x] **File Browser** - Navigate directories and view file listings with icons
- [x] **File Viewer** - View file contents with syntax highlighting support
- [x] **Branch Switching** - Dynamic branch selector with real repository branches
- [x] **Breadcrumb Navigation** - Intuitive path navigation with clickable segments
- [x] **Latest Commit Display** - Show recent commit information

### ✅ Navigation & State Management

- [x] **SearchParams-based Navigation** - Clean URLs with path and ref parameters
- [x] **Zustand State Management** - Reactive state management for repository data
- [x] **Next.js App Router** - Modern routing with server-side rendering
- [x] **URL State Synchronization** - Browser back/forward support
- [x] **Shareable URLs** - Direct links to specific files and directories

### ✅ UI/UX Components

- [x] **Repository Header** - Owner, repo name, privacy badge, stats
- [x] **Navigation Tabs** - Code, Issues, PRs tabs with counters
- [x] **Action Bar** - Branch selector, language display, clone buttons
- [x] **File Browser Table** - Sortable file listings with type icons
- [x] **File Viewer Modal** - Inline file content display
- [x] **Responsive Design** - Mobile-friendly interface

### ✅ File Type Support

- [x] **Text Files** - Syntax highlighting for common programming languages
- [x] **Markdown Files** - Rendered markdown with ReactMarkdown
- [x] **Image Files** - Direct image preview
- [x] **Binary Files** - Download links and file information
- [x] **README Rendering** - Automatic README display in repository root

### ✅ API Integration

- [x] **Repository Metadata** - `GET /repos/{owner}/{repo}`
- [x] **Directory Contents** - `GET /repos/{owner}/{repo}/contents/{path}`
- [x] **File Contents** - Individual file content fetching
- [x] **Branch Listing** - `GET /repos/{owner}/{repo}/branches`
- [x] **Error Handling** - Graceful API error management
- [x] **Loading States** - User feedback during API calls

## 🚧 Missing Features & Future Enhancements

### ❌ Advanced Repository Features

- [ ] **Commit History** - Full commit log with pagination
- [ ] **File History** - Per-file commit history
- [ ] **Blame View** - Line-by-line authorship information
- [ ] **Compare/Diff View** - Branch and commit comparisons
- [ ] **Search Functionality** - Repository-wide file and content search
- [ ] **Tags Support** - Tag listing and navigation

### ❌ Interactive Features

- [ ] **File Operations** - Create, edit, delete files (requires authentication)
- [ ] **Branch Operations** - Create/delete branches
- [ ] **Pull Requests** - View and manage PRs
- [ ] **Issues** - Issue tracking and management
- [ ] **Wiki** - Repository wiki pages
- [ ] **Releases** - Release management

### ❌ Enhanced UI/UX

- [ ] **Syntax Highlighting** - Code syntax highlighting (planned with Prism.js)
- [ ] **File Icons** - More comprehensive file type icons
- [ ] **Keyboard Navigation** - Keyboard shortcuts for common actions
- [ ] **Dark Mode** - Theme switching capability
- [ ] **Advanced Search** - File finder with fuzzy search
- [ ] **Responsive Tables** - Better mobile table experience

### ❌ Performance & Polish

- [ ] **Infinite Scroll** - For large file listings
- [ ] **Virtual Scrolling** - Performance optimization for huge files
- [ ] **Caching Strategy** - Smart API response caching
- [ ] **Loading Skeletons** - Better loading state UI
- [ ] **Error Boundaries** - Comprehensive error handling
- [ ] **SEO Optimization** - Meta tags and social sharing

## 🏗️ Architecture

### Technology Stack

- **Framework**: Next.js 15.5.2 with App Router
- **Language**: TypeScript 5.0+
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Markdown**: ReactMarkdown
- **Icons**: Lucide React

### Project Structure

```
src/
├── app/
│   ├── [user]/[repo]/          # Dynamic repository routes
│   │   ├── components/         # Route-specific components
│   │   │   ├── breadcrumb-nav.tsx
│   │   │   ├── file-browser.tsx
│   │   │   ├── file-viewer.tsx
│   │   │   ├── repo-action-bar.tsx
│   │   │   ├── repo-header.tsx
│   │   │   ├── repo-nav-tabs.tsx
│   │   │   └── repo-provider.tsx
│   │   ├── utils/              # Route-specific utilities
│   │   │   └── navigation.ts   # SearchParams navigation
│   │   ├── actions.ts          # Server Actions for API calls
│   │   ├── store.ts            # Zustand state management
│   │   ├── types.ts            # TypeScript interfaces
│   │   └── page.tsx            # Main repository page
│   ├── globals.css             # Global styles
│   └── layout.tsx              # Root layout
├── components/ui/              # Reusable UI components (shadcn)
└── lib/                        # Shared utilities
```

### API Integration

- **Target**: Gitea REST API v1 (`https://demo.gitea.com/api/v1`)
- **Authentication**: Currently public repositories only
- **Caching**: React cache() for Server Actions
- **Error Handling**: Comprehensive error boundaries and fallbacks

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd gitea-clone

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Usage

1. Navigate to `http://localhost:3000`
2. Visit any repository: `http://localhost:3000/{owner}/{repo}`
3. Example: `http://localhost:3000/ericLemanissier/conan-center-index`

### URL Parameters

- `?path=folder/subfolder` - Navigate to specific directory
- `?ref=branch-name` - Switch to different branch
- `?file=filename.txt` - View specific file
- Combined: `?path=src&ref=develop&file=index.js`

## 🎯 Current Demo

The application is currently configured to work with the Gitea demo instance:

- **Base URL**: `https://demo.gitea.com`
- **Test Repository**: `ericLemanissier/conan-center-index`
- **Features**: Full repository browsing, file viewing, branch switching

## 📚 Documentation

Additional documentation is available in the `docs/` directory:

- `STRUCTURE.md` - Detailed project structure guidelines
- `GUIDELINES.md` - Development conventions and best practices
- `API.md` - Gitea API specification and TypeScript interfaces
- `AGENT.md` - AI collaboration protocol and development workflow
