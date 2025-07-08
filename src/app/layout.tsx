import { Inter } from "next/font/google"
import Link from "next/link"
import GlobalStyles from '@/styles/GlobalStyles'

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "FedHB - 연합학습 하이브리드 데모 플랫폼",
  description: "차세대 연합 학습 알고리즘, FedHB입니다",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
  <body className={inter.className}>
    <GlobalStyles />

    <nav>
      <div className="container">
        <div className="logo-group">
          <Link href="/">
            <h1>
              <span className="logo-f">Fed</span>
              <span className="logo-h">H</span>
              <span className="logo-b">B</span>
            </h1>
          </Link>
        </div>
        <div className="nav-menu">
          <Link href="/about">FedHB 소개</Link>
          <span className="nav-divider">|</span>
          <Link href="/supabase/dashboard">대시보드</Link>
          <span className="nav-divider">|</span>
          <Link href="/team">팀 소개</Link>
          <span className="nav-divider">|</span>
          <Link href="/supabase/login">로그인</Link>
        </div>
      </div>
    </nav>

    <main>{children}</main>
  </body>
</html>

  )
}