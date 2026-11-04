---
type: 개념
category: "[[웹 기초]]"
aliases: [DOM 메서드, DOM API, querySelector, addEventListener, classList]
tags: [web-workshop, 개념, 웹기초, 프론트엔드]
created: 2026-11-02
updated: 2026-11-02
---

# 주요 DOM 메서드

> [[DOM]]을 찾고 바꿀 때 자주 쓰는 기본 도구들. JS 문법이 아니라 브라우저가 제공하는 Web API다.

## 설명
전부 예시로 지어낸 함수가 아니라, 모든 브라우저가 기본으로 제공하는 진짜 함수(메서드)다. 역할별로 묶으면 이렇다.

**요소 찾기**
- `document.querySelector("선택자")`: 조건에 맞는 첫 번째 요소 찾기
- `document.querySelectorAll("선택자")`: 조건에 맞는 요소 전부 찾기 (목록으로)
- `document.getElementById("id")`: id로 하나 찾기 (옛날 방식)

**이벤트 듣기**
- `요소.addEventListener("이벤트명", 콜백함수)`: 클릭·입력 등에 반응하기 → [[콜백 함수]]

**화면 바꾸기**
- `요소.classList.add/remove/toggle("클래스명")`: CSS 클래스 붙이기·떼기·전환
- `요소.textContent = "글자"`: 보이는 텍스트 바꾸기
- `요소.innerHTML = "<p>...</p>"`: HTML 구조째로 바꾸기
- `요소.style.color = "red"`: 인라인 스타일 직접 바꾸기
- `요소.setAttribute("속성", "값")`: 속성 바꾸기

**요소 만들고 붙이기**
- `document.createElement("div")`: 새 요소 만들기
- `부모.appendChild(자식)` / `부모.append(자식)`: 자식으로 붙이기
- `요소.remove()`: 요소 지우기

## 헷갈리기 쉬운 점
- 이 함수들은 JS 언어 자체의 기능이 아니다. `document`나 어떤 요소 뒤에 `.`을 찍고 쓰는 건, 그 객체가 브라우저로부터 빌려받은 도구이기 때문이다. 그래서 Node.js(브라우저 밖)에는 이 함수들이 없다.
- `fetch()`, `setTimeout()`도 같은 성격의 Web API다. DOM을 다루진 않지만 브라우저가 제공한다는 점은 같다.

## 관련 개념
- [[DOM]]: 이 메서드들이 다루는 대상
- [[콜백 함수]]: addEventListener에 넘기는 함수
