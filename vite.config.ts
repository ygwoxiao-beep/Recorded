import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    // 部署到 GitHub Pages 项目站点 https://ygwoxiao-beep.github.io/Recorded/
    // 本地 dev 与 preview 仍走 '/'，所以仅在 build 时使用子路径
    base: mode === 'production' ? '/Recorded/' : '/',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      // 开发时经 LiteLLM 网关调用 OpenAI 兼容 API：fetch('/litellm/v1/chat/completions', ...)
      // 网关默认 http://127.0.0.1:4000 ，可用环境变量 LITELLM_PROXY_URL 覆盖
      proxy: {
        '/litellm': {
          target: (env.LITELLM_PROXY_URL || 'http://127.0.0.1:4000').replace(/\/$/, ''),
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/litellm/, '') || '/',
        },
      },
    },
  };
});
