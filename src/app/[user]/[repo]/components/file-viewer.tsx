"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Download,
  Eye,
  FileText,
  Image as ImageIcon,
  File as FileIcon,
} from "lucide-react";
import { useRepoStore } from "../store";
import { useRepoNavigation } from "../utils/navigation";
import { getFileContent, decodeFileContent } from "../actions";
import ReactMarkdown from "react-markdown";

const FileViewer: React.FC = () => {
  const repository = useRepoStore((state) => state.repository);
  const selectedFile = useRepoStore((state) => state.selectedFile);
  const currentPath = useRepoStore((state) => state.currentPath);
  const currentRef = useRepoStore((state) => state.currentRef);
  const fileContent = useRepoStore((state) => state.fileContent);
  const isLoadingFile = useRepoStore((state) => state.isLoadingFile);

  const setFileContent = useRepoStore((state) => state.setFileContent);
  const setLoadingFile = useRepoStore((state) => state.setLoadingFile);

  const { selectFile } = useRepoNavigation();

  // Fetch file content when a file is selected
  useEffect(() => {
    if (repository && selectedFile && currentRef) {
      const filePath = currentPath
        ? `${currentPath}/${selectedFile}`
        : selectedFile;

      setLoadingFile(true);
      getFileContent(
        repository.owner.login,
        repository.name,
        filePath,
        currentRef
      )
        .then((response) => {
          if (response.data) {
            const content = response.data;
            const decodedContent = content.content
              ? decodeFileContent(content.content)
              : "";

            // Determine file type
            const extension =
              selectedFile.split(".").pop()?.toLowerCase() || "";
            let fileType: "text" | "image" | "binary" = "text";

            if (
              ["png", "jpg", "jpeg", "gif", "svg", "webp"].includes(extension)
            ) {
              fileType = "image";
            } else if (
              ["exe", "zip", "tar", "gz", "bin", "pdf"].includes(extension)
            ) {
              fileType = "binary";
            }

            // Language detection for syntax highlighting
            const languageMap: Record<string, string> = {
              js: "javascript",
              jsx: "javascript",
              ts: "typescript",
              tsx: "typescript",
              py: "python",
              java: "java",
              go: "go",
              rs: "rust",
              cpp: "cpp",
              c: "c",
              cs: "csharp",
              php: "php",
              rb: "ruby",
              swift: "swift",
              kt: "kotlin",
            };

            const language = languageMap[extension] || extension;

            const fileContentData = {
              name: selectedFile,
              path: filePath,
              content: decodedContent,
              encoding: content.encoding || "utf-8",
              size: content.size,
              type: fileType,
              language,
              sha: content.sha,
              html_url: content.html_url,
              download_url: content.download_url || "",
            };

            setFileContent(fileContentData);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch file content:", error);
          setFileContent(null);
        })
        .finally(() => {
          setLoadingFile(false);
        });
    } else {
      setFileContent(null);
    }
  }, [
    repository,
    selectedFile,
    currentPath,
    currentRef,
    setFileContent,
    setLoadingFile,
  ]);

  const handleClose = () => {
    selectFile(null);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  if (!selectedFile) {
    return null;
  }

  return (
    <Card className="mb-4">
      {/* File header */}
      <div className="flex items-center justify-between p-4 border-b bg-muted/30">
        <div className="flex items-center space-x-3">
          <FileText className="h-5 w-5 text-blue-600" />
          <div>
            <h3 className="font-semibold">{selectedFile}</h3>
            {fileContent && (
              <p className="text-sm text-muted-foreground">
                {formatFileSize(fileContent.size)} • {fileContent.encoding}
                {fileContent.language && ` • ${fileContent.language}`}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {fileContent && (
            <>
              <Badge variant="outline" className="text-xs">
                {fileContent.type}
              </Badge>
              <Button variant="ghost" size="sm" asChild>
                <a
                  href={fileContent.download_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a
                  href={fileContent.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Eye className="h-4 w-4" />
                </a>
              </Button>
            </>
          )}
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* File content */}
      <div className="p-4">
        {isLoadingFile && (
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Loading file content...</div>
          </div>
        )}

        {!isLoadingFile && !fileContent && (
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">
              Failed to load file content.
            </div>
          </div>
        )}

        {fileContent && (
          <div>
            {fileContent.type === "image" && (
              <div className="text-center">
                <img
                  src={fileContent.download_url}
                  alt={fileContent.name}
                  className="max-w-full h-auto border rounded"
                />
              </div>
            )}

            {fileContent.type === "text" && (
              <div>
                {selectedFile.toLowerCase().endsWith(".md") ? (
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown>{fileContent.content}</ReactMarkdown>
                  </div>
                ) : (
                  <pre className="bg-muted/50 p-4 rounded-md text-sm overflow-x-auto border">
                    <code className={`language-${fileContent.language}`}>
                      {fileContent.content}
                    </code>
                  </pre>
                )}
              </div>
            )}

            {fileContent.type === "binary" && (
              <div className="text-center py-8">
                <FileIcon className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">
                  Binary file ({formatFileSize(fileContent.size)})
                </p>
                <Button asChild>
                  <a href={fileContent.download_url} download>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </a>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default FileViewer;
