---
type: 개념
category: "[[프론트엔드]]"
aliases: [라이브러리와 프레임워크, library vs framework, 제어의 역전, Inversion of Control, IoC]
tags: [web-workshop, 개념, 프론트엔드]
created: 2026-11-04
updated: 2026-11-04
---

# 라이브러리 vs 프레임워크

> 둘 다 "가져다 쓰는 남의 코드"지만, **누가 누구를 부르는지**가 다르다.

## 설명

### 라이브러리 ([[React]])
내가 필요할 때 내가 원하는 자리에서 불러다 쓴다. 어디서, 언제, 어떤 순서로 쓸지는 전부 내 코드가 정한다.

```jsx
function MyPage() {
  const [count, setCount] = useState(0); // 내가 원할 때 React 기능을 호출
  return <button onClick={() => setCount(count+1)}>{count}</button>;
}
```

`useState`, `<button>` 같은 걸 쓰는 순서와 위치는 내가 주도권을 쥐고 정한다. React는 도구 상자다.

### 프레임워크 ([[Next.js]])
반대로 **프레임워크가 내 코드를 불러서 쓴다**. 정해진 이름·위치에 코드를 "꽂아두면", 프레임워크가 알아서 적절한 때에 실행한다. 이걸 "제어의 역전(Inversion of Control)"이라고 한다 — 내가 부르는 게 아니라 저쪽이 나를 부른다.

Next.js의 구체적인 규칙들:

| 규칙 | 내용 |
|---|---|
| `app/about/page.tsx` | 이 이름·위치에 두면 Next.js가 자동으로 `/about` 주소에서 보여줌 → [[라우트]] |
| `page.tsx`는 `export default`로 컴포넌트 하나를 내보내야 함 | 다르게 쓰면 Next.js가 못 찾는다 |
| `app/layout.tsx` | 모든 페이지를 감싸는 공통 틀. 이 이름이어야 인식된다 |
| `app/api/users/route.ts`에서 `export function GET()`, `POST()` | 함수 이름을 HTTP 메소드 이름 그대로 지어야 자동 연결된다 → [[HTTP 메소드]] |
| `loading.tsx`, `error.tsx`, `not-found.tsx` | 이 이름으로 두면 로딩·에러·404 상황에 Next.js가 알아서 꺼내 쓴다 |
| 파일 맨 위 `'use client'` | 이 한 줄로 서버에서 실행할지 브라우저에서 실행할지 Next.js가 결정한다 |

## 비유
라이브러리는 공구함. 필요한 공구를 내가 꺼내서 내 방식대로 쓴다. 프레임워크는 조립 설명서가 있는 가구 키트. 정해진 자리에 정해진 부품을 넣어야 완성된다. 순서를 어기면 안 맞는다.

## 헷갈리기 쉬운 점
- React는 프레임워크가 아니라 라이브러리다. 화면 그리기만 맡고, 라우팅·서버 기능은 없다.
- [[Vite]]는 라이브러리도 프레임워크도 아니다. **빌드 도구**다. 화면 구성엔 관여하지 않고, 코드를 빠르게 묶고 실행만 해준다.
- 프레임워크를 쓰면 배울 규칙(파일명, 위치, export 방식)이 많아지지만, 그만큼 라우팅·서버 기능이 자동으로 따라온다.

## 관련 개념
- [[Vite]]: 빌드 도구 — 라이브러리도 프레임워크도 아님
- [[React]]: 대표적인 라이브러리
- [[Next.js]]: 대표적인 프레임워크
- [[라우트]]: Next.js 규칙의 대표 예
- [[컴포넌트]]: 라이브러리·프레임워크 둘 다에서 쓰는 단위
