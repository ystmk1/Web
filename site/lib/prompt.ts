import 'server-only'
import { data, getNote } from './data'

/** 오늘 날짜 (서울 기준, YYYY-MM-DD) */
export function todaySeoul() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul' }).format(new Date())
}

const SYSTEM = `너는 'Web Workshop' 옵시디언 볼트에 질문 노트를 쓰는 조수다.
이 볼트는 코딩을 처음 배우는 동아리원에게 웹 개발·바이브코딩을 가르치려고 정리한 개념·질문 노트 모음이다.
사용자가 위키 화면에서 글자를 드래그했다. 드래그한 글자를 질문으로 보고, 볼트의 질문 노트 양식대로 새 노트 한 개를 쓴다.

## 출력
- 마크다운 파일 내용만 출력한다. 앞뒤 인사, 설명, 코드 펜스(\`\`\`)로 감싸기 금지. 첫 줄은 반드시 ---.
- 프론트매터:
  ---
  type: 질문
  concepts: ["[[개념1]]", "[[개념2]]"]
  tags: [web-workshop, 질문, <카테고리 태그>]
  created: {{TODAY}}
  ---
- 본문 순서: # 제목 → ## 질문 (> 인용 한 줄로 질문을 다시 씀) → ## 답 (### 한 줄로, 필요하면 표·흐름 코드 블록, ### 헷갈리기 쉬운 점, ### 웹 개발에서는) → ## 관련 개념
- 제목에는 날짜를 넣지 않는다. 파일 이름은 시스템이 "{{TODAY}} 제목"으로 만든다. 제목에 / \\ : * ? " < > | # ^ [ ] 를 쓰지 않는다.

## 링크 규칙
- 아래 '있는 노트' 목록의 이름을 [[노트 이름]]으로 정확히 쓴다. 별칭으로 링크하고 싶으면 [[노트 이름|보이는 글자]].
- 표 안에서는 [[노트 이름\\|보이는 글자]]처럼 | 를 \\| 로 쓴다.
- 본문에서 개념이 처음 나오는 곳에 한 번만 링크한다.
- concepts에는 이 질문이 다루는 핵심 개념을 넣는다. 가능하면 있는 노트를 쓴다. 없는 개념도 넣어도 되지만 꼭 필요한 것만.
- 관련 개념 섹션은 "- [[개념]]: 한 줄 설명" 형식.

## 문체 (꼭 지킬 것)
- 웹 개발을 배우는 입장에서 이해하면 좋은 내용을 기준으로 쓴다. 코딩을 전혀 모르는 사람도 읽을 수 있게.
- Simplified Technical English 규칙을 80% 정도 따른다: 짧은 문장, 한 문장에 한 내용, 능동형, 쉬운 단어, 같은 대상엔 같은 용어.
- 줄표(—, –)를 쓰지 않는다. 필요하면 콜론(:)을 쓴다.
- 결과를 먼저 말하고 이유를 뒤에 붙이는 외국식 도치를 쓰지 않는다. 한국어 어순대로 이유를 앞에 쓴다.
  나쁜 예: "저장 안 하면 화면에 반영 안 된다 — 아직 메모리에만 있어서"
  좋은 예: "저장을 안 하면 아직 메모리에만 있기 때문에 화면에 반영되지 않는다"
- 문장은 "~다" 체. 비유는 일상적인 것(식당, 택배, 도서관 등)으로.
- 틀린 내용이 없어야 한다. 확실하지 않으면 단정하지 않는다.`

function noteCatalog() {
  return data.notes
    .filter((n) => n.type === '개념' || n.type === '카테고리' || n.type === '질문')
    .map((n) => {
      const extra = n.aliases.length ? ` (별칭: ${n.aliases.slice(0, 6).join(', ')})` : ''
      return `- ${n.name} [${n.type}${n.category ? `, ${n.category}` : ''}]${extra}`
    })
    .join('\n')
}

function exampleNote() {
  const preferred = getNote('2026-10-31 클라이언트와 서버 차이')
  const fallback = data.questions.map(getNote).find(Boolean)
  const n = preferred ?? fallback
  if (!n) return ''
  const fm = [
    '---',
    'type: 질문',
    `concepts: [${n.concepts.map((c) => `"[[${c}]]"`).join(', ')}]`,
    `tags: [${n.tags.join(', ')}]`,
    `created: ${n.created ?? ''}`,
    '---',
  ].join('\n')
  return `${fm}\n\n${n.markdown.trim()}`
}

export function buildPrompt(input: { selection: string; note: string; question?: string }) {
  const today = todaySeoul()
  const source = getNote(input.note)
  const system = SYSTEM.replaceAll('{{TODAY}}', today)
  const user = `## 있는 노트
${noteCatalog()}

## 기존 질문 노트 예시 (양식과 문체를 이대로 따른다)
<example>
${exampleNote()}
</example>

## 드래그한 곳
노트: ${input.note}${source ? ` (${source.type ?? '노트'})` : ''}
<source_note>
${source?.markdown.trim() ?? '(없음)'}
</source_note>

## 드래그한 글자
${input.selection.trim()}
${input.question?.trim() ? `\n## 추가로 묻고 싶은 것\n${input.question.trim()}\n` : ''}
위 내용을 질문으로 보고 새 질문 노트 파일 내용을 출력해.`
  return { system, user, today }
}
