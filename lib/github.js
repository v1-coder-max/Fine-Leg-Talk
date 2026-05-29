const REPO = process.env.GITHUB_REPO || 'v1-coder-max/Fine-Leg-Talk';
const BRANCH = process.env.GITHUB_BRANCH || 'main';
const TOKEN = process.env.GITHUB_TOKEN;
const FILE = 'posts.json';

const API = 'https://api.github.com';

function headers() {
  if (!TOKEN) throw new Error('GITHUB_TOKEN is not configured');
  return {
    Authorization: `Bearer ${TOKEN}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

export async function fetchPostsFile() {
  const url = `${API}/repos/${REPO}/contents/${FILE}?ref=${BRANCH}`;
  const res = await fetch(url, { headers: headers(), cache: 'no-store' });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`GitHub fetch failed (${res.status}): ${txt}`);
  }
  const data = await res.json();
  const content = Buffer.from(data.content, 'base64').toString('utf8');
  return { sha: data.sha, json: JSON.parse(content) };
}

export async function commitPostsFile({ posts, message, sha }) {
  const url = `${API}/repos/${REPO}/contents/${FILE}`;
  const body = {
    message,
    content: Buffer.from(JSON.stringify({ posts }, null, 2), 'utf8').toString('base64'),
    branch: BRANCH,
    sha,
  };
  const res = await fetch(url, {
    method: 'PUT',
    headers: { ...headers(), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`GitHub commit failed (${res.status}): ${txt}`);
  }
  return await res.json();
}
