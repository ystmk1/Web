import 'server-only'
import { data, getNote, type Note } from './data'

/** 오늘 날짜 (서울 기준, YYYY-MM-DD) */
export function todaySeoul() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul' }).format(new Date())
}

export type NoteKind = 'auto' | '개념' | '질문'

/** 카테고리 이름과 태그 (예: 웹 기초 → 웹기초) */
export function categoryTags() {
  return data.categories.map((c) => ({ name: c.name, tag: c.name.replace(/[\s·]/g, '') }))
}

const COMMON = `너는 'Web Workshop' 옵시디언 볼트에 노트를 쓰는 조수다.
이 볼트는 코딩을 처음 배우는 동아리원에게 웹 개발·바이브코딩을 가르치려고 정리한 개념·질문 노트 모음이다.
사용자가 위키 화면에서 글자를 드래그했다. 드래그한 글자를 보고 볼트 양식대로 새 노트 한 개를 쓴다.

## 노트 종류 고르기
- 개념 노트: 드래그한 글자가 용어·개념 하나를 가리키고, 그 개념의 노트가 '있는 노트' 목록에 아직 없을 때. (예: "YAML", "터미널", "API")
- 질문 노트: 여러 개념의 차이·비교, 방법, 이유, 문제 해결을 묻는 것. 또는 개념 하나라도 그 노트가 이미 있을 때(그때는 그 개념의 특정 부분을 묻는 질문으로 쓴다).
- 이름이 달라도 별칭으로 이미 있는 개념이면 '이미 있음'으로 본다.
{{KIND_RULE}}

## 출력
- 마크다운 파일 내용만 출력한다. 앞뒤 인사, 설명, 코드 펜스(\`\`\`)로 감싸기 금지. 첫 줄은 반드시 ---.

### 개념 노트 양식
---
type: 개념
category: "[[카테고리 이름]]"
aliases: [다른 이름, 영어 이름, 줄임말]
tags: [web-workshop, 개념, <카테고리 태그>]
created: {{TODAY}}
updated: {{TODAY}}
---

# 개념 이름

> 한 줄 정의 (한두 문장)

## 설명
## 비유
## 헷갈리기 쉬운 점
## 웹 개발에서는
## 관련 개념
## 나온 질문

- 섹션 순서와 이름을 그대로 지킨다. '나온 질문'은 비워 두거나 관련된 기존 질문 노트만 링크한다.
- 카테고리는 아래 목록 중 하나만 고른다. 새 카테고리를 만들지 않는다.
{{CATEGORIES}}
- 개념 이름(# 제목)이 곧 파일 이름이다. 한국어로 흔히 부르는 이름이 있으면 한국어로 쓰고(예: Linux → 리눅스), 고유명사·약어는 그대로 쓴다(예: JavaScript, DNS, YAML). 영어 이름과 줄임말은 aliases에 넣는다.
- 제목에 / \\ : * ? " < > | # ^ [ ] 를 쓰지 않는다.

### 질문 노트 양식
---
type: 질문
concepts: ["[[개념1]]", "[[개념2]]"]
tags: [web-workshop, 질문, <카테고리 태그>]
created: {{TODAY}}
---

# 질문 제목

## 질문
> 질문을 한 줄로 다시 씀

## 답
### 한 줄로
(필요하면 표, 흐름 코드 블록)
### 헷갈리기 쉬운 점
### 웹 개발에서는

## 관련 개념

- 제목에는 날짜를 넣지 않는다. 파일 이름은 시스템이 "{{TODAY}} 제목"으로 만든다. 제목에 / \\ : * ? " < > | # ^ [ ] 를 쓰지 않는다.
- concepts에는 이 질문이 다루는 핵심 개념을 넣는다. 가능하면 있는 노트를 쓴다.

## 링크 규칙
- '있는 노트' 목록의 이름을 [[노트 이름]]으로 정확히 쓴다. 별칭으로 보이게 하려면 [[노트 이름|보이는 글자]].
- 표 안에서는 [[노트 이름\\|보이는 글자]]처럼 | 를 \\| 로 쓴다.
- 본문에서 개념이 처음 나오는 곳에 한 번만 링크한다. 없는 노트는 꼭 필요할 때만 링크한다.
- 관련 개념 섹션은 "- [[개념]]: 한 줄 설명" 형식.

## 문체 (꼭 지킬 것)
- 웹 개발을 배우는 입장에서 이해하면 좋은 내용을 기준으로 쓴다. 코딩을 전혀 모르는 사람도 읽을 수 있게.
- Simplified Technical English 규칙을 80% 정도 따른다: 짧은 문장, 한 문장에 한 내용, 능동형, 쉬운 단어, 같은 대상엔 같은 용어.
- 줄표(—, –)를 쓰지 않는다. 필요하면 콜론(:)을 쓴다.
- 결과를 먼저 말하고 이유를 뒤에 붙이는 외국식 도치를 쓰지 않는다. 한국어 어순대로 이유를 앞에 쓴다.
  나쁜 예: "저장 안 하면 화면에 반영 안 된다 — 아직 메모리에만 있어서"
  좋은 예: "저장을 안 하면 아직 메모리에만 있기 때문에 화면에 반영되지 않는다"
- 문장은 "~다" 체. 비유는 일상적인 것(식당, 택배, 도서관 등)으로.
- 틀린 내용이 없어야 한다. 확실하지 않으면 단정하지 않는다.
- 길이는 기존 노트와 비슷하게: 본문 1,500~3,000자. 같은 말을 되풀이하지 않는다.`

const KIND_RULE: Record<NoteKind, string> = {
  auto: '- 위 기준으로 개념 노트와 질문 노트 중 하나를 고른다.',
  개념: '- 사용자가 개념 노트를 골랐다. 반드시 개념 노트로 쓴다. 단, 그 개념이 이미 있으면 겹치지 않는 다른 이름을 지어내지 말고, 드래그한 글자에서 아직 노트가 없는 핵심 개념 하나를 골라 쓴다.',
  질문: '- 사용자가 질문 노트를 골랐다. 반드시 질문 노트로 쓴다.',
}

/** 링크·중복 확인용 노트 목록. 토큰을 아끼려고 짧게 쓴다 (카테고리는 system에 따로 있음). */
function noteCatalog() {
  const concepts = data.notes
    .filter((n) => n.type === '개념')
    .map((n) => `- ${n.name}${n.aliases.length ? ` (${n.aliases.slice(0, 4).join(', ')})` : ''}`)
  const questions = data.notes.filter((n) => n.type === '질문').map((n) => `- ${n.name}`)
  return `### 개념\n${concepts.join('\n')}\n\n### 질문\n${questions.join('\n')}`
}

const yamlList = (xs: string[]) => `[${xs.join(', ')}]`

function withFrontmatter(n: Note) {
  const fm =
    n.type === '개념'
      ? [
          'type: 개념',
          `category: "[[${n.category ?? ''}]]"`,
          `aliases: ${yamlList(n.aliases)}`,
          `tags: ${yamlList(n.tags)}`,
          `created: ${n.created ?? ''}`,
          `updated: ${n.updated ?? ''}`,
        ]
      : [
          'type: 질문',
          `concepts: [${n.concepts.map((c) => `"[[${c}]]"`).join(', ')}]`,
          `tags: ${yamlList(n.tags)}`,
          `created: ${n.created ?? ''}`,
        ]
  return `---\n${fm.join('\n')}\n---\n\n${n.markdown.trim()}`
}

function example(names: string[], type: string) {
  const n = names.map(getNote).find(Boolean) ?? data.notes.find((x) => x.type === type)
  return n ? withFrontmatter(n) : ''
}

const SOURCE_LIMIT = 6000

/**
 * 프롬프트를 '캐시되는 앞부분'과 '매번 바뀌는 뒷부분'으로 나눈다.
 * - system: 양식·규칙 (종류 선택에 따라 한 줄만 다름)
 * - stable: 노트 목록 + 예시 노트 (배포가 바뀌기 전까지 같음) → 캐시
 * - dynamic: 드래그한 곳의 노트, 드래그한 글자, 추가 질문
 */
export function buildPrompt(input: { selection: string; note: string; question?: string; kind?: NoteKind }) {
  const today = todaySeoul()
  const kind: NoteKind = input.kind && input.kind in KIND_RULE ? input.kind : 'auto'
  const source = getNote(input.note)
  const system = COMMON.replace('{{CATEGORIES}}', categoryTags().map((c) => `  - ${c.name} (태그: ${c.tag})`).join('\n'))
    .replaceAll('{{TODAY}}', today)
    .replace('{{KIND_RULE}}', '- 종류 규칙은 맨 마지막 메시지의 "종류" 줄을 따른다.')

  const stable = `## 있는 노트
${noteCatalog()}

## 기존 개념 노트 예시 (양식과 문체를 이대로 따른다)
<example>
${example(['서버', '클라이언트'], '개념')}
</example>

## 기존 질문 노트 예시 (양식과 문체를 이대로 따른다)
<example>
${example(['2026-10-31 클라이언트와 서버 차이'], '질문')}
</example>`

  const src = source?.markdown.trim() ?? '(없음)'
  const dynamic = `## 드래그한 곳
노트: ${input.note}${source ? ` (${source.type ?? '노트'})` : ''}
<source_note>
${src.length > SOURCE_LIMIT ? src.slice(0, SOURCE_LIMIT) + '\n…(뒷부분 생략)' : src}
</source_note>

## 드래그한 글자
${input.selection.trim()}
${input.question?.trim() ? `\n## 추가로 묻고 싶은 것\n${input.question.trim()}\n` : ''}
## 종류
${KIND_RULE[kind]}

새 노트 파일 내용을 출력해.`
  return { system, stable, dynamic, today }
}
