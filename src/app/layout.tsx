import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

const GTM_ID = "GTM-P2PQ8KFM";

export const metadata: Metadata = {
  title: "2026 관광기업 데이터·AI 활용 지원 사업 유형 확인 테스트",
  description:
    "2026 관광기업 데이터·AI 활용 지원 사업의 유형을 살펴보는 간단한 테스트입니다. 우리 회사에 어울릴 만한 유형을 참고해 보세요.",
  openGraph: {
    title: "2026 관광기업 데이터·AI 활용 지원 사업 유형 확인 테스트",
    description:
      "2026 관광기업 데이터·AI 활용 지원 사업의 유형을 살펴보는 간단한 테스트입니다. 우리 회사에 어울릴 만한 유형을 참고해 보세요.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "우리 기업에 맞는 2026 관광기업 데이터·AI 활용 지원 사업 유형 확인하기",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "2026 관광기업 데이터·AI 활용 지원 사업 유형 확인 테스트",
    description:
      "2026 관광기업 데이터·AI 활용 지원 사업의 유형을 살펴보는 간단한 테스트입니다. 우리 회사에 어울릴 만한 유형을 참고해 보세요.",
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
        <Script id="gtm-init" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      </head>
      <body className="min-h-screen">
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
