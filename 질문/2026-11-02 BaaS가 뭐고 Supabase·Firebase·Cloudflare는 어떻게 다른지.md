---
type: 질문
concepts: ["[[BaaS]]", "[[서버]]", "[[웹 호스팅]]"]
tags: [web-workshop, 질문, 백엔드]
created: 2026-11-02
---

# BaaS가 뭐고 Supabase·Firebase·Cloudflare는 어떻게 다른지

## 질문
> BaaS가 뭐고, Supabase·Firebase·Cloudflare 같은 서비스들은 서로 어떻게 다른지.

## 답

### BaaS란
[[BaaS]]는 백엔드를 직접 만들지 않고 가져다 쓰는 서비스다. 데이터베이스·인증·저장소를 이미 만들어서 제공한다.

### 세 서비스 비교
| | 성격 | 데이터베이스 | 특징 |
|---|---|---|---|
| Firebase | 구글의 BaaS | NoSQL(문서형) | 가장 오래되고 쉽다. 구글 생태계와 잘 묶인다 |
| Supabase | 오픈소스 BaaS | PostgreSQL(관계형, SQL) | "오픈소스 Firebase"로 불린다. SQL에 익숙하면 더 편하다 |
| Cloudflare | 인프라·엣지 플랫폼 | 자체 DB(D1 등)도 있음 | 원래 CDN·[[DNS]] 회사. 전 세계 서버(엣지)에서 코드를 돌려 빠르다 |

### 헷갈리기 쉬운 점
Firebase·Supabase는 "백엔드를 통째로 빌려주는 서비스"다. Cloudflare는 원래 네트워크·보안 인프라 회사였다가, 최근 개발자용 서비스(Workers, D1 등)를 늘리면서 영역이 겹치게 됐다.

## 관련 개념
- [[BaaS]]: Firebase·Supabase가 속하는 분류
- [[DNS]]: Cloudflare의 원래 사업 영역
