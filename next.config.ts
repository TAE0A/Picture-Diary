import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 로컬 이미지 최적화 설정
  images: {
    unoptimized: false,
  },
};

export default nextConfig;
