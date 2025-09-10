import type { NextConfig } from "next";

const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const isGithubActions = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isGithubActions && repoName ? `/${repoName}` : '',
  assetPrefix: isGithubActions && repoName ? `/${repoName}/` : '',
};

export default nextConfig;
