"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DiaryForm from "@/components/DiaryForm";
import { CreateDiaryInput } from "@/db/diaries";

export default function NewDiaryPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: CreateDiaryInput) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/diaries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("일기 저장에 실패했습니다");
      }

      const result = await response.json();
      router.push(`/diary/${result.diary.id}`);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-diary-brown mb-2">새 일기 쓰기</h1>
        <p className="text-gray-600">
          오늘의 이야기를 나누면 AI가 특별한 삽화를 만들어드립니다
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <DiaryForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
}
