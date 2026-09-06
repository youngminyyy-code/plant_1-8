import "./globals.css";

export const metadata = {
  title: "우리 반 식물 키우기",
  description: "학급 식물 키우기 프로그램 참여 사이트",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
