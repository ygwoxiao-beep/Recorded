# 录播课详情页优化（Demo）

围绕「AI 可视化 + 交互体验升级」对录播课详情页进行原型改造，技术栈：Vite + React + Tailwind v4。

## 本地运行

**Prerequisites**: Node.js 18+

```bash
npm install
npm run dev   # 默认 http://localhost:3000
```

可选脚本：

```bash
npm run build   # 生产构建
npm run lint    # tsc --noEmit
npm run preview # 预览生产构建
```

## LiteLLM 网关（可选 · 以 OpenAI 兼容接口管理调用）

使用 [LiteLLM](https://github.com/BerriAI/litellm) 自建 AI 网关：由网关持有 `OPENAI_API_KEY`，客户端只带 `LITELLM_MASTER_KEY` 调 `/v1/*`，便于限流、计费与换模型。

1. 复制 `.env.example` 为 `.env`，填写 `OPENAI_API_KEY` 与 `LITELLM_MASTER_KEY`。
2. 启动网关：`npm run litellm:up`（需已安装 Docker）。
3. 自检：`npm run litellm:smoke`（网关需已监听，默认请求 `gpt-4o-mini`）。
4. 前端开发：在 `npm run dev` 下请求 **`/litellm/v1/...`**（由 Vite 代理到 `LITELLM_PROXY_URL`），请求头 `Authorization: Bearer <LITELLM_MASTER_KEY>`。模型名需与 `litellm/config.yaml` 里 `model_list[].model_name` 保持一致。
5. 任意 OpenAI SDK：把 `baseURL` 设为网关根地址 + `/v1`，`apiKey` 填 `LITELLM_MASTER_KEY`（与 LiteLLM 官方 README 示例一致）。

## 页面设计协作约定（给 AI / 协作者）

当需求为「设计页面」「出视觉稿」「改版 UI」等时，助手应优先通过 Gemini / ChatGPT / Claude 等模型生成设计方向，再结合本仓库技术栈（Vite + React + Tailwind）落地实现；避免仅凭空想象凑布局。
