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
  /* config options here */
};

export default nextConfig;
