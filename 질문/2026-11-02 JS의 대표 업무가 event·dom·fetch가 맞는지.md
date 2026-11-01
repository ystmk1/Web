---
type: 질문
concepts: ["[[JavaScript]]", "[[DOM]]"]
tags: [web-workshop, 질문, 프론트엔드]
created: 2026-11-02
---

# JS의 대표 업무가 event·dom·fetch가 맞는지

## 질문
> JavaScript의 대표 업무(기능·용도)가 event, DOM, fetch가 맞는지.

## 답

### 한 줄로
거의 맞다. 브라우저에서 돌아가는 JavaScript의 대표 업무는 보통 **DOM 조작, 이벤트 처리, fetch(네트워크 요청)** 셋으로 소개된다.

### 셋을 나란히 보면
| 일 | 하는 것 | 대표 API |
|---|---|---|
| [[DOM]] 조작 | 화면 요소를 찾고 내용·속성을 바꾸거나 만들고 지우기 | `document.querySelector`, `.textContent`, `.classList` |
| 이벤트 처리 | 클릭·입력·스크롤 같은 사용자 동작에 반응하기 | `addEventListener` |
| fetch (네트워크 요청) | 서버에 데이터를 요청하고 받아오기 | `fetch()` |

### 짚을 점
이 셋 다 [[JavaScript]] **언어 자체의 기능이 아니라, 브라우저가 JS에게 빌려주는 도구(Web API)**다. JS 언어 본체는 변수·조건문·반복문·함수 같은 "연산" 부분만 맡는다. DOM·이벤트·fetch는 브라우저가 "이 함수들 써도 돼"하고 얹어주는 것이다. 그래서 같은 JavaScript라도 Node.js 서버 환경에는 DOM이 없다. `document`라는 것 자체가 존재하지 않는다.

### 웹 개발에서는
- 입문 단계에서는 "JS = DOM 조작 + 이벤트 처리 + fetch"로 외우면 충분하다. React 같은 프레임워크를 배우면 이 셋을 직접 다루는 대신 더 편한 방식(상태, 훅)으로 감싸서 쓰게 된다.

## 관련 개념
- [[JavaScript]]: 이 업무들을 수행하는 언어
- [[DOM]]: 대표 업무 중 하나
