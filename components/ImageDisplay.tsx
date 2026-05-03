"use client";

import Image from "next/image";

interface ImageDisplayProps {
  imagePath: string | null;
  title: string;
}

export default function ImageDisplay({ imagePath, title }: ImageDisplayProps) {
  if (!imagePath) {
    return (
      <div className="bg-gradient-to-br from-diary-cream to-white rounded-lg flex items-center justify-center h-96 border-2 border-dashed border-gray-300">
        <div className="text-center">
          <div className="text-6xl mb-4">🎨</div>
          <p className="text-gray-500">AI가 아직 삽화를 생성하지 못했습니다</p>
          <p className="text-sm text-gray-400 mt-2">
            잠시 후 다시 확인해주세요
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg">
      <Image
        src={imagePath}
        alt={title}
        fill
        className="object-cover"
        priority
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
      />
    </div>
  );
}
