# Gitea API Specification for Next.js UI Clone

## Table of Contents

1.  [Introduction](#1-introduction)
2.  [Core Repository APIs](#2-core-repository-apis)
3.  [Content & File Browser APIs](#3-content--file-browser-apis)
4.  [Branch & Tag APIs](#4-branch--tag-apis)
5.  [Commit APIs](#5-commit-apis)
6.  [Write Operations (Placeholders)](#6-write-operations-placeholders)
7.  [Appendix: TypeScript Interfaces](#7-appendix-typescript-interfaces)

---

## 1. Introduction

This document provides a comprehensive specification for the Gitea API endpoints required to build the frontend of our Next.js application. It details the data structures, endpoint purposes, and intended usage for recreating the "Code" view of a Gitea repository. All data types are defined using TypeScript interfaces in the appendix for clarity and to guide development.

---

## 2. Core Repository APIs

This section covers the foundational endpoint used to fetch the main details of a repository.

### GET `/repos/{owner}/{repo}`

- **Purpose:** Retrieves the complete metadata for a single repository.
- **Usage:** This is the primary API call made when a user lands on the repository page. The data from this endpoint is used to populate the header, sidebars, and determine which UI elements (like tabs for Issues or Wiki) should be rendered. The `default_branch` property is essential for subsequent calls to fetch file content.
- **Response Type:** `Promise<IGetRepoResponse>`

---

## 3. Content & File Browser APIs

These endpoints are responsible for fetching the data needed to display the file tree, view file contents, and render the README.

### GET `/repos/{owner}/{repo}/contents`

- **Purpose:** Retrieves the list of files and directories for a given path within the repository.
- **Usage:** Called initially with no path to get the root directory listing. It's re-called whenever a user navigates into a subdirectory. The `ref` query parameter can be used to specify a branch or tag.
- **Response Type:** `Promise<IGetRepoContentsResponse>` (which is `IContentItem[]`)

### GET `/repos/{owner}/{repo}/contents/{filepath}`

- **Purpose:** Retrieves the metadata and content of a single file.
- **Usage:** Called when a user clicks on a file. The `content` property will be a Base64 encoded string that must be decoded before use. For markdown files, this content will be passed to the `/markdown` endpoint.
- **Response Type:** `Promise<IContentItem>`

### POST `/markdown`

- **Purpose:** Renders a given string of Markdown text into safe HTML.
- **Usage:** After fetching a `README.md` file's content and decoding it, the resulting string is sent as the body of this POST request. This prevents potential XSS attacks by ensuring the markdown is rendered on the server side.
- **Response Type:** `Promise<IPostMarkdownResponse>` (which is `string`)

### GET `/repos/{owner}/{repo}/raw/{filepath}`

- **Purpose:** Retrieves the raw, unprocessed content of a file.
- - **Usage:** Used to power "View Raw" buttons. The browser will handle rendering the content based on the `Content-Type` header returned by the API (e.g., `text/plain`, `image/png`).
- **Response Type:** `Promise<Blob | string>`
  - _Note: The response from this endpoint is not JSON. It is the raw file data itself. The return type in the application will likely be a `Blob` or `string` depending on the file type._

---

## 4. Branch & Tag APIs

These endpoints provide the necessary data to populate the branch and tag selection UI.

### GET `/repos/{owner}/{repo}/branches`

- **Purpose:** Retrieves a list of all branches in the repository.
- **Usage:** Called once on page load to populate the branch selection dropdown menu.
- **Response Type:** `Promise<IGetRepoBranchesResponse>` (which is `IBranch[]`)

### GET `/repos/{owner}/{repo}/tags`

- **Purpose:** Retrieves a list of all tags in the repository.
- **Usage:** Called once on page load to populate the tag section of the branch/tag dropdown.
- **Response Type:** `Promise<IGetRepoTagsResponse>` (which is `ITag[]`)

---

## 5. Commit APIs

This section covers the API for fetching commit history.

### GET `/repos/{owner}/{repo}/commits`

- **Purpose:** Retrieves a paginated list of commits for a given branch.
- **Usage:**
  1.  **Latest Commit:** Called with a `limit=1` query parameter to fetch the single most recent commit for display above the file browser.
  2.  **Commit History Page:** Called without a limit to populate the full "Commits" tab, using the `page` parameter for pagination.
- **Response Type:** `Promise<IGetRepoCommitsResponse>`
  - _Note: The provided schema was very simple (`{ message, url }`). I have defined a more realistic `ICommit` interface based on the detailed commit object found in the `/branches` response. This should be verified against the actual API output._

---

## 6. Write Operations (Placeholders)

The following endpoints are required for file creation, modification, and deletion. They are documented here as placeholders for future implementation.

### POST `/repos/{owner}/{repo}/contents/{filepath}`

- **Purpose:** Creates a new file in the repository.

### PUT `/repos/{owner}/{repo}/contents/{filepath}`

- **Purpose:** Updates (commits changes to) an existing file.

### DELETE `/repos/{owner}/{repo}/contents/{filepath}`

- **Purpose:** Deletes a file from the repository.

---

## 7. Appendix: TypeScript Interfaces

This section contains all the TypeScript interfaces that define the expected shapes of the API responses.

```typescript
// ------------------------------
// 2. Core Repository APIs
// ------------------------------

interface IRepoOwner {
  id: number;
  login: string;
  full_name: string;
  email: string;
  avatar_url: string;
  html_url: string;
}

interface IRepoPermissions {
  admin: boolean;
  push: boolean;
  pull: boolean;
}

interface IGetRepoResponse {
  id: number;
  owner: IRepoOwner;
  name: string;
  full_name: string;
  description: string;
  empty: boolean;
  private: boolean;
  fork: boolean;
  template: boolean;
  parent?: any; // Note: Define a proper IGetRepoResponse if needed.
  mirror: boolean;
  size: number;
  html_url: string;
  ssh_url: string;
  clone_url: string;
  website: string;
  stars_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  open_pr_counter: number;
  release_counter: number;
  default_branch: string;
  archived: boolean;
  created_at: string; // ISO 8601 Date
  updated_at: string; // ISO 8601 Date
  permissions: IRepoPermissions;
  has_issues: boolean;
  has_wiki: boolean;
  has_pull_requests: boolean;
  has_projects: boolean;
  has_releases: boolean;
  has_packages: boolean;
  has_actions: boolean;
  language: string;
  languages_url: string;
  topics: string[];
}

// ------------------------------
// 3. Content & File Browser APIs
// ------------------------------

interface IContentLinks {
  git: string;
  html: string;
  self: string;
}

interface IContentItem {
  _links: IContentLinks;
  name: string;
  path: string;
  sha: string;
  type: "file" | "dir" | "symlink" | "submodule";
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  // Fields for file content response
  content?: string; // Base64 encoded
  encoding?: string; // e.g., "base64"
  // Fields for directory listing response
  last_commit_sha?: string;
  last_commit_message?: string;
  last_author_date?: string; // ISO 8601 Date
  last_committer_date?: string; // ISO 8601 Date
}

// Response for GET /contents (directory)
type IGetRepoContentsResponse = IContentItem[];

// Response for POST /markdown
type IPostMarkdownResponse = string;

// Response for GET /raw/{filepath}
type IGetRepoRawResponse = Blob | string;

// ------------------------------
// 4. Branch & Tag APIs
// ------------------------------

interface ICommitUser {
  name: string;
  email: string;
  username: string;
}

interface ICommitVerification {
  verified: boolean;
  reason: string;
  signature: string;
  signer: ICommitUser | null;
  payload: string;
}

interface IBranchCommit {
  id: string;
  message: string;
  url: string;
  author: ICommitUser;
  committer: ICommitUser;
  timestamp: string; // ISO 8601 Date
  verification: ICommitVerification;
}

interface IBranch {
  name: string;
  commit: IBranchCommit;
  protected: boolean;
  required_approvals: number;
  enable_status_check: boolean;
  status_check_contexts: string[];
  user_can_push: boolean;
  user_can_merge: boolean;
}

type IGetRepoBranchesResponse = IBranch[];

interface ITagCommit {
  sha: string;
  url: string;
  created: string; // ISO 8601 Date
}

interface ITag {
  id: string;
  name: string;
  message: string;
  commit: ITagCommit;
  tarball_url: string;
  zipball_url: string;
}

type IGetRepoTagsResponse = ITag[];

// ------------------------------
// 5. Commit APIs
// ------------------------------

// Note: This interface is an educated guess based on standard Git APIs
// and the detailed commit object from the IBranch interface.
// The user-provided schema `{ message, url }` was too simplistic.
// This should be verified against the actual API response.
interface ICommit {
  sha: string;
  url: string;
  message: string;
  author: ICommitUser;
  committer: ICommitUser;
  created: string; // ISO 8601 Date
}

type IGetRepoCommitsResponse = ICommit[];
```
