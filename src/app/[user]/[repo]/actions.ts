import { cache } from "react";
import axios from "axios";
import type {
  IGetRepoResponse,
  IGetRepoContentsResponse,
  IGetRepoBranchesResponse,
  IGetRepoCommitsResponse,
  IGetFileContentResponse,
  IPostMarkdownResponse,
  IContentItem,
  IAPIError,
  IAPIResponse,
} from "./types";

// Base URL for Gitea API (using demo instance for development)
const GITEA_API_BASE = "https://demo.gitea.com/api/v1";

// Configure axios with default settings
const api = axios.create({
  baseURL: GITEA_API_BASE,
  timeout: 10000, // 10 second timeout
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Helper function to create consistent error responses
const createErrorResponse = <T>(
  error: unknown,
  defaultMessage: string
): IAPIResponse<T> => {
  if (axios.isAxiosError(error)) {
    return {
      error: {
        code: error.response?.status || 500,
        message: error.response?.statusText || defaultMessage,
        details: error.message,
      },
    };
  }

  return {
    error: {
      code: 500,
      message: defaultMessage,
      details: String(error),
    },
  };
};

// Helper function to create success response
const createSuccessResponse = <T>(data: T): IAPIResponse<T> => ({
  data,
});

/**
 * Fetch repository metadata
 */
export const getRepository = cache(
  async (owner: string, repo: string): Promise<IGetRepoResponse> => {
    try {
      const response = await api.get(`/repos/${owner}/${repo}`);
      return createSuccessResponse(response.data);
    } catch (error) {
      return createErrorResponse(error, "Failed to fetch repository");
    }
  }
);

/**
 * Fetch repository contents (files and directories) for a given path
 */
export const getRepositoryContents = cache(
  async (
    owner: string,
    repo: string,
    path: string = "",
    ref?: string
  ): Promise<IGetRepoContentsResponse> => {
    try {
      const params: Record<string, string> = {};
      if (ref) {
        params.ref = ref;
      }

      const response = await api.get(
        `/repos/${owner}/${repo}/contents/${path}`,
        { params }
      );
      return createSuccessResponse(response.data);
    } catch (error) {
      return createErrorResponse(error, "Failed to fetch repository contents");
    }
  }
);

/**
 * Fetch a single file's content
 */
export const getFileContent = cache(
  async (
    owner: string,
    repo: string,
    filepath: string,
    ref?: string
  ): Promise<IGetFileContentResponse> => {
    try {
      const params: Record<string, string> = {};
      if (ref) {
        params.ref = ref;
      }

      const response = await api.get(
        `/repos/${owner}/${repo}/contents/${filepath}`,
        { params }
      );
      return createSuccessResponse(response.data);
    } catch (error) {
      return createErrorResponse(error, "Failed to fetch file content");
    }
  }
);

/**
 * Fetch repository README
 */
export const getRepositoryREADME = cache(
  async (owner: string, repo: string): Promise<IGetFileContentResponse> => {
    try {
      const response = await api.get(`/repos/${owner}/${repo}/raw/README.md`);
      return createSuccessResponse(response.data);
    } catch (error) {
      return createErrorResponse(error, "Failed to fetch repository README");
    }
  }
);

/**
 * Fetch repository branches
 */
export const getRepositoryBranches = cache(
  async (owner: string, repo: string): Promise<IGetRepoBranchesResponse> => {
    try {
      const response = await api.get(`/repos/${owner}/${repo}/branches`);
      return createSuccessResponse(response.data);
    } catch (error) {
      return createErrorResponse(error, "Failed to fetch repository branches");
    }
  }
);

/**
 * Fetch repository commits
 */
export const getRepositoryCommits = cache(
  async (
    owner: string,
    repo: string,
    options?: { limit?: number; ref?: string }
  ): Promise<IGetRepoCommitsResponse> => {
    try {
      const params: Record<string, string> = {};
      if (options?.limit) {
        params.limit = options.limit.toString();
      }
      if (options?.ref) {
        params.sha = options.ref;
      }

      const response = await api.get(`/repos/${owner}/${repo}/commits`, {
        params,
      });
      return createSuccessResponse(response.data);
    } catch (error) {
      return createErrorResponse(error, "Failed to fetch repository commits");
    }
  }
);

/**
 * Render markdown content via Gitea API
 * Falls back to returning raw markdown for client-side rendering with react-markdown
 */
export const renderMarkdown = async (
  content: string
): Promise<IPostMarkdownResponse> => {
  try {
    // Try to use Gitea's markdown endpoint
    const response = await axios.post(
      `${GITEA_API_BASE}/markdown`,
      {
        Text: content,
        Mode: "gfm",
        Context: "",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "text/html",
        },
        responseType: "text",
        timeout: 5000, // Shorter timeout for markdown
      }
    );

    return createSuccessResponse(response.data);
  } catch (error) {
    // If Gitea markdown endpoint fails, return raw markdown for client-side rendering
    console.warn(
      "Gitea markdown endpoint unavailable, returning raw markdown for client-side rendering"
    );
    return createSuccessResponse(content);
  }
};

/**
 * Decode base64 file content
 */
export const decodeFileContent = (base64Content: string): string => {
  return Buffer.from(base64Content, "base64").toString("utf-8");
};
