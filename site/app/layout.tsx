import type { Metadata } from 'next'
import Sidebar from '@/components/Sidebar'
import AdminLoader from '@/components/AdminLoader'
import { sidebarData } from '@/lib/data'
import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'Web Workshop 위키', template: '%s · Web Workshop 위키' },
  description: '웹 개발·바이브코딩 워크숍을 준비하며 정리한 개념과 질문 노트',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <div className="layout">
          <Sidebar data={sidebarData()} />
          <main className="content">{children}</main>
        </div>
        <AdminLoader />
      </body>
    </html>
  )
}
