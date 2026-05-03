import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "그림일기 - 일기와 함께하는 AI 삽화",
  description: "일기를 작성하면 AI가 자동으로 아름다운 삽화를 만들어줍니다",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="diary-page">
        <header className="bg-white shadow-sm border-b border-gray-100">
          <nav className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link
              href="/"
              className="text-2xl font-bold text-diary-brown hover:text-diary-accent transition"
            >
              📔 그림일기
            </Link>
            <Link
              href="/new"
              className="px-4 py-2 bg-diary-accent text-white rounded-lg hover:bg-opacity-90 transition font-medium"
            >
              새 일기 쓰기
            </Link>
          </nav>
        </header>
        <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
