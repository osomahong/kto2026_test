import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "2026 관광기업 DATA AI 지원사업 유형 분석 테스트",
  description:
    "관광기업의 데이터·AI 역량을 진단하고 맞춤 지원사업 유형을 확인하세요. 데이터 수집 환경, 분석 도구, 마케팅 캠페인, AI 활용 수준을 종합 분석합니다.",
  openGraph: {
    title: "2026 관광기업 DATA AI 지원사업 유형 분석 테스트",
    description:
      "관광기업의 데이터·AI 역량을 진단하고 맞춤 지원사업 유형을 확인하세요. 데이터 수집 환경, 분석 도구, 마케팅 캠페인, AI 활용 수준을 종합 분석합니다.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "우리 기업에 맞는 DATA·AI 지원사업 유형 확인하기",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "2026 관광기업 DATA AI 지원사업 유형 분석 테스트",
    description:
      "관광기업의 데이터·AI 역량을 진단하고 맞춤 지원사업 유형을 확인하세요. 데이터 수집 환경, 분석 도구, 마케팅 캠페인, AI 활용 수준을 종합 분석합니다.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
