import { create } from "zustand";
import type { IRepository, IContentItem, ICommit } from "./types";

interface RepoState {
  // Repository data
  repository: IRepository | null;
  contents: IContentItem[];
  latestCommit: ICommit | null;
  currentRef: string;

  // Loading states
  isLoading: boolean;

  // Actions
  setRepository: (repo: IRepository) => void;
  setContents: (contents: IContentItem[]) => void;
  setLatestCommit: (commit: ICommit | null) => void;
  setCurrentRef: (ref: string) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

const initialState = {
  repository: null,
  contents: [],
  latestCommit: null,
  currentRef: "main",
  isLoading: false,
};

export const useRepoStore = create<RepoState>((set) => ({
  ...initialState,

  setRepository: (repository) => set({ repository }),
  setContents: (contents) => set({ contents }),
  setLatestCommit: (latestCommit) => set({ latestCommit }),
  setCurrentRef: (currentRef) => set({ currentRef }),
  setLoading: (isLoading) => set({ isLoading }),
  reset: () => set(initialState),
}));
