"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Code,
  AlertCircle,
  GitPullRequest,
  Play,
  BookOpen,
  Settings,
} from "lucide-react";
import { useRepoStore } from "../store";

interface RepoNavTabsProps {
  currentTab?: string;
}

const RepoNavTabs: React.FC<RepoNavTabsProps> = ({ currentTab = "code" }) => {
  const repository = useRepoStore((state) => state.repository);

  if (!repository) return null;

  const tabs = [
    {
      id: "code",
      label: "Code",
      icon: Code,
      count: null,
      href: `/${repository.full_name}`,
    },
    {
      id: "issues",
      label: "Issues",
      icon: AlertCircle,
      count: repository.open_issues_count,
      href: `/${repository.full_name}/issues`,
    },
    {
      id: "pulls",
      label: "Pull requests",
      icon: GitPullRequest,
      count: 0, // TODO: Get from API when available
      href: `/${repository.full_name}/pulls`,
    },
    {
      id: "actions",
      label: "Actions",
      icon: Play,
      count: null,
      href: `/${repository.full_name}/actions`,
    },
    {
      id: "wiki",
      label: "Wiki",
      icon: BookOpen,
      count: null,
      href: `/${repository.full_name}/wiki`,
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      count: null,
      href: `/${repository.full_name}/settings`,
    },
  ];

  return (
    <div className="border-b">
      <nav className="flex space-x-8 py-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <a
              key={tab.id}
              href={tab.href}
              className={cn(
                "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary",
                isActive
                  ? "text-primary border-b-2 border-primary pb-2"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
              {tab.count !== null && tab.count > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {tab.count}
                </Badge>
              )}
            </a>
          );
        })}
      </nav>
    </div>
  );
};

export default RepoNavTabs;
