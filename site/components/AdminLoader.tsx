'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

// 로그인한 개발자에게만 도구 코드를 불러온다. 일반 방문자는 이 코드를 받지 않는다.
const AdminTools = dynamic(() => import('./AdminTools'), { ssr: false })

export default function AdminLoader() {
  const [admin, setAdmin] = useState(false)
  useEffect(() => {
    fetch('/api/admin/me', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : { admin: false }))
      .then((d) => setAdmin(!!d.admin))
      .catch(() => {})
  }, [])
  return admin ? <AdminTools /> : null
}
