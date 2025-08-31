import { notFound } from "next/navigation";
import {
  getRepository,
  getRepositoryContents,
  getRepositoryCommits,
} from "./actions";
import RepoProvider from "./components/repo-provider";
import RepoNavTabs from "./components/repo-nav-tabs";
import RepoHeader from "./components/repo-header";
import RepoActionBar from "./components/repo-action-bar";
import LatestCommit from "./components/latest-commit";
import FileBrowser from "./components/file-browser";
import ReadmeViewer from "./components/readme-viewer";

interface RepositoryPageProps {
  params: Promise<{
    user: string;
    repo: string;
  }>;
  searchParams: Promise<{
    ref?: string; // branch or tag reference
  }>;
}

export default async function RepositoryPage({
  params,
  searchParams,
}: RepositoryPageProps) {
  const { user, repo } = await params;
  const { ref } = await searchParams;

  try {
    // Fetch repository data in parallel
    const [repositoryResponse, contentsResponse, commitsResponse] =
      await Promise.all([
        getRepository(user, repo),
        getRepositoryContents(user, repo, "", ref),
        getRepositoryCommits(user, repo, { limit: 1, ref }),
      ]);

    // Check for errors in responses
    if (repositoryResponse.error) {
      console.log("Repository error:", repositoryResponse.error);
      notFound();
    }

    if (contentsResponse.error) {
      console.log("Contents error:", contentsResponse.error);
      notFound();
    }

    if (commitsResponse.error) {
      console.log("Commits error:", commitsResponse.error);
      // Commits error is not fatal, we can continue without latest commit
    }

    const repository = repositoryResponse.data!;
    const contents = contentsResponse.data!;
    const latestCommit = commitsResponse.data?.[0] || null;

    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <RepoProvider
            repository={repository}
            contents={contents}
            latestCommit={latestCommit}
            currentRef={ref || repository.default_branch}
          >
            {/* Repository Header */}
            <RepoHeader />

            {/* Navigation Tabs */}
            <RepoNavTabs />

            {/* Action Bar with Branch Selector and Clone Button */}
            <RepoActionBar />

            {/* Latest Commit Info */}
            <LatestCommit />

            {/* File Browser */}
            <FileBrowser />

            {/* README Viewer */}
            <ReadmeViewer />
          </RepoProvider>
        </div>
      </div>
    );
  } catch (error) {
    console.log("Error loading repository:", error);
    notFound();
  }
}

// Generate metadata for the page
export async function generateMetadata({ params }: RepositoryPageProps) {
  const { user, repo } = await params;

  try {
    const repositoryResponse = await getRepository(user, repo);
    if (repositoryResponse.error || !repositoryResponse.data) {
      return {
        title: "Repository Not Found",
        description: "The requested repository could not be found.",
      };
    }

    const repository = repositoryResponse.data;
    return {
      title: `${repository.full_name} - Gitea`,
      description:
        repository.description || `${repository.full_name} repository`,
    };
  } catch {
    return {
      title: "Repository Not Found",
      description: "The requested repository could not be found.",
    };
  }
}
