"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, GitFork, Eye } from "lucide-react";
import { useRepoStore } from "../store";

const RepoHeader: React.FC = () => {
  const repository = useRepoStore((state) => state.repository);

  if (!repository) return null;

  return (
    <div className="flex items-start justify-between pb-4 border-b">
      <div className="flex-1">
        {/* Repository breadcrumb and name */}
        <div className="flex items-center space-x-1 text-xl font-semibold">
          <a
            href={repository.owner.html_url}
            className="text-blue-600 hover:underline"
          >
            {repository.owner.login}
          </a>
          <span className="text-muted-foreground">/</span>
          <span>{repository.name}</span>
          {repository.private && (
            <Badge variant="secondary" className="ml-2">
              Private
            </Badge>
          )}
          {repository.fork && (
            <Badge variant="outline" className="ml-2">
              Fork
            </Badge>
          )}
        </div>

        {/* Repository description */}
        {repository.description && (
          <p className="text-muted-foreground mt-2">{repository.description}</p>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center space-x-2 ml-4">
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4 mr-1" />
          Watch
          <Badge variant="secondary" className="ml-1">
            {repository.watchers_count}
          </Badge>
        </Button>

        <Button variant="outline" size="sm">
          <Star className="h-4 w-4 mr-1" />
          Star
          <Badge variant="secondary" className="ml-1">
            {repository.stars_count}
          </Badge>
        </Button>

        <Button variant="outline" size="sm">
          <GitFork className="h-4 w-4 mr-1" />
          Fork
          <Badge variant="secondary" className="ml-1">
            {repository.forks_count}
          </Badge>
        </Button>
      </div>
    </div>
  );
};

export default RepoHeader;
