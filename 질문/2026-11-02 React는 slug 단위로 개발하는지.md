---
type: 질문
concepts: ["[[React]]", "[[JSX·TSX]]", "[[컴포넌트]]", "[[라우트]]", "[[slug]]"]
tags: [web-workshop, 질문, 프론트엔드]
created: 2026-11-02
---

# React는 slug 단위로 개발하는지

## 질문
> HTML 말고 React 기반으로 개발할 때 JSX 방식으로 slug 단위로 개발하는 거? 맞는 말인지.

## 답

### 결론: 반은 맞다
- **JSX로 쓴다**: 맞다. React 화면은 JSX로 쓴다.
- **slug 단위로 개발한다**: 틀리다. React는 **[[컴포넌트]] 단위**로 개발한다. slug는 개발 단위가 아니라 **주소(URL)의 단위**다.

두 개념이 섞인 이유: Next.js에서는 `posts/[slug]/` 같은 폴더로 페이지를 만들어서, slug가 파일 구조에 보인다.

### 세 가지 단위
| 단위 | 무엇을 나누나 | 예 |
|---|---|---|
| [[컴포넌트]] | 화면 조각 | `<Header />`, `<Card />` |
| [[라우트]] (페이지) | 주소별 화면 | `/about`, `/posts` |
| [[slug]] | 주소 안의 바뀌는 이름 | `/posts/my-first-post` |

### HTML과 React의 차이
- **HTML**: 페이지 파일 단위. 같은 헤더를 `index.html`, `about.html`마다 복사한다. 헤더를 고치면 모든 파일을 고친다.
- **React**: 컴포넌트 단위. `Header`를 한 번 만들고 이름으로 불러 쓴다. 한 곳만 고치면 모든 페이지에 반영된다.

### Next.js에서 [slug]
```
app/
  page.jsx                → /
  about/page.jsx          → /about
  posts/[slug]/page.jsx   → /posts/아무거나
```
- 폴더 구조가 곧 주소다. React 자체에는 이 기능이 없고, Next.js가 더한다.
- `[slug]`는 빈칸이다. 파일 하나가 틀이 되고, 주소로 들어온 이름으로 글을 찾아 채운다. 글이 100개여도 파일은 하나다.

### 바이브코딩에서 쓰는 말
- "헤더를 컴포넌트로 분리해줘"
- "블로그 글은 /posts/[slug] 동적 라우트로 만들어줘"

## 관련 개념
- [[React]] · [[JSX·TSX]] · [[컴포넌트]]
- [[라우트]] · [[slug]] · [[URL]]
- [[2026-11-02 jsx와 tsx가 뭐고 왜 쓰는지]]: JSX를 쓰는 목적
- [[2026-11-02 CRUD와 slug가 뭔지]]: slug 개념
