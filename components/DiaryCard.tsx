"use client";

import { Diary } from "@/db/diaries";
import Link from "next/link";
import Image from "next/image";

interface DiaryCardProps {
  diary: Diary;
}

export default function DiaryCard({ diary }: DiaryCardProps) {
  const formattedDate = new Date(diary.created_at).toLocaleDateString("ko-KR");
  const preview = diary.content.substring(0, 100);

  return (
    <Link href={`/diary/${diary.id}`}>
      <div className="diary-card bg-white rounded-lg overflow-hidden h-full hover:cursor-pointer">
        {/* 이미지 영역 */}
        <div className="relative bg-gradient-to-br from-diary-cream to-white h-48 flex items-center justify-center overflow-hidden">
          {diary.image_path ? (
            <Image
              src={diary.image_path}
              alt={diary.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="text-center text-gray-400">
              <div className="text-4xl mb-2">🖼️</div>
              <p className="text-sm">이미지 생성 중...</p>
            </div>
          )}
        </div>

        {/* 텍스트 영역 */}
        <div className="p-4">
          <div className="text-xs text-gray-500 mb-2">{formattedDate}</div>
          <h3 className="font-bold text-diary-brown mb-2 line-clamp-2">
            {diary.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-3">{preview}...</p>
          {diary.mood && (
            <div className="mt-3 text-sm text-diary-accent">
              감정: {diary.mood}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
