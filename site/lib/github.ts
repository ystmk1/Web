import 'server-only'

const API = 'https://api.github.com'

function config() {
  const token = process.env.GITHUB_TOKEN
  const repo = process.env.GITHUB_REPO || 'ystmk1/Web'
  const branch = process.env.GITHUB_BRANCH || 'main'
  if (!token) throw new Error('GITHUB_TOKEN 환경 변수가 없어요.')
  return { token, repo, branch }
}

const headers = (token: string) => ({
  Authorization: `Bearer ${token}`,
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'web-workshop-wiki',
})

const encPath = (p: string) => p.split('/').map(encodeURIComponent).join('/')

export async function fileExists(path: string) {
  const { token, repo, branch } = config()
  const r = await fetch(`${API}/repos/${repo}/contents/${encPath(path)}?ref=${encodeURIComponent(branch)}`, {
    headers: headers(token),
    cache: 'no-store',
  })
  if (r.status === 404) return false
  if (!r.ok) throw new Error(`GitHub 확인 실패 (${r.status})`)
  return true
}

/** 새 파일만 만든다. 이미 있는 파일은 덮어쓰지 않는다 (sha 를 안 넘기면 GitHub 가 거절한다). */
export async function createFile(path: string, content: string, message: string) {
  const { token, repo, branch } = config()
  const r = await fetch(`${API}/repos/${repo}/contents/${encPath(path)}`, {
    method: 'PUT',
    headers: { ...headers(token), 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, branch, content: Buffer.from(content, 'utf8').toString('base64') }),
  })
  const json = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error(`GitHub 저장 실패 (${r.status}): ${json.message ?? ''}`)
  return { url: json.content?.html_url as string | undefined, branch, repo }
}
