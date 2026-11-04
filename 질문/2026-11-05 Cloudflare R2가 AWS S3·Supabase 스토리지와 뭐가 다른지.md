---
type: 질문
concepts: ["[[Cloudflare R2]]", "[[BaaS]]"]
tags: [web-workshop, 질문, 백엔드]
created: 2026-11-05
---

# Cloudflare R2가 AWS S3·Supabase 스토리지와 뭐가 다른지

## 질문
> cloudflare r2는 뭐가 다른거야?

## 답
가장 많이 비교되는 대상은 AWS S3와 Supabase 스토리지다.

- **AWS S3와 비교**: API는 거의 똑같다(S3 호환). 가장 큰 차이는 다운로드(egress) 요금이다. S3는 다운로드할 때마다 트래픽 요금이 붙지만, R2는 다운로드가 용량과 무관하게 항상 무료다. 또 R2는 Cloudflare의 전세계 서버망(CDN)을 그대로 타서 사용자와 가까운 곳에서 빠르게 전달되는데, S3는 리전을 직접 골라야 한다.
- **Supabase 스토리지와 비교**: Supabase 스토리지는 로그인·데이터베이스와 묶인 [[BaaS]]의 부가 기능이고, R2는 파일 저장만 전문으로 하는 독립 서비스다. 로그인·DB 없이 미디어만 관리할 땐 R2가 더 단순하다.

## 관련 개념
- [[Cloudflare R2]]: 이 질문의 대상
- [[BaaS]]: Supabase 스토리지가 속하는 분류
