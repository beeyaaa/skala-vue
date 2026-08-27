<script setup>
import { computed, onMounted, ref, watch, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// 실습 컴포넌트는 components/exercise 폴더에 집약
import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import SearchBar from '../components/exercise/SearchBar.vue'
import WeatherCard from '../components/exercise/WeatherCard.vue'
import WeatherComposition from '../components/exercise/WeatherComposition.vue'
import WeatherMockup from '../components/exercise/WeatherMockup.vue'
import WeatherParent from '../components/exercise/WeatherParent.vue'
import WeatherStatusFilter from '../components/exercise/WeatherStatusFilter.vue'

// [라우팅 과제 요구사항 3.] 현재 Route 정보와 화면 이동용 Router 인스턴스 사용
const route = useRoute()
const router = useRouter()

// 기존 WeatherParent의 반응형 상태와 사용자 기능 유지
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  { id: 'city_04', name: '춘천', temp: 30, status: '안개' },
  { id: 'city_05', name: '판교', temp: 25, status: '흐림' },
  // 변경: 기존 컴포넌트 Hands-on에서 사용한 도시 데이터를 라우팅 대시보드에도 유지
  { id: 'city_06', name: '대전', temp: 27, status: '맑음' },
  { id: 'city_07', name: '광주', temp: 29, status: '비' },
  { id: 'city_08', name: '대구', temp: 31, status: '구름' },
  { id: 'city_09', name: '울산', temp: 32, status: '안개' },
  { id: 'city_10', name: '강릉', temp: 33, status: '흐림' },
])

const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')
const hotThreshold = ref(25)
const selectedStatus = ref('전체')

// 변경: 기존 실습 결과를 Hands-on 단계별로 확인하기 위한 대시보드 메뉴
const handsOnList = [
  { id: 1, title: 'Weather Mockup', description: 'Vue 기본 문법' },
  { id: 2, title: 'Weather Composition', description: '반응형 상태와 Watcher' },
  { id: 3, title: 'Weather Component', description: 'Props · Emits · Slot' },
  { id: 4, title: 'Weather Router', description: '동적 Route와 상세 View' },
]
const selectedHandsOn = ref(1)

// URL에 ?search=검색어가 있으면 첫 렌더링 후 검색 상태로 복원
onMounted(() => {
  if (typeof route.query.search === 'string') {
    searchQuery.value = route.query.search
  }
})

// 참고 코드와 동일하게 검색어를 현재 Path의 Query String과 동기화
watch(searchQuery, (newQuery) => {
  router.push({
    path: route.path,
    query: { search: newQuery || undefined },
  })
})

const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()

  return weatherList.value.filter((item) => {
    const matchesQuery = !query || item.name.includes(query)
    const matchesStatus = selectedStatus.value === '전체' || item.status === selectedStatus.value

    return matchesQuery && matchesStatus
  })
})

// [컴포넌트 과제 요구사항 7.] 필터 목록을 하드코딩하지 않고
// 원본 데이터에서 중복 없이 추출 → 데이터가 바뀌면 버튼도 자동으로 따라옴
const weatherStatuses = computed(() => {
  return ['전체', ...new Set(weatherList.value.map((item) => item.status))]
})

const hotCities = computed(() => {
  return filteredWeatherList.value.filter((city) => city.temp >= hotThreshold.value)
})

watch(selectedCityInfo, (newInfo) => {
  console.log(`[watch 감지] 상태 바 문구가 변경되었습니다 -> ${newInfo}`)
})

watchEffect(() => {
  console.log(`[watchEffect 감지] 현재 검색어 '${searchQuery.value}'로 도시를 필터링합니다.`)
})

watch(hotThreshold, (newTemp, oldTemp) => {
  console.log(`[사용자 기능] 더움 기준 온도 변경: ${oldTemp}°C -> ${newTemp}°C`)
})

// [라우팅 과제 요구사항 3.] Alert 대신 도시 ID가 포함된 상세 URL로 이동
const handleDetailJump = (cityId) => {
  // PDF와 skala-vue-ref에서 제시한 Programmatic Navigation 표현 적용
  router.push('/weather/' + cityId)
}
</script>

<template>
  <section class="weather-home">
    <div class="page-heading">
      <p>WEATHER HANDS-ON ARCHIVE</p>
      <h1>지역별 날씨 대시보드</h1>
      <span>기존 실습 결과를 단계별로 확인할 수 있습니다.</span>
    </div>

    <!-- 변경: Hands-on 1~4를 하나의 날씨 대시보드에서 선택 -->
    <nav class="hands-on-navigation" aria-label="날씨 Hands-on 선택">
      <button
        v-for="handsOn in handsOnList"
        :key="handsOn.id"
        type="button"
        :class="{ active: selectedHandsOn === handsOn.id }"
        @click="selectedHandsOn = handsOn.id"
      >
        <small>HANDS-ON {{ handsOn.id }}</small>
        <strong>{{ handsOn.title }}</strong>
        <span>{{ handsOn.description }}</span>
      </button>
    </nav>

    <section class="hands-on-result" :aria-label="`Hands-on ${selectedHandsOn} 실행 결과`">
      <!-- Hands-on 1: v-for, v-if, 입력 바인딩, 이벤트 수식어 -->
      <WeatherMockup v-if="selectedHandsOn === 1" />

      <!-- Hands-on 2: ref, computed, watch, watchEffect -->
      <WeatherComposition v-else-if="selectedHandsOn === 2" />

      <!-- Hands-on 3: Props, Emits, Slot 기반 컴포넌트 분리 -->
      <WeatherParent v-else-if="selectedHandsOn === 3" />

      <!-- Hands-on 4: 기존 WeatherParent를 View로 전환하고 Vue Router 적용 -->
      <div v-else class="dashboard-wrapper">
        <BaseDashboardCard>
          <SearchBar
            :current-query="searchQuery"
            @update-query="(value) => (searchQuery = value)"
          />

          <WeatherStatusFilter
            :status-list="weatherStatuses"
            :selected-status="selectedStatus"
            @update-status="(status) => (selectedStatus = status)"
          />

          <div class="threshold-control">
            <label for="router-hot-threshold">더움 기준 온도</label>
            <input
              id="router-hot-threshold"
              v-model.number="hotThreshold"
              type="number"
              min="0"
              max="50"
            />
            <span class="unit-note">℃ 기준</span>
          </div>

          <p>
            더운 도시:
            <strong>{{ hotCities.map((city) => city.name).join(', ') || '없음' }}</strong>
          </p>
        </BaseDashboardCard>

        <BaseDashboardCard>
          <h3>지역별 날씨 현황</h3>

          <WeatherCard
            v-for="item in filteredWeatherList"
            :key="item.id"
            :city-item="item"
            :hot-threshold="hotThreshold"
            @select-card="(message) => (selectedCityInfo = message)"
            @click-detail="(city) => handleDetailJump(city.id)"
          />

          <p v-if="filteredWeatherList.length === 0" class="empty-message">
            😭 검색 결과와 일치하는 도시가 없습니다.
          </p>
        </BaseDashboardCard>

        <div class="status-bar">{{ selectedCityInfo }}</div>
      </div>
    </section>
  </section>
</template>

<style scoped>
/* [Hands-on 5] 카드 기온은 전역 단위를 따르되 더움 기준값은 항상 섭씨 */
.unit-note {
  color: #6c757d;
  font-size: 12px;
  white-space: nowrap;
}

.page-heading {
  margin-bottom: 24px;
}

.page-heading p {
  margin: 0 0 6px;
  color: #2e7d32;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.page-heading h1 {
  margin: 0;
}

.page-heading span {
  display: block;
  margin-top: 8px;
  color: #68716d;
}

.hands-on-navigation {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  max-width: 1040px;
  margin: 0 auto 30px;
}

.hands-on-navigation button {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: 4px;
  min-height: 112px;
  padding: 17px 18px;
  border: 1px solid #dce2df;
  border-radius: 14px;
  background: #ffffff;
  color: #34403a;
  font-family: inherit;
  text-align: left;
  cursor: pointer;
}

.hands-on-navigation button.active {
  border-color: #64763e;
  background: #edf1e5;
  box-shadow: 0 8px 22px rgb(76 89 66 / 9%);
}

.hands-on-navigation small {
  color: #66783d;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.1em;
}

.hands-on-navigation strong {
  font-size: 15px;
}

.hands-on-navigation span {
  color: #77817c;
  font-size: 12px;
}

.hands-on-result {
  padding: 28px 20px;
  border: 1px solid #e0e5e2;
  border-radius: 20px;
  background: #ffffff;
}

.dashboard-wrapper {
  width: min(100%, 600px);
  margin: 0 auto;
}

.threshold-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.threshold-control input {
  width: 80px;
}

.status-bar {
  padding: 10px;
  border-radius: 6px;
  background: #e8f5e9;
  color: #2e7d32;
  font-weight: bold;
  text-align: center;
}

.empty-message {
  color: #e74c3c;
  text-align: center;
}

@media (max-width: 840px) {
  .hands-on-navigation {
    grid-template-columns: repeat(2, 1fr);
    padding: 0 16px;
  }

  .hands-on-result {
    border-radius: 0;
  }
}
</style>
