import { data } from '@/lib/data'

export const dynamic = 'force-static'

/** 검색용 가벼운 목록. 본문은 평문으로만 넣는다. */
export function GET() {
  return Response.json(
    data.notes.map((n) => ({
      name: n.name,
      title: n.title,
      type: n.type,
      aliases: n.aliases,
      tags: n.tags,
      summary: n.summary,
      text: n.text,
    })),
  )
}
