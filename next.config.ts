import type { NextConfig } from "next";
import {
  bootstrap
} from 'global-agent';

var bootstrapCalled;
if(!bootstrapCalled){
  bootstrap();
  bootstrapCalled=true;
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/media/**',
      },
    ],
  },
};

export default nextConfig;
