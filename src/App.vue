<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

import ClothesSearchBar from './components/clothes/ClothesSearchBar.vue'
import ClothesWeatherFilter from './components/clothes/ClothesWeatherFilter.vue'
import UnitToggler from './components/clothes/UnitToggler.vue'
import { useWeatherStore } from './stores/weatherStore.js'

const route = useRoute()

// [Hands-on 3] 검색·필터 컴포넌트는 Props/Emits 구조를 유지한 채 위치만 이동.
// App.vue는 Store와 이어 주는 얇은 부모 역할
const weatherStore = useWeatherStore()
const { searchQuery, selectedWeatherType, weatherTypeFilters } = storeToRefs(weatherStore)

// 오늘 뭐 입지? 전용 화면에서만 중앙 타이틀과 지도 컨트롤 노출
const isClothesService = computed(() => route.path.startsWith('/clothes'))
</script>

<template>
  <div class="app-shell">
    <!-- [라우팅 과제 요구사항 2.] 새로고침 없이 URL을 변경하는 Navigation Bar -->
    <header class="app-header">
      <div class="header-left">
        <nav class="navigation" aria-label="주요 메뉴">
          <RouterLink to="/">날씨 대시보드</RouterLink>
          <RouterLink to="/clothes">오늘 뭐 입지?</RouterLink>
          <RouterLink to="/about">서비스 소개</RouterLink>
        </nav>
      </div>

      <!-- 오늘 뭐 입지? 서비스의 현재 화면 제목 -->
      <div v-if="isClothesService" class="service-heading">
        <strong>오늘 뭐 입지?</strong>
      </div>

      <!-- 변경: 지도 영역 확보를 위해 날씨 필터와 도시 검색을 단위 토글 옆으로 집약 -->
      <div class="header-controls">
        <ClothesSearchBar
          v-if="isClothesService"
          :current-query="searchQuery"
          @update-query="weatherStore.updateSearchQuery"
        />

        <ClothesWeatherFilter
          v-if="isClothesService"
          :filters="weatherTypeFilters"
          :selected-type="selectedWeatherType"
          @update-type="weatherStore.updateWeatherType"
        />

        <!-- [Hands-on 5 요구사항 2.] Navigation Bar 옆에 전역 단위 설정 배치 -->
        <UnitToggler />
      </div>
    </header>

    <!-- [라우팅 과제 요구사항 2.] 현재 URL과 일치하는 View가 출력되는 영역 -->
    <main class="page-container">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  background: #f3f6f7;
  color: #29302d;
}

/*
  변경: 내비게이션·지도 컨트롤이 늘어나도 중앙 타이틀과 겹치지 않도록 3열 그리드 사용.
  양쪽 1fr이 항상 같은 폭 → 가운데 타이틀은 화면 정중앙 유지
*/
.app-header {
  position: relative;
  z-index: 50;
  display: grid;
  align-items: center;
  grid-template-columns: 1fr auto 1fr;
  gap: 20px;
  min-height: 82px;
  padding: 0 max(24px, calc((100% - 1380px) / 2));
  border-bottom: 1px solid #e0e4e2;
  background: rgb(255 255 255 / 94%);
}

.header-left {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 22px;
}

.header-controls {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}

.service-heading {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 1px;
}

.service-heading strong {
  color: #29302d;
  font-size: clamp(20px, 2vw, 30px);
  font-weight: 800;
  letter-spacing: -0.045em;
  white-space: nowrap;
}

.navigation {
  display: flex;
  align-items: center;
  gap: 8px;
}

.navigation a {
  position: relative;
  flex: 0 0 auto;
  padding: 29px 8px 27px;
  color: #505955;
  font-size: 13px;
  text-decoration: none;
  white-space: nowrap;
}

.navigation a.router-link-active {
  background: transparent;
  color: #586b31;
  font-weight: 700;
}

.navigation a.router-link-active::after {
  position: absolute;
  right: 6px;
  bottom: -1px;
  left: 6px;
  height: 2px;
  background: #66783d;
  content: '';
}

.page-container {
  width: min(100% - 32px, 1440px);
  margin: 0 auto;
  padding: 0 0 28px;
}

/* 폭이 좁아지면 중앙 타이틀 유지 공간 부족 → 세로 배치 */
@media (max-width: 1180px) {
  .app-header {
    align-items: flex-start;
    grid-template-columns: 1fr;
    gap: 0;
    padding: 16px 22px 0;
  }

  .header-left {
    flex-wrap: wrap;
    order: 1;
    width: 100%;
    gap: 0 18px;
  }

  .service-heading {
    align-items: flex-start;
    order: 0;
    margin-bottom: 6px;
  }

  .header-controls {
    justify-content: flex-start;
    order: 2;
    width: 100%;
    padding-bottom: 12px;
    overflow-x: auto;
  }

  .navigation a {
    padding: 12px 8px;
  }

  .page-container {
    width: 100%;
  }
}
</style>
