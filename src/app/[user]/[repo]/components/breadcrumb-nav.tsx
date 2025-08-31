"use client";

import React from "react";
import { ChevronRight, Home } from "lucide-react";
import { useRepoStore } from "../store";
import { useRepoNavigation } from "../utils/navigation";

const BreadcrumbNav: React.FC = () => {
  const repository = useRepoStore((state) => state.repository);
  const currentPath = useRepoStore((state) => state.currentPath);
  const currentRef = useRepoStore((state) => state.currentRef);

  const { navigateToPath, navigateToRoot } = useRepoNavigation();

  if (!repository) {
    return null;
  }

  // Split the current path into segments
  const pathSegments = currentPath.split("/").filter(Boolean);

  const handleSegmentClick = (segmentIndex: number) => {
    if (segmentIndex === -1) {
      // Root navigation
      navigateToRoot();
    } else {
      // Navigate to specific segment
      const targetPath = pathSegments.slice(0, segmentIndex + 1).join("/");
      navigateToPath(targetPath);
    }
  };

  return (
    <div className="flex items-center space-x-1 text-sm mb-4 p-3 bg-muted/30 rounded-md">
      {/* Repository root */}
      <button
        onClick={() => handleSegmentClick(-1)}
        className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
      >
        <Home className="h-4 w-4" />
        <span className="font-medium">{repository.name}</span>
      </button>

      {/* Current branch indicator */}
      <span className="text-muted-foreground">on</span>
      <span className="font-mono text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
        {currentRef}
      </span>

      {/* Path segments */}
      {pathSegments.map((segment, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <button
            onClick={() => handleSegmentClick(index)}
            className="hover:text-blue-600 transition-colors font-medium"
          >
            {segment}
          </button>
        </React.Fragment>
      ))}

      {/* Current directory indicator */}
      {pathSegments.length === 0 && (
        <>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">root</span>
        </>
      )}
    </div>
  );
};

export default BreadcrumbNav;
