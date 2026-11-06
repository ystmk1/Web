---
type: 질문
category: "[[배포]]"
tags: [web-workshop, 질문, 배포]
created: 2026-11-06
---

# Cloudflare로 호스팅할 때 Pages보다 Workers를 권장하는 이유

## 질문
Cloudflare로 호스팅할 때 새 프로젝트는 Pages보다 Workers를 권장하는데, 이유가 뭔지.

## 답
Workers가 Static Assets 기능으로 사이트 파일까지 올릴 수 있게 되면서, Pages가 하던 일을 Workers 하나로 다 할 수 있게 됐기 때문이다.

- **한 배포로 화면 + 서버 코드:** 파일 요청엔 파일을, `/api` 요청엔 코드를 한 Worker가 처리한다. 프로젝트 두 개를 이어 붙일 필요가 없다.
- **새 기능은 Workers 쪽에:** Cloudflare가 새 투자를 Workers에 집중하고 있다. Pages는 유지되지만 사실상 관리 모드.
- **바인딩 통일:** R2·D1·KV를 `wrangler.toml` 하나에 적어 바로 쓴다.
- **정적 파일은 무료:** 정적 사이트만 올려도 비용 차이가 거의 없다.

이미 Pages로 잘 돌고 있는 사이트는 그대로 둬도 된다. 옮길 이유가 생길 때 옮기면 된다.

## 관련 개념
- [[Cloudflare Workers]]
- [[웹 호스팅]]
- [[Cloudflare R2]]
- [[버셀]]
