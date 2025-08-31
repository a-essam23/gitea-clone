"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GitBranch, Download, Code, ChevronDown, Check } from "lucide-react";
import { useRepoStore } from "../store";
import { useRepoNavigation } from "../utils/navigation";
import { getRepositoryBranches } from "../actions";

const RepoActionBar: React.FC = () => {
  const repository = useRepoStore((state) => state.repository);
  const currentRef = useRepoStore((state) => state.currentRef);
  const availableBranches = useRepoStore((state) => state.availableBranches);
  const setBranches = useRepoStore((state) => state.setBranches);
  const setLoadingBranches = useRepoStore((state) => state.setLoadingBranches);

  const [showBranchDropdown, setShowBranchDropdown] = useState(false);
  const { switchBranch } = useRepoNavigation();

  // Fetch branches on mount
  useEffect(() => {
    if (repository && availableBranches.length === 0) {
      setLoadingBranches(true);
      getRepositoryBranches(repository.owner.login, repository.name)
        .then((response) => {
          if (response.data) {
            setBranches(response.data);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch branches:", error);
        })
        .finally(() => {
          setLoadingBranches(false);
        });
    }
  }, [repository, availableBranches.length, setBranches, setLoadingBranches]);

  const handleBranchSelect = (branchName: string) => {
    switchBranch(branchName);
    setShowBranchDropdown(false);
  };

  if (!repository) {
    return null;
  }
  return (
    <div className="flex items-center justify-between py-4">
      {/* Left side - Branch selector */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowBranchDropdown(!showBranchDropdown)}
            className="min-w-32"
          >
            <GitBranch className="h-4 w-4 mr-2" />
            {currentRef}
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>

          {/* Branch Dropdown */}
          {showBranchDropdown && (
            <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
              <div className="p-2">
                <div className="text-xs font-medium text-gray-500 mb-2 px-2">
                  Branches ({availableBranches.length})
                </div>
                {availableBranches.map((branch) => (
                  <button
                    key={branch.name}
                    onClick={() => handleBranchSelect(branch.name)}
                    className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm flex items-center justify-between"
                  >
                    <span className="flex items-center">
                      <GitBranch className="h-3 w-3 mr-2" />
                      {branch.name}
                    </span>
                    {branch.name === currentRef && (
                      <Check className="h-3 w-3 text-green-600" />
                    )}
                  </button>
                ))}
                {availableBranches.length === 0 && (
                  <div className="text-xs text-gray-500 px-2 py-2">
                    Loading branches...
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

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
