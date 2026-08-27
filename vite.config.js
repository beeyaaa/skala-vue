import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

/*
  [Hands-on 8] 배포용 서버리스 함수를 개발 서버에서도 그대로 실행합니다.

  api/ 폴더의 함수는 Vercel에서 /api/* 경로로 자동 배포.
  개발 중에도 같은 경로가 동작해야 클라이언트 코드가 환경별로 갈라지지 않으므로
  동일 파일을 불러와 미들웨어로 연결 (별도 CLI 불필요)
*/
const vercelApiDevServer = (env) => ({
  name: 'vercel-api-dev-server',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      const path = req.url?.split('?')[0]
      if (!path?.startsWith('/api/')) return next()

      const name = path.replace('/api/', '')

      try {
        // .env.local 값을 서버리스 함수와 동일하게 process.env로 전달
        process.env.OPENWEATHER_API_KEY ??= env.OPENWEATHER_API_KEY
        process.env.KMA_API_KEY ??= env.KMA_API_KEY

        const module = await server.ssrLoadModule(`/api/${name}.js`)
        await module.default(req, res)
      } catch (error) {
        server.config.logger.error(`[api] ${name} 실행 실패: ${error.message}`)
        res.statusCode = 500
        res.setHeader('content-type', 'application/json; charset=utf-8')
        res.end(JSON.stringify({ message: 'API 함수 실행에 실패했습니다.' }))
      }
    })
  },
})

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 세 번째 인자를 ''로 두면 VITE_ 접두사가 없는 값도 읽어옴
  // 이 값들은 개발 서버(Node) 전용 — 클라이언트 번들에 미포함
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      vue(),
      vueDevTools(),
      // [Hands-on 7·8] Element Plus 전체를 등록하면 번들이 크게 늘어납니다.
      // 템플릿에서 실제로 사용한 컴포넌트와 그 스타일만 자동으로 가져옵니다.
      Components({
        resolvers: [ElementPlusResolver()],
        dts: false,
      }),
      vercelApiDevServer(env),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    // 로컬 개발 서버(Dev Server) 속성 제어
    server: {
      port: 3000, // 개발 서버의 네트워크 포트를 3000번으로 고정 명세
      open: true, // 프로세스 기동(npm run dev) 시 기본 웹 브라우저를 자동 실행
    },
    // 컴파일 완료된 산출물(Production Build) 사양 제어
    build: {
      outDir: 'dist', // 최종 정적 리소스(HTML, JS, CSS)가 저장될 출력 디렉토리명 지정
    },
  }
})
