"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Folder, File, FileText, Image, Code } from "lucide-react";
import { useRepoStore } from "../store";
import { useRepoNavigation } from "../utils/navigation";
import type { IContentItem } from "../types";

const FileBrowser: React.FC = () => {
  const repository = useRepoStore((state) => state.repository);
  const contents = useRepoStore((state) => state.contents);
  const currentPath = useRepoStore((state) => state.currentPath);
  const currentRef = useRepoStore((state) => state.currentRef);
  const isLoadingContents = useRepoStore((state) => state.isLoadingContents);

  const { navigateToPath, selectFile } = useRepoNavigation();

  if (!repository) {
    return null;
  }

  const handleItemClick = (item: IContentItem) => {
    if (item.type === "dir") {
      // Navigate to directory
      const newPath = currentPath ? `${currentPath}/${item.name}` : item.name;
      navigateToPath(newPath);
    } else {
      // Select file for viewing
      selectFile(item.name);
    }
  };

  const getFileIcon = (item: IContentItem) => {
    if (item.type === "dir") {
      return <Folder className="h-4 w-4 text-blue-600" />;
    }

    const extension = item.name.split(".").pop()?.toLowerCase();

    switch (extension) {
      case "md":
      case "txt":
      case "rst":
        return <FileText className="h-4 w-4 text-blue-600" />;
      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
      case "svg":
        return <Image className="h-4 w-4 text-green-600" />;
      case "js":
      case "ts":
      case "jsx":
      case "tsx":
      case "py":
      case "java":
      case "go":
      case "rs":
      case "cpp":
      case "c":
        return <Code className="h-4 w-4 text-purple-600" />;
      default:
        return <File className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const buildHref = (item: IContentItem) => {
    const basePath = `/${repository.owner.login}/${repository.name}`;
    if (item.type === "dir") {
      return `${basePath}/tree/${currentRef}/${item.path}`;
    } else {
      return `${basePath}/blob/${currentRef}/${item.path}`;
    }
  };

  // Sort contents: directories first, then files, both alphabetically
  const sortedContents = [...contents].sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === "dir" ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });

  return (
    <Card className="mb-4">
      <div className="divide-y">
        {/* Header */}
        <div className="px-4 py-3 bg-muted/50">
          <div className="flex items-center justify-between text-sm font-medium">
            <span>{contents.length} items</span>
            {currentPath && (
              <span className="text-muted-foreground">
                Current path: {currentPath}
              </span>
            )}
          </div>
        </div>

        {/* File listing */}
        {sortedContents.map((item) => (
          <div
            key={item.path}
            className="px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer"
            onClick={() => handleItemClick(item)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                {getFileIcon(item)}

                <span className="font-medium hover:text-blue-600">
                  {item.name}
                </span>

                {item.type === "dir" && (
                  <Badge variant="outline" className="text-xs">
                    Directory
                  </Badge>
                )}
              </div>

              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                {/* File size (for files only) */}
                {item.type === "file" && (
                  <span>{formatFileSize(item.size)}</span>
                )}

                {/* TODO: Add last commit message and date when available */}
                <span>Latest commit</span>
              </div>
            </div>
          </div>
        ))}

        {/* Empty state */}
        {contents.length === 0 && (
          <div className="px-4 py-8 text-center text-muted-foreground">
            <Folder className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>This directory is empty.</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default FileBrowser;
