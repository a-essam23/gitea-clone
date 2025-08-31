import { create } from "zustand";
import type {
  IRepository,
  IContentItem,
  ICommit,
  IBranch,
  IFileContent,
} from "./types";

interface RepoState {
  // Repository data
  repository: IRepository | null;
  contents: IContentItem[];
  latestCommit: ICommit | null;

  // Navigation state
  currentPath: string; // Current directory path
  currentRef: string; // Current branch/tag
  selectedFile: string | null; // Currently selected file
  availableBranches: IBranch[]; // List of repository branches

  // Content data
  fileContent: IFileContent | null; // Selected file content

  // Loading states
  isLoading: boolean;
  isLoadingContents: boolean;
  isLoadingFile: boolean;
  isLoadingBranches: boolean;

  // Repository actions
  setRepository: (repo: IRepository) => void;
  setContents: (contents: IContentItem[]) => void;
  setLatestCommit: (commit: ICommit | null) => void;
  setLoading: (loading: boolean) => void;

  // Navigation actions
  setCurrentPath: (path: string) => void;
  setCurrentRef: (ref: string) => void;
  setSelectedFile: (filename: string | null) => void;
  setBranches: (branches: IBranch[]) => void;
  setFileContent: (content: IFileContent | null) => void;
  setLoadingContents: (loading: boolean) => void;
  setLoadingFile: (loading: boolean) => void;
  setLoadingBranches: (loading: boolean) => void;

  // Navigation helpers
  navigateToPath: (path: string) => void;
  selectFile: (filename: string | null) => void;
  switchBranch: (ref: string) => void;

  reset: () => void;
}

const initialState = {
  repository: null,
  contents: [],
  latestCommit: null,
  currentPath: "",
  currentRef: "main",
  selectedFile: null,
  availableBranches: [],
  fileContent: null,
  isLoading: false,
  isLoadingContents: false,
  isLoadingFile: false,
  isLoadingBranches: false,
};

export const useRepoStore = create<RepoState>((set, get) => ({
  ...initialState,

  // Repository actions
  setRepository: (repository) => set({ repository }),
  setContents: (contents) => set({ contents }),
  setLatestCommit: (latestCommit) => set({ latestCommit }),
  setLoading: (isLoading) => set({ isLoading }),

  // Navigation actions
  setCurrentPath: (currentPath) => set({ currentPath }),
  setCurrentRef: (currentRef) => set({ currentRef }),
  setSelectedFile: (selectedFile) => set({ selectedFile }),
  setBranches: (availableBranches) => set({ availableBranches }),
  setFileContent: (fileContent) => set({ fileContent }),
  setLoadingContents: (isLoadingContents) => set({ isLoadingContents }),
  setLoadingFile: (isLoadingFile) => set({ isLoadingFile }),
  setLoadingBranches: (isLoadingBranches) => set({ isLoadingBranches }),

  // Navigation helpers (these will use the navigation hook in components)
  navigateToPath: (path: string) => {
    set({ currentPath: path, selectedFile: null });
    // Router navigation handled by useRepoNavigation hook in components
  },

  selectFile: (filename: string | null) => {
    set({ selectedFile: filename });
    // Router navigation handled by useRepoNavigation hook in components
  },

  switchBranch: (ref: string) => {
    set({ currentRef: ref, selectedFile: null });
    // Router navigation handled by useRepoNavigation hook in components
  },

  reset: () => set(initialState),
}));
