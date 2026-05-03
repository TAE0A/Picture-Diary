import { getAllDiaries } from "@/db/diaries";
import DiaryViewContainer from "@/components/DiaryViewContainer";

export default async function Home() {
  const diaries = await getAllDiaries();

  return (
    <div className="space-y-8">
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-diary-brown mb-2">일기</h1>
        <p className="text-gray-600">
          작성한 일기들과 AI가 만든 삽화를 감상하세요
        </p>
      </div>

      {diaries.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg text-gray-500 mb-4">아직 작성한 일기가 없습니다</p>
          <a
            href="/new"
            className="inline-block px-6 py-3 bg-diary-accent text-white rounded-lg hover:bg-opacity-90 transition font-medium"
          >
            첫 번째 일기 작성하기
          </a>
        </div>
      ) : (
        <DiaryViewContainer diaries={diaries} />
      )}
    </div>
  );
}
