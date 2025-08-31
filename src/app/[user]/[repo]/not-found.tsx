import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface NotFoundViewProps {
  title?: string;
  message?: string;
  error?: {
    code: number;
    message: string;
    details?: string;
  };
}

const NotFoundView: React.FC<NotFoundViewProps> = ({
  title = "Repository Not Found",
  message = "The repository you're looking for doesn't exist or you don't have permission to access it.",
  error,
}) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="p-8 max-w-md w-full text-center">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <h1 className="text-2xl font-bold mb-2">{title}</h1>
              <p className="text-muted-foreground">{message}</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-muted rounded-lg text-sm text-left">
                <div className="font-medium mb-1">Error Details:</div>
                <div className="text-muted-foreground">
                  <div>Code: {error.code}</div>
                  <div>Message: {error.message}</div>
                  {error.details && <div>Details: {error.details}</div>}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild variant="outline" className="flex-1">
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NotFoundView;
