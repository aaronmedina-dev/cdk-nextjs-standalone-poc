/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',

  // add image optimisation allowed width
  images: {
        // Define allowed image sizes
        deviceSizes: [320, 420, 768, 1024, 1200], // for <Image /> responsive sizes
        imageSizes: [16, 32, 48, 64, 128, 256, 384, 500, 1000], // explicitly add allowed sizes
        dangerouslyAllowSVG: true, // Enable SVG optimization
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;", // Secure SVGs
  },
  experimental: {
    isrMemoryCacheSize: 0, // Disable memory cache for ISR, will force to rely on S3
  },


};

module.exports = nextConfig;
