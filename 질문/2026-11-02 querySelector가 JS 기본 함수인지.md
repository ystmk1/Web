---
type: 질문
concepts: ["[[주요 DOM 메서드]]", "[[DOM]]"]
tags: [web-workshop, 질문, 웹기초]
created: 2026-11-02
---

# querySelector가 JS 기본 함수인지

## 질문
> querySelector 같은 건 JS 기본 함수인지, 예제에서 지정한 그냥 예시 함수인지. 기본 함수가 있다면 리스트업.

## 답
예시로 지어낸 게 아니라 전부 진짜로 존재하는 기본 함수다. 정확히는 JS 언어 자체의 기능이 아니라, 브라우저가 [[DOM]]을 통해 빌려주는 기능(Web API)이다. → [[주요 DOM 메서드]]

### 헷갈리기 쉬운 점
`document.`나 어떤 요소 뒤에 `.`을 찍고 쓰는 건, 그 객체가 브라우저로부터 빌려받은 도구이기 때문이다. 그래서 브라우저 밖(Node.js)에는 이 함수들이 없다.

## 관련 개념
- [[주요 DOM 메서드]]: querySelector·addEventListener·classList 등 목록
- [[DOM]]: 이 메서드들이 다루는 대상
