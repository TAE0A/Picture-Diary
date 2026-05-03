import { Diary } from "@/db/diaries";
import DiaryCard from "./DiaryCard";
import DiaryListItem from "./DiaryListItem";

interface DiaryGridProps {
  diaries: Diary[];
  mode?: "grid" | "list";
}

export default function DiaryGrid({ diaries, mode = "grid" }: DiaryGridProps) {
  if (mode === "list") {
    return (
      <div className="space-y-4">
        {diaries.map((diary) => (
          <DiaryListItem key={diary.id} diary={diary} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {diaries.map((diary) => (
        <DiaryCard key={diary.id} diary={diary} />
      ))}
    </div>
  );
}
