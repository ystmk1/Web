---
type: 개념
category: "[[배포]]"
aliases: [Workers, 워커, 클라우드플레어 워커, Cloudflare Pages, Pages, Workers Static Assets, wrangler]
tags: [web-workshop, 개념, 배포, 백엔드]
created: 2026-11-06
updated: 2026-11-06
---

# Cloudflare Workers

> Cloudflare의 전 세계 서버에서 내 코드를 실행해 주는 서비스. 지금은 HTML·CSS·이미지 같은 사이트 파일도 같이 올릴 수 있어서, 사이트 호스팅과 서버 코드를 한 번에 해결한다.

## 설명
- 원래는 역할이 나뉘어 있었다.

| | 예전 | 지금 |
|---|---|---|
| Pages | 사이트 파일(정적) 호스팅, 서버 코드는 Pages Functions로 덧붙임 | 계속 동작하지만 새 기능 투자는 거의 없음 |
| Workers | 서버 코드 실행만 | **Static Assets**로 사이트 파일까지 올림 → Pages가 하던 일 + 서버 코드 |

- 그래서 Cloudflare 공식 가이드도 **새 프로젝트는 Workers로 시작**하라고 권한다.
- 설정은 `wrangler.toml`(또는 `wrangler.jsonc`) 한 파일에 사이트 파일 폴더, API 코드, [[Cloudflare R2|R2]]·D1 같은 연결(바인딩)을 다 적고 `wrangler deploy`로 올린다. 깃허브에 푸시하면 자동 빌드되게(Workers Builds) 할 수도 있다.

## 왜 Workers를 권장하나
1. **한 배포로 끝난다.** 사이트 화면과 API(예: 댓글 저장)를 프로젝트 두 개로 나눠 연결할 필요 없이, 하나의 Worker가 파일 요청엔 파일을, `/api/...` 요청엔 코드를 실행한다.
2. **새 기능이 Workers에만 생긴다.** Durable Objects, Cron(예약 실행), Queues 등은 Workers 쪽이 먼저거나 Workers 전용이다.
3. **R2·D1·KV를 같은 방식으로 붙인다.** 설정 파일 하나에 바인딩을 적으면 코드에서 `env.DB`처럼 바로 쓴다.
4. **정적 파일 요청은 무료**라서, 그냥 정적 사이트만 올려도 Pages와 비용 차이가 거의 없다.

## 비유
예전엔 "전시장(Pages)"과 "안내데스크(Workers)"를 따로 임대해서 이어 붙였다면, 지금은 안내데스크가 딸린 전시장 한 칸을 통째로 빌리는 것.

## 헷갈리기 쉬운 점
- Pages가 없어지는 건 아니다. 이미 Pages로 잘 돌고 있으면 굳이 옮길 필요는 없다.
- Workers 무료 플랜은 하루 요청 수와 요청당 CPU 시간 제한이 있다. 단, 정적 파일 요청은 이 한도에 포함되지 않는다.
- [[버셀]]과 비슷한 위치지만, Next.js 기능 지원은 버셀이 가장 매끄럽다. Cloudflare에서 Next.js를 쓰려면 어댑터(OpenNext)를 거친다.

## 웹 개발에서는
- 포트폴리오처럼 "화면은 정적, 댓글만 서버가 필요한" 사이트는 Workers 하나에 화면 + 댓글 API + D1을 같이 넣을 수 있다.
- 사이트는 버셀에, 댓글 API만 Worker로 따로 두는 것도 흔한 구성이다.

## 관련 개념
- [[웹 호스팅]]: Workers가 하는 일 중 하나
- [[버셀]]: 비슷한 역할의 다른 호스팅
- [[Cloudflare R2]]: Worker에 바인딩해서 쓰는 파일 저장소
- [[CDN]]: Cloudflare 전 세계 거점에서 파일이 배포되는 방식
- [[빌드]]: 올리기 전에 결과물을 만드는 과정

## 나온 질문
- [[2026-11-06 Cloudflare로 호스팅할 때 Pages보다 Workers를 권장하는 이유]]
