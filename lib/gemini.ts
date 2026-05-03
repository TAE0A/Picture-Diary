import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("경고: GEMINI_API_KEY 환경 변수가 설정되지 않았습니다");
}

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// 일기 텍스트를 영어 이미지 생성 프롬프트로 변환
export async function buildImagePrompt(
  title: string,
  content: string
): Promise<string> {
  if (!ai) {
    return `어린이 그림책 스타일의 따뜻한 수채화 일러스트레이션: ${title}`;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `다음 어린이 그림일기 내용을 보고, 삽화를 그리기 위한 영어 이미지 생성 프롬프트를 만들어주세요.
따뜻하고 부드러운 수채화 스타일, 어린이 그림책 일러스트레이션 스타일로 작성하세요.
프롬프트는 최대 150자 이내로 간결하게 하세요.
프롬프트만 출력하고 다른 설명은 제외하세요.

제목: ${title}
내용: ${content}`,
    });

    const generatedPrompt =
      response.candidates?.[0]?.content?.parts?.[0]?.text ||
      `Warm watercolor illustration for children's diary: ${title}`;

    return generatedPrompt;
  } catch (error) {
    console.error("프롬프트 생성 중 오류:", error);
    return `Warm watercolor illustration for children's diary: ${title}`;
  }
}

// 프롬프트로부터 AI 이미지 생성
export async function generateDiaryImage(
  title: string,
  content: string
): Promise<{
  imageBytes: string;
  prompt: string;
} | null> {
  if (!ai) {
    console.warn("Gemini API가 초기화되지 않았습니다");
    return null;
  }

  try {
    // 1단계: 한국어 일기 → 영어 프롬프트 변환
    const prompt = await buildImagePrompt(title, content);

    // 2단계: Gemini 2.5 Flash로 직접 이미지 생성 (Imagen 대신)
    // Note: Imagen은 별도 API 설정이 필요하므로, Gemini 2.5 Flash Image 모델 사용
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      responseModalities: ["IMAGE"],
    });

    // Gemini 2.5 Flash Image 응답에서 이미지 추출
    const imagePart = response.candidates?.[0]?.content?.parts?.find(
      (part: any) => part.inlineData?.mimeType?.startsWith("image/")
    );

    if (!imagePart?.inlineData?.data) {
      throw new Error("이미지를 받지 못했습니다");
    }

    return { imageBytes: imagePart.inlineData.data, prompt };
  } catch (error) {
    console.error("이미지 생성 중 오류:", error);
    return null;
  }
}
