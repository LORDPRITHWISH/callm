/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["three"],
  webpack: (config: import('webpack').Configuration) => {
    // Transpile three.js and related modules
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];
    config.module.rules.push({
      test: /\.(js|mjs|jsx|ts|tsx)$/,
      include: [/[\\/]node_modules[\\/]three[\\/]/, /[\\/]node_modules[\\/]three-stdlib[\\/]/],
      use: {
        loader: "babel-loader",
        options: {
          presets: ["next/babel"],
        },
      },
    });

    return config;
  },
};

module.exports = nextConfig;
