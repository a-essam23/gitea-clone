import React from "react";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const LoadingView: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header skeleton */}
        <div className="pb-4 border-b">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-1 text-xl font-semibold">
                <div className="h-6 w-32 bg-muted animate-pulse rounded" />
                <span className="text-muted-foreground">/</span>
                <div className="h-6 w-24 bg-muted animate-pulse rounded" />
              </div>
              <div className="h-4 w-96 bg-muted animate-pulse rounded mt-2" />
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <div className="h-8 w-20 bg-muted animate-pulse rounded" />
              <div className="h-8 w-20 bg-muted animate-pulse rounded" />
              <div className="h-8 w-20 bg-muted animate-pulse rounded" />
            </div>
          </div>
        </div>

        {/* Navigation tabs skeleton */}
        <div className="border-b">
          <nav className="flex space-x-8 py-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-5 w-16 bg-muted animate-pulse rounded"
              />
            ))}
          </nav>
        </div>

        {/* Action bar skeleton */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-4">
            <div className="h-8 w-24 bg-muted animate-pulse rounded" />
            <div className="h-4 w-20 bg-muted animate-pulse rounded" />
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-8 w-28 bg-muted animate-pulse rounded" />
            <div className="h-8 w-20 bg-muted animate-pulse rounded" />
          </div>
        </div>

        {/* Main content loading */}
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Loading repository...</p>
          </div>
        </div>

        {/* File browser skeleton */}
        <Card className="mb-4">
          <div className="divide-y">
            <div className="px-4 py-3 bg-muted/50">
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            </div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="h-4 w-4 bg-muted animate-pulse rounded" />
                    <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                    <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoadingView;
