import Link from 'next/link'

export default function NotFound() {
  return (
    <article className="note">
      <h1>노트를 찾을 수 없어요</h1>
      <p>
        아직 없는 노트이거나 주소가 바뀌었어요. <Link href="/search">검색</Link>이나 <Link href="/all">전체 목록</Link>에서
        찾아보세요.
      </p>
    </article>
  )
}
