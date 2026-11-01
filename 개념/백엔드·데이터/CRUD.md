---
type: 개념
category: "[[백엔드·데이터]]"
aliases: [Create Read Update Delete]
tags: [web-workshop, 개념, 백엔드]
created: 2026-11-02
updated: 2026-11-02
---

# CRUD

> 데이터를 다루는 네 가지 기본 동작. Create(만들기), Read(읽기), Update(수정하기), Delete(삭제하기).

## 설명
- 거의 모든 서비스의 데이터 처리는 이 네 가지로 쪼개진다.
- 게시판을 예로 들면: 글쓰기(Create), 글보기(Read), 글수정(Update), 글삭제(Delete).
- [[서버]]의 API는 보통 이 네 동작에 맞춰 만들어진다.

## 웹 개발에서는
- [[HTTP 메소드]]와 자연스럽게 짝이 맞는다: Create는 POST, Read는 GET, Update는 PATCH(또는 PUT), Delete는 DELETE.
- 데이터베이스를 쓰는 기능을 만든다면, 십중팔구 CRUD 중 하나 이상을 구현하는 일이다.

## 관련 개념
- [[HTTP 메소드]]: CRUD 각 동작과 짝이 되는 요청 방식
- [[서버]]: CRUD를 처리하는 쪽
