/**
 * 连通性自检：经 LiteLLM 网关调用 OpenAI 兼容 /v1/chat/completions
 *
 * 用法（项目根目录，已配置 .env）:
 *   npm run litellm:smoke
 *
 * 依赖网关已启动: docker compose -f docker-compose.litellm.yml up
 */
import 'dotenv/config';

const base = (process.env.LITELLM_PROXY_URL ?? 'http://127.0.0.1:4000').replace(/\/$/, '');
const key = process.env.LITELLM_MASTER_KEY ?? 'sk-litellm-local-dev';
const model = process.env.LITELLM_SMOKE_MODEL ?? 'gpt-4o-mini';

async function main() {
  const url = `${base}/v1/chat/completions`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: 'Reply with exactly: ok' }],
      max_tokens: 8,
    }),
  });

  const text = await res.text();
  if (!res.ok) {
    console.error(`HTTP ${res.status} ${res.statusText}\n${text}`);
    process.exit(1);
  }
  console.log('LiteLLM smoke test OK:', text.slice(0, 500));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
