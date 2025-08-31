"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useRepoStore } from "../store";
import {
  getFileContent,
  decodeFileContent,
  getRepositoryREADME,
} from "../actions";

const ReadmeViewer: React.FC = () => {
  const repository = useRepoStore((state) => state.repository);
  const contents = useRepoStore((state) => state.contents);
  const currentRef = useRepoStore((state) => state.currentRef);

  const [readmeContent, setReadmeContent] = useState<string>("");
  const [readmeFile, setReadmeFile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  console.log(error);
  useEffect(() => {
    if (!repository || !contents.length) return;

    // Find README file (case-insensitive)
    const foundReadmeFile = contents.find(
      (item) =>
        item.type === "file" && /^readme\.(md|txt|rst)$/i.test(item.name)
    );

    if (!foundReadmeFile) {
      setReadmeFile(null);
      return;
    }

    setReadmeFile(foundReadmeFile);
    setLoading(true);
    setError("");

    // Fetch the README content
    getRepositoryREADME(repository.owner.login, repository.name)
      .then((response) => {
        if (response.error || !response.data?.content) {
          setError(response.error?.message || "Unable to load README content");
          return;
        }

        const decodedContent = decodeFileContent(response.data.content);
        setReadmeContent(decodedContent);
      })
      .catch((err) => {
        setError("Failed to load README: " + err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [repository, contents, currentRef]);

  if (!readmeFile) {
    return null;
  }

  const isMarkdown = readmeFile.name.toLowerCase().endsWith(".md");

  return (
    <Card className="p-6">
      <div className="flex items-center space-x-2 mb-4 pb-4 border-b">
        <FileText className="h-5 w-5" />
        <h2 className="font-semibold">{readmeFile.name}</h2>
      </div>

      {loading && <p className="text-muted-foreground">Loading README...</p>}

      {error && <p className="text-red-600">Error loading README: {error}</p>}

      {!loading && !error && readmeContent && (
        <div className="prose prose-sm max-w-none">
          {isMarkdown ? (
            <ReactMarkdown>{readmeContent}</ReactMarkdown>
          ) : (
            <pre className="whitespace-pre-wrap text-sm">{readmeContent}</pre>
          )}
        </div>
      )}
    </Card>
  );
};

export default ReadmeViewer;
