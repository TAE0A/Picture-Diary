"use client";

import { useState } from "react";
import Link from "next/link";
import { Diary } from "@/db/diaries";
import Image from "next/image";

interface DiaryCalendarProps {
  diaries: Diary[];
}

// created_at 문자열을 파싱하여 날짜만 추출 (YYYY.M.D)
function parseDiaryDate(createdAt: string): Date | null {
  try {
    // "2026. 5. 2. 오전 10:30:00" 형식 → "2026 5 2" 추출
    const dateMatch = createdAt.match(/(\d+)\.\s+(\d+)\.\s+(\d+)\./);
    if (!dateMatch) return null;

    const year = parseInt(dateMatch[1]);
    const month = parseInt(dateMatch[2]);
    const day = parseInt(dateMatch[3]);

    return new Date(year, month - 1, day);
  } catch {
    return null;
  }
}

// 날짜로 일기 찾기
function getDiariesByDate(diaries: Diary[], date: Date): Diary[] {
  return diaries.filter((diary) => {
    const diaryDate = parseDiaryDate(diary.created_at);
    if (!diaryDate) return false;
    return (
      diaryDate.getFullYear() === date.getFullYear() &&
      diaryDate.getMonth() === date.getMonth() &&
      diaryDate.getDate() === date.getDate()
    );
  });
}

// 달의 첫 날을 가져옴
function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

// 달의 일 수 가져옴
function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

export default function DiaryCalendar({ diaries }: DiaryCalendarProps) {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }
  while (days.length < totalCells) {
    days.push(null);
  }

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
          aria-label="이전 달"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <h2 className="text-xl font-bold text-diary-brown">
          {currentYear}년 {currentMonth + 1}월
        </h2>

        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
          aria-label="다음 달"
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
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="h-10 flex items-center justify-center font-semibold text-sm text-gray-700"
          >
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, idx) => {
          if (day === null) {
            return (
              <div key={`empty-${idx}`} className="h-24 bg-gray-50 rounded" />
            );
          }

          const currentDate = new Date(currentYear, currentMonth, day);
          const diariesForDay = getDiariesByDate(diaries, currentDate);
          const isToday =
            currentDate.toDateString() === new Date().toDateString();

          return (
            <div
              key={day}
              className={`h-24 p-2 rounded border-2 transition ${
                isToday
                  ? "border-diary-accent bg-blue-50"
                  : "border-gray-200 bg-white hover:bg-gray-50"
              } ${diariesForDay.length > 0 ? "cursor-pointer" : ""}`}
            >
              <div className="flex flex-col h-full">
                <span
                  className={`text-sm font-semibold ${
                    isToday
                      ? "text-diary-accent"
                      : "text-gray-700"
                  }`}
                >
                  {day}
                </span>

                {/* 일기가 있는 경우 */}
                {diariesForDay.length > 0 && (
                  <div className="flex-1 overflow-hidden">
                    {diariesForDay.slice(0, 2).map((diary) => (
                      <Link
                        key={diary.id}
                        href={`/diary/${diary.id}`}
                        className="block"
                      >
                        {diary.image_path ? (
                          <div className="relative w-full h-14 rounded mt-1 overflow-hidden">
                            <Image
                              src={diary.image_path}
                              alt={diary.title}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          </div>
                        ) : (
                          <div className="text-xs text-diary-accent mt-1 truncate font-medium">
                            {diary.title}
                          </div>
                        )}
                      </Link>
                    ))}
                    {diariesForDay.length > 2 && (
                      <div className="text-xs text-gray-500 mt-1">
                        +{diariesForDay.length - 2}개
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
