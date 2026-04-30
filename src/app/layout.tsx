import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '材料保护电子实验记录本',
  description: '电子实验记录本 - 提升研发效率与数据分析能力',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
