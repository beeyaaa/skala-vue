import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// [Hands-on 7] Element Plus는 vite.config.js의 온디맨드 설정으로
// 사용한 컴포넌트만 자동 등록 → 전역 등록 생략
app.mount('#app')
