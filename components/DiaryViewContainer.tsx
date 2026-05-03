"use client";

import { useState } from "react";
import { Diary } from "@/db/diaries";
import DiaryCalendar from "./DiaryCalendar";
import DiaryGrid from "./DiaryGrid";

interface DiaryViewContainerProps {
  diaries: Diary[];
}

export default function DiaryViewContainer({
  diaries,
}: DiaryViewContainerProps) {
  const [view, setView] = useState<"calendar" | "list">("calendar");

  return (
    <div className="space-y-4">
      {/* 뷰 토글 버튼 */}
      <div className="flex gap-2">
        <button
          onClick={() => setView("calendar")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
            view === "calendar"
              ? "bg-diary-accent text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
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
              d="M8 7V3m8 4V3m-9 8h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          캘린더
        </button>

        <button
          onClick={() => setView("list")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
            view === "list"
              ? "bg-diary-accent text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
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
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          목록
        </button>
      </div>

      {/* 뷰 렌더링 */}
      {view === "calendar" ? (
        <DiaryCalendar diaries={diaries} />
      ) : (
        <DiaryGrid diaries={diaries} mode="list" />
      )}
    </div>
  );
}
