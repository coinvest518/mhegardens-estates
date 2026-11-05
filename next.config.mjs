/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Images are pre-compressed WebP files in /public, so Next's image optimizer isn't needed.
    unoptimized: true,
  },
}

export default nextConfig
