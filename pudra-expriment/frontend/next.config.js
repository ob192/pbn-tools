/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable static export for full SSG
    output: 'export',

    // Disable image optimization for static export
    images: {
        unoptimized: true,
    },

    // Trailing slash for better static hosting compatibility
    trailingSlash: true,
};

module.exports = nextConfig;