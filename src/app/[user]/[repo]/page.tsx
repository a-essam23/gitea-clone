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
import BreadcrumbNav from "./components/breadcrumb-nav";
import FileViewer from "./components/file-viewer";

interface RepositoryPageProps {
  params: Promise<{
    user: string;
    repo: string;
  }>;
  searchParams: Promise<{
    ref?: string; // branch or tag reference
    path?: string; // current directory path
    file?: string; // selected file
  }>;
}

export default async function RepositoryPage({
  params,
  searchParams,
}: RepositoryPageProps) {
  const { user, repo } = await params;
  const { ref, path, file } = await searchParams;

  try {
    // Get repository metadata first
    const repositoryResponse = await getRepository(user, repo);

    if (repositoryResponse.error) {
      console.log("Repository error:", repositoryResponse.error);
      notFound();
    }

    const repository = repositoryResponse.data!;

    // Use provided ref or default branch
    const currentRef = ref || repository.default_branch;
    const currentPath = path || "";

    // Fetch repository data in parallel
    const [contentsResponse, commitsResponse] = await Promise.all([
      getRepositoryContents(user, repo, currentPath, currentRef),
      getRepositoryCommits(user, repo, { limit: 1, ref: currentRef }),
    ]);

    // Check for errors in responses
    if (contentsResponse.error) {
      console.log("Contents error:", contentsResponse.error);
      // notFound();
    }

    if (commitsResponse.error) {
      console.log("Commits error:", commitsResponse.error);
      // Commits error is not fatal, we can continue without latest commit
    }

    const contents = contentsResponse.data!;
    const latestCommit = commitsResponse.data?.[0] || null;

    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <RepoProvider
            repository={repository}
            contents={contents}
            latestCommit={latestCommit}
            currentRef={currentRef}
            currentPath={currentPath}
            selectedFile={file || null}
          >
            {/* Repository Header */}
            <RepoHeader />

            {/* Navigation Tabs */}
            <RepoNavTabs />

            {/* Action Bar with Branch Selector and Clone Button */}
            <RepoActionBar />

            {/* Breadcrumb Navigation */}
            <BreadcrumbNav />

            {/* Latest Commit Info */}
            <LatestCommit />

            {/* File Browser */}
            <FileBrowser />

            {/* File Viewer */}
            <FileViewer />

            {/* README Viewer (only show if no file is selected) */}
            {!file && <ReadmeViewer />}
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
