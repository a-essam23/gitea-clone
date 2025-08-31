"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GitCommit, User } from "lucide-react";
import { useRepoStore } from "../store";

const LatestCommit: React.FC = () => {
  const latestCommit = useRepoStore((state) => state.latestCommit);

  if (!latestCommit) {
    return null;
  }

  const commit = latestCommit;
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.ceil(diffDays / 365)} years ago`;
  };

  const truncateMessage = (message: string, maxLength: number = 100) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + "...";
  };

  return (
    <Card className="p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <GitCommit className="h-4 w-4 text-muted-foreground" />

          {/* Author avatar and info */}
          <div className="flex items-center space-x-2">
            {commit.author ? (
              <img
                src={commit.author.avatar_url}
                alt={commit.author.login}
                className="w-6 h-6 rounded-full"
              />
            ) : (
              <User className="w-6 h-6 text-muted-foreground" />
            )}
            <span className="text-sm font-medium">
              {commit.author?.login || commit.commit.author.name}
            </span>
          </div>

          {/* Commit message */}
          <span className="text-sm text-muted-foreground">
            {truncateMessage(commit.commit.message)}
          </span>
        </div>

        {/* Commit info */}
        <div className="flex items-center space-x-3">
          <span className="text-sm text-muted-foreground">
            {formatDate(commit.commit.author.date)}
          </span>

          <Badge variant="outline" className="font-mono text-xs">
            {commit.sha.substring(0, 7)}
          </Badge>
        </div>
      </div>
    </Card>
  );
};

export default LatestCommit;
