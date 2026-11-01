---
type: 개념
category: "[[웹 기초]]"
aliases: [Document Object Model, 돔, DOM 트리]
tags: [web-workshop, 개념, 웹기초]
created: 2026-11-02
updated: 2026-11-02
---

# DOM

> 브라우저가 [[HTML]]을 읽어서 메모리에 만든 "문서를 나타내는 나무(트리) 모양 객체". [[JavaScript]]가 이 트리를 바꾸면 화면도 같이 바뀐다.

## 설명
- Document Object Model의 줄임말이다.
- 브라우저는 HTML 파일을 받으면 그 글자를 그대로 화면에 붙이지 않는다. 태그를 부모-자식 관계의 트리로 조립한 뒤, 그 트리를 보고 화면을 그린다. 이 트리가 DOM이다.

```html
<body>
  <h1>제목</h1>
  <p>문단</p>
</body>
```

```
body
├─ h1 ("제목")
└─ p ("문단")
```

- JavaScript는 `document`라는 객체로 이 트리에 접근한다. 찾고(`querySelector`), 내용을 바꾸고(`.textContent`), 새로 만들고(`createElement`), 지울 수 있다(`remove`).

```js
document.querySelector("h1").textContent = "바뀐 제목";
```

- 이 코드를 실행하면 HTML 파일은 그대로지만, 화면의 제목은 바로 바뀐다. DOM(메모리 속 모형)을 바꿨기 때문이다.

## 비유
설계도(HTML 파일)를 보고 조립한 실물 미니어처 모형(DOM). 설계도 종이 자체는 고정이지만, 모형은 손으로 벽을 옮기거나 방을 새로 달 수 있다. 모형을 바꾸면 그 순간 모형의 모습이 바로 바뀐다.

## 헷갈리기 쉬운 점
- **HTML ≠ DOM.** HTML은 서버가 보내준 원본 글자 파일이다. DOM은 브라우저가 그걸 읽어서 메모리에 만든 결과물이다. 브라우저 개발자 도구의 Elements 탭에서 보이는 건 원본 HTML이 아니라 **지금 이 순간의 DOM**이다. JavaScript가 나중에 바꾼 내용도 거기 반영된다.
- "페이지 소스 보기"(Ctrl+U)는 서버가 보낸 원본 HTML을 보여준다. 개발자 도구 Elements 탭은 지금의 DOM을 보여준다. JavaScript가 화면을 바꿨다면 이 둘은 서로 다르게 보인다.
- DOM을 다루는 `document.querySelector` 같은 기능은 JavaScript 언어 자체가 아니라, **브라우저가 JavaScript에게 빌려주는 도구(Web API)**다. 그래서 브라우저 밖(Node.js)에는 DOM이 없다.

## 웹 개발에서는
- React 같은 프레임워크는 진짜 DOM을 직접 건드리는 대신, 가상 DOM(Virtual DOM)이라는 복사본에서 먼저 계산하고 바뀐 부분만 진짜 DOM에 반영해서 속도를 높인다.
- 개발자 도구 Elements 탭에서 DOM을 직접 고쳐보며 디자인을 실험할 수 있다. 다만 새로고침하면 사라진다. 진짜로 바꾸려면 HTML 파일이나 코드 자체를 고쳐야 한다.

## 관련 개념
- [[HTML]]: DOM의 원재료
- [[JavaScript]]: DOM을 읽고 바꾸는 언어
- [[브라우저]]: DOM을 만들고 보여주는 프로그램
- [[렌더링 엔진]]: DOM을 보고 실제 화면(픽셀)을 그리는 부분

## 나온 질문
- [[2026-11-02 버튼 클릭 코드가 전부 함수인지]]
