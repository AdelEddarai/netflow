// Import necessary modules using ES module syntax
import createMDX from 'fumadocs-mdx/config';
import nextIntlPlugin from 'next-intl/plugin';

// Configure MDX support
const withMDX = createMDX();

// Configure next-intl plugin
const withNextIntl = nextIntlPlugin('./i18n.ts');

// Next.js configuration object
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

// Export the final configuration
export default withNextIntl(withMDX(nextConfig));
