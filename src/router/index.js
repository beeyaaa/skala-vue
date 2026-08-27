import { createRouter, createWebHistory } from 'vue-router'

// [라우팅 과제 요구사항 1.] 첫 화면은 애플리케이션 시작 시 바로 불러오는 정적 Import 적용
import WeatherHomeView from '../views/WeatherHomeView.vue'

const routes = [
  {
    path: '/',
    name: 'WeatherHome',
    component: WeatherHomeView,
  },
  {
    path: '/about',
    name: 'WeatherAbout',
    // [라우팅 과제 요구사항 1.] 접근할 때 컴포넌트를 불러오는 Lazy Loading 적용
    component: () => import('../views/WeatherAboutView.vue'),
  },
  {
    // [라우팅 과제 요구사항 4.] :cityId를 동적 세그먼트로 사용
    path: '/weather/:cityId',
    name: 'WeatherDetail',
    component: () => import('../views/WeatherDetailView.vue'),
  },
  {
    // [라우팅 과제 요구사항 6.] 기존 View와 분리한 본인 추가 지도 View
    path: '/clothes',
    name: 'ClothesMap',
    component: () => import('../views/views-clothes/ClothesMapView.vue'),
  },
  {
    // 오늘 뭐 입지? 서비스 전용 도시 상세 동적 Route
    path: '/clothes/weather/:cityId',
    name: 'ClothesWeatherDetail',
    component: () => import('../views/views-clothes/ClothesWeatherDetailView.vue'),
  },
  {
    // [라우팅 과제 요구사항 1.] 위 규칙과 일치하지 않는 모든 URL 처리
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFoundView.vue'),
  },
]

const router = createRouter({
  // 참고 코드와 동일하게 /about 형태 URL을 쓰는 History 모드 적용
  history: createWebHistory(),
  routes,
})

export default router
