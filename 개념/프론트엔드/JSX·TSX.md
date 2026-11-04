---
type: 개념
category: "[[프론트엔드]]"
aliases: [JSX, TSX, jsx, tsx]
tags: [web-workshop, 개념, 프론트엔드, 코드와언어]
created: 2026-11-02
updated: 2026-11-04
---

# JSX·TSX

> JavaScript 안에 HTML처럼 생긴 코드를 바로 쓸 수 있게 해주는 문법. [[React]]에서 화면을 만들 때 쓴다. TSX는 여기에 [[JavaScript|TypeScript]](타입 검사)를 더한 것.

## 설명
- 이름의 뜻: **JSX** = **J**ava**S**cript + **X**ML, **TSX** = **T**ype**S**cript + **X**ML. X는 그냥 글자가 아니라 **XML**의 줄임이다. JSX 문법이 HTML/XML처럼 태그로 생겼기 때문에 붙은 이름이다.
- JSX가 없던 방식은 화면 하나를 만드는 데도 여러 줄이 필요했다.

```js
const button = document.createElement("button");
button.textContent = "클릭";
button.addEventListener("click", () => alert("안녕"));
```

- JSX는 이걸 HTML처럼 쓰게 해준다. 중요한 건, JS의 조건문·반복문·변수를 마크업 안에 그대로 섞어 쓸 수 있다는 점이다.

```jsx
function Button({ count }) {
  return count > 0 ? <button>클릭 {count}번</button> : <p>아직 없음</p>;
}
```

- 원래 JavaScript 문법에는 `<button>` 같은 태그가 없다. 브라우저는 이걸 그대로 못 읽어서, 빌드할 때 평범한 JS 함수 호출로 번역된다(`React.createElement(...)` 형태).

| | JavaScript만 | TypeScript 추가 |
|---|---|---|
| 일반 코드 | `.js` | `.ts` |
| HTML 섞인 코드(JSX) | `.jsx` | `.tsx` |

## 헷갈리기 쉬운 점
- JSX의 목적은 "HTML을 안 쓰게 하는 것"이 아니다. **마크업(화면 구조)과 그걸 움직이는 JS 로직을 한 파일, 한 덩어리(컴포넌트)로 묶기 위한 것**이다.
- "범용성"보다는 **컴포넌트 단위 재사용**에 가깝다. 버튼 하나를 컴포넌트로 만들어두면 `<Button count={3} />`처럼 여러 군데서 재사용할 수 있다.

## 웹 개발에서는
- 요즘 React 프로젝트는 대부분 `.tsx` 파일을 쓴다. JSX로 화면을 짜면서 TypeScript 타입 검사도 같이 받기 위해서다.

## 관련 개념
- [[JavaScript]]: JSX·TSX가 결국 변환되는 언어

## 나온 질문
- [[2026-11-04 JSX·TSX의 X가 정확히 뭘 뜻하는지]]
- [[React]]: JSX를 쓰는 대표 라이브러리
- [[컴포넌트]]: JSX로 만드는 화면 조각
