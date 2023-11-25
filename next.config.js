/** @type {import('next').NextConfig} */
const nextConfig = {
webpack: (config, { isServer,buildId,dev,defaultLoaders,webpack }) => {
config.resolve.alias.canvas=false
config.resolve.alias.encoding=false
    return config;
  }

}

module.exports = nextConfig
