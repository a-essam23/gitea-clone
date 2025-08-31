"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

/**
 * Custom hook for managing repository navigation with searchParams
 */
export const useRepoNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateSearchParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams);

      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }

      const newUrl = `${pathname}?${params.toString()}`;
      router.push(newUrl);
    },
    [router, pathname, searchParams]
  );

  const updateMultipleParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams);

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      const newUrl = `${pathname}?${params.toString()}`;
      router.push(newUrl);
    },
    [router, pathname, searchParams]
  );

  const navigateToPath = useCallback(
    (path: string) => {
      updateMultipleParams({
        path: path,
        file: null, // Clear selected file when navigating to new path
      });
    },
    [updateMultipleParams]
  );

  const selectFile = useCallback(
    (filename: string | null) => {
      updateSearchParam("file", filename);
    },
    [updateSearchParam]
  );

  const switchBranch = useCallback(
    (ref: string) => {
      updateMultipleParams({
        ref: ref,
        file: null, // Clear selected file when switching branches
      });
    },
    [updateMultipleParams]
  );

  const navigateToParent = useCallback(() => {
    const currentPath = searchParams.get("path") || "";
    const pathSegments = currentPath.split("/").filter(Boolean);

    if (pathSegments.length > 0) {
      pathSegments.pop(); // Remove last segment
      const parentPath = pathSegments.join("/");
      navigateToPath(parentPath);
    }
  }, [searchParams, navigateToPath]);

  const navigateToRoot = useCallback(() => {
    navigateToPath("");
  }, [navigateToPath]);

  return {
    updateSearchParam,
    updateMultipleParams,
    navigateToPath,
    selectFile,
    switchBranch,
    navigateToParent,
    navigateToRoot,
    currentPath: searchParams.get("path") || "",
    currentRef: searchParams.get("ref") || "",
    selectedFile: searchParams.get("file") || null,
  };
};
