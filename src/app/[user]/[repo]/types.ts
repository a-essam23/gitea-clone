// TypeScript interfaces for Gitea API responses used in the repository page

// Unified API Error interface
export interface IAPIError {
  code: number;
  message: string;
  details?: string;
}

// Unified API Response interface
export interface IAPIResponse<T> {
  data?: T;
  error?: IAPIError;
}

export interface IRepository {
  id: number;
  name: string;
  full_name: string;
  description: string;
  private: boolean;
  fork: boolean;
  html_url: string;
  clone_url: string;
  ssh_url: string;
  default_branch: string;
  stars_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  size: number;
  language: string;
  created_at: string;
  updated_at: string;
  owner: {
    id: number;
    login: string;
    full_name: string;
    avatar_url: string;
    html_url: string;
  };
}

export interface IContentItem {
  name: string;
  path: string;
  sha: string;
  size: number;
  type: "file" | "dir";
  download_url?: string;
  html_url: string;
  content?: string; // Base64 encoded for files
  encoding?: string;
  target?: string; // For symlinks
}

export interface IBranch {
  name: string;
  commit: {
    id: string;
    message: string;
    url: string;
    author: {
      name: string;
      email: string;
      username: string;
    };
    committer: {
      name: string;
      email: string;
      username: string;
    };
    timestamp: string;
  };
  protected: boolean;
}

export interface ICommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      email: string;
      date: string;
    };
    committer: {
      name: string;
      email: string;
      date: string;
    };
  };
  author: {
    id: number;
    login: string;
    avatar_url: string;
  } | null;
  committer: {
    id: number;
    login: string;
    avatar_url: string;
  } | null;
  html_url: string;
}

// API Response Types - Updated to use unified response pattern
export type IGetRepoResponse = IAPIResponse<IRepository>;
export type IGetRepoContentsResponse = IAPIResponse<IContentItem[]>;
export type IGetRepoBranchesResponse = IAPIResponse<IBranch[]>;
export type IGetRepoCommitsResponse = IAPIResponse<ICommit[]>;
export type IGetFileContentResponse = IAPIResponse<IContentItem>;
export type IPostMarkdownResponse = IAPIResponse<string>;
