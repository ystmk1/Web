---
type: 질문
concepts: ["Cloudflare", "CDN", "Workers", "R2"]
tags: [web-workshop, 질문, 배포]
created: 2026-11-06
---

# Cloudflare가 뭔지

## 질문
> Cloudflare가 뭔지.

## 답

### 한 줄로
Cloudflare는 내 사이트와 사용자 사이에 서서 속도와 보안을 맡아 주는 인터넷 인프라 회사다. 호스팅, 저장소, 서버 코드 실행까지 서비스 범위가 넓어졌다.

### 처음 시작한 일
사용자가 사이트에 접속하면 요청은 먼저 Cloudflare를 거친다. 그래서 Cloudflare가 중간에서 일을 대신할 수 있다.

- **CDN:** 사이트 파일을 전 세계 서버에 복사해 둔다. 사용자는 가까운 서버에서 파일을 받아 빨라진다.
- **DNS:** [[도메인]]을 IP 주소로 바꿔 주는 일을 한다.
- **보안:** 공격성 트래픽(DDoS)을 중간에서 막는다.

### 지금 제공하는 서비스
| 서비스 | 하는 일 |
|---|---|
| Workers | 서버 코드를 실행한다. 정적 파일도 올릴 수 있다 |
| Pages | 정적 사이트 호스팅. 새 프로젝트는 Workers를 권장한다 |
| R2 | 파일 저장소. 이미지·영상 같은 큰 파일에 쓴다 |
| D1 | SQL 데이터베이스 |
| KV | 단순한 키-값 저장소 |

### 헷갈리기 쉬운 점
- Cloudflare는 하나의 서비스가 아니라 여러 서비스를 묶은 회사 이름이다.
- 도메인을 사는 곳, DNS를 관리하는 곳, 사이트를 올리는 곳이 모두 Cloudflare일 수 있다. 하지만 셋은 따로 쓸 수도 있다.
- Supabase 같은 BaaS와 겹치는 부분(저장소, DB)이 있다. 다만 출발점이 다르다. Cloudflare는 네트워크 쪽에서 시작했다.

### 웹 개발에서는
- 정적 사이트나 가벼운 API는 Workers 하나로 배포한다.
- 영상처럼 용량이 큰 파일은 R2에 두고 사이트에서 불러온다.

## 관련 개념
- Cloudflare Workers: 서버 코드와 정적 파일을 함께 배포하는 서비스 → [[2026-11-06 Cloudflare로 호스팅할 때 Pages보다 Workers를 권장하는 이유]]
- R2: Cloudflare의 파일 저장소 → [[2026-11-05 Cloudflare R2가 AWS S3·Supabase 스토리지와 뭐가 다른지]]
- BaaS: Cloudflare와 역할이 일부 겹치는 분류 → [[2026-11-02 BaaS가 뭐고 Supabase·Firebase·Cloudflare는 어떻게 다른지]]
