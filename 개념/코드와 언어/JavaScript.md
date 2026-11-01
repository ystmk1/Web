---
type: 개념
category: "[[코드와 언어]]"
aliases: [JS, 자바스크립트, TypeScript, 타입스크립트]
tags: [web-workshop, 개념, 코드와언어, 프론트엔드]
created: 2026-10-31
updated: 2026-11-02
---

# JavaScript

> 웹 브라우저가 직접 실행하는 프로그래밍 언어. 웹 화면의 동작을 맡고, Node.js로 서버에서도 쓴다.

## 설명
- 1995년에 넷스케이프에서 브라우저용으로 만들었다.
- 브라우저가 직접 실행하는 사실상 유일한 프로그래밍 언어다. 그래서 웹 화면을 움직이려면 JavaScript를 쓸 수밖에 없다.
- Node.js가 나온 뒤로는 브라우저 밖(내 컴퓨터, 서버)에서도 실행할 수 있게 됐다.
- 지금은 JavaScript 하나로 웹 화면, 서버, 모바일 앱(React Native), 데스크톱 앱(Electron)까지 만든다. VS Code, Slack, Obsidian도 JavaScript로 만든 데스크톱 앱이다.

```js
const button = document.querySelector("button");
button.addEventListener("click", () => {
  alert("눌렀어요!");
});
```

### TypeScript
JavaScript에 **타입 검사**를 더한 언어다. "이 값은 숫자여야 해" 같은 규칙을 적어두면 실행 전에 실수를 잡아준다. 브라우저는 TypeScript를 모르기 때문에 JavaScript로 바꿔서(트랜스파일) 실행한다. 요즘 웹 프로젝트는 TypeScript가 기본이다.

## 비유
집의 전기·수도 설비. HTML이 뼈대, CSS가 인테리어라면 JavaScript는 스위치를 누르면 불이 켜지게 하는 설비다.

## 헷갈리기 쉬운 점
- Java와 JavaScript는 전혀 다른 언어다. 당시 인기 있던 Java의 이름을 마케팅으로 빌려왔을 뿐이다.
- HTML·CSS·JavaScript 중에 프로그래밍 언어는 JavaScript 하나다.
- 프론트엔드 JavaScript는 방문자 브라우저로 그대로 전송되기 때문에 누구나 볼 수 있다. 그래서 비밀번호나 API 키를 넣으면 안 된다 → [[환경 변수]], [[리버스 엔지니어링]]

## 웹 개발에서는
- [[React]], [[Next.js]]는 모두 JavaScript(TypeScript)로 쓴다. 워크숍에서 만드는 웹도 이 조합이다.
- `.js`, `.jsx`, `.ts`, `.tsx` 파일이 보이면 JavaScript 계열이다.
- [[npm]]은 JavaScript용 부품(패키지)을 내려받는 도구다.

## 관련 개념
- [[프로그래밍 언어]]: JavaScript가 속한 큰 개념
- [[Python]]: 자주 비교되는 다른 대표 언어
- [[브라우저]]: JavaScript를 실행하는 곳
- [[컴파일러]]: JIT 컴파일, TypeScript 트랜스파일
- [[크로스 브라우징]]: 브라우저마다 JavaScript 기능 지원이 다를 수 있음

## 나온 질문
- [[2026-11-02 퍼블리셔·프론트엔드·백엔드가 나누는 일]]
- [[2026-10-31 프로그래밍 언어 종류와 쓰임새]]
- [[2026-10-31 리버스 엔지니어링과 REA]]
