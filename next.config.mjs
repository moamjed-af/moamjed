/** @type {import('next').NextConfig} */

// When deployed to GitHub Pages under /moamjed/ we need basePath.
// Remove basePath if you later point a custom domain (moamjed.com) at it.
const isGithubPages = process.env.GITHUB_PAGES === 'true'

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  transpilePackages: ['three'],
  ...(isGithubPages && {
    basePath: '/moamjed',
    assetPrefix: '/moamjed/',
  }),
}

export default nextConfig
