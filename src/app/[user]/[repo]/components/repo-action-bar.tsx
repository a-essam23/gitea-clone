"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GitBranch, Download, Code } from "lucide-react";
import { useRepoStore } from "../store";

const RepoActionBar: React.FC = () => {
  const repository = useRepoStore((state) => state.repository);
  const currentRef = useRepoStore((state) => state.currentRef);

  if (!repository) {
    return null;
  }
  return (
    <div className="flex items-center justify-between py-4">
      {/* Left side - Branch selector */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm">
          <GitBranch className="h-4 w-4 mr-2" />
          {currentRef}
          <Badge variant="secondary" className="ml-2 text-xs">
            default
          </Badge>
        </Button>

        <div className="text-sm text-muted-foreground">
          {repository.language && (
            <span className="flex items-center">
              <span
                className="w-3 h-3 rounded-full mr-2"
                style={{
                  backgroundColor: getLanguageColor(repository.language),
                }}
              />
              {repository.language}
            </span>
          )}
        </div>
      </div>

      {/* Right side - Clone button and download */}
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Download ZIP
        </Button>

        <Button variant="default" size="sm">
          <Code className="h-4 w-4 mr-2" />
          Clone
        </Button>
      </div>
    </div>
  );
};

// Simple language color mapping - in a real app, you'd want a more comprehensive mapping
const getLanguageColor = (language: string): string => {
  const colors: Record<string, string> = {
    JavaScript: "#f1e05a",
    TypeScript: "#2b7489",
    Python: "#3572A5",
    Java: "#b07219",
    Go: "#00ADD8",
    Rust: "#dea584",
    CSS: "#563d7c",
    HTML: "#e34c26",
    Shell: "#89e051",
    C: "#555555",
    "C++": "#f34b7d",
    PHP: "#4F5D95",
  };

  return colors[language] || "#586069";
};

export default RepoActionBar;
