"use client";

import React, { useEffect } from "react";
import { useRepoStore } from "../store";
import type { IRepository, IContentItem, ICommit } from "../types";

interface RepoProviderProps {
  children: React.ReactNode;
  repository: IRepository;
  contents: IContentItem[];
  latestCommit: ICommit | null;
  currentRef: string;
  currentPath: string;
  selectedFile: string | null;
}

const RepoProvider: React.FC<RepoProviderProps> = ({
  children,
  repository,
  contents,
  latestCommit,
  currentRef,
  currentPath,
  selectedFile,
}) => {
  const {
    setRepository,
    setContents,
    setLatestCommit,
    setCurrentRef,
    setCurrentPath,
    setSelectedFile,
  } = useRepoStore();

  useEffect(() => {
    setRepository(repository);
    setContents(contents);
    setLatestCommit(latestCommit);
    setCurrentRef(currentRef);
    setCurrentPath(currentPath);
    setSelectedFile(selectedFile);
  }, [
    repository,
    contents,
    latestCommit,
    currentRef,
    currentPath,
    selectedFile,
    setRepository,
    setContents,
    setLatestCommit,
    setCurrentRef,
    setCurrentPath,
    setSelectedFile,
  ]);

  return <>{children}</>;
};

export default RepoProvider;
