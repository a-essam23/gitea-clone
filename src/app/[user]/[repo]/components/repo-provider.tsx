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
}

const RepoProvider: React.FC<RepoProviderProps> = ({
  children,
  repository,
  contents,
  latestCommit,
  currentRef,
}) => {
  const { setRepository, setContents, setLatestCommit, setCurrentRef } =
    useRepoStore();

  useEffect(() => {
    setRepository(repository);
    setContents(contents);
    setLatestCommit(latestCommit);
    setCurrentRef(currentRef);
  }, [
    repository,
    contents,
    latestCommit,
    currentRef,
    setRepository,
    setContents,
    setLatestCommit,
    setCurrentRef,
  ]);

  return <>{children}</>;
};

export default RepoProvider;
