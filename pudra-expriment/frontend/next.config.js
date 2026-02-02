/** @type {import('next').NextConfig} */
const nextConfig = {
    // Remove static export since we need database connection
    // output: 'export', // ❌ Remove this

    images: {
        domains: ['drive.google.com'],
    },

    // Trailing slash for better static hosting compatibility
    trailingSlash: true,

    // Experimental features
    experimental: {
        serverActions: true,
    },
};

module.exports = nextConfig;