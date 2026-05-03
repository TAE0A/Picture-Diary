"use client";

import Link from "next/link";
import Image from "next/image";
import { Diary } from "@/db/diaries";

interface DiaryListItemProps {
  diary: Diary;
}

export default function DiaryListItem({ diary }: DiaryListItemProps) {
  const moodEmoji: { [key: string]: string } = {
    행복: "😊",
    슬픔: "😢",
    설렘: "😍",
    화남: "😠",
    피곤: "😴",
    보통: "😐",
  };

  const emoji = diary.mood ? moodEmoji[diary.mood] || "📝" : "📝";

  return (
    <Link href={`/diary/${diary.id}`}>
      <div className="flex gap-4 p-4 rounded-lg border border-gray-200 bg-white hover:shadow-md hover:border-diary-accent transition">
        {/* 이미지 또는 플레이스홀더 */}
        <div className="relative w-32 h-32 flex-shrink-0 rounded-lg bg-gray-100 overflow-hidden">
          {diary.image_path ? (
            <Image
              src={diary.image_path}
              alt={diary.title}
              fill
              className="object-cover"
              sizes="128px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-4xl">{emoji}</span>
            </div>
          )}
        </div>

        {/* 텍스트 정보 */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-diary-brown line-clamp-2">
                {diary.title}
              </h3>
              {diary.mood && (
                <span className="text-sm px-2 py-1 bg-gray-100 rounded text-gray-700">
                  {emoji} {diary.mood}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">
              {diary.content}
            </p>
          </div>

          <p className="text-xs text-gray-500">{diary.created_at}</p>
        </div>

        {/* 클릭 유도 화살표 */}
        <div className="flex items-center text-gray-400">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}
