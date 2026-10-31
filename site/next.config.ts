import type { NextConfig } from 'next'
import path from 'node:path'

const nextConfig: NextConfig = {
  // site/ 안에서만 빌드한다. 노트 폴더는 scripts/build-index.mjs 가 읽어서 generated/notes.json 으로 넘긴다.
  turbopack: { root: path.resolve(process.cwd()) },
}

export default nextConfig
