---
type: 질문
category: "[[개발 환경]]"
tags: [web-workshop, 질문, 개발환경]
created: 2026-11-06
---

# NEXT_PUBLIC 변수는 공개 주소라 config로 해야 하는지

## 질문
`NEXT_PUBLIC_...` 같은 건 공개 주소라서 환경 변수가 아니라 config로 해야 한다는 게 맞는 말인지.

## 답
**반은 맞다.** "해야 한다"가 아니라 "해도 된다"에 가깝다.

- `NEXT_PUBLIC_`도 환경 변수다. 다만 빌드할 때 브라우저 코드에 그대로 박히므로 비밀이 아니다.
- 비밀이 아니니 config 파일(코드 안 상수, 예: `lib/config.ts`)에 적어 깃에 같이 올려도 문제없다. 값이 하나뿐이면 오히려 더 단순하다.
- 환경 변수로 두는 게 나은 경우: 개발·미리보기·운영마다 주소가 다를 때(예: 테스트용 버킷과 실제 버킷).
- `NEXT_PUBLIC_` 값을 Vercel에서 바꾸면 **재배포해야** 반영된다.
- 별개로, `next/image`로 R2 같은 외부 이미지를 쓰려면 `next.config`의 `images.remotePatterns`에 도메인을 꼭 등록해야 한다. 이건 환경 변수로 대신할 수 없는 진짜 config 설정이다. "config로 해야 한다"는 말이 이걸 가리킨 거라면 맞다.

## 관련 개념
- [[환경 변수]]
- [[Cloudflare R2]]
- [[Next.js]]
