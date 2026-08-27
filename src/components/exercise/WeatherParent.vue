<script setup>
import { ref, computed, watch, watchEffect } from 'vue'

import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCard.vue'
import WeatherStatusFilter from './WeatherStatusFilter.vue'

// [컴포넌트 과제 요구사항 1.] 모든 반응형 데이터의 소유권을 부모에서 유지
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  { id: 'city_04', name: '춘천', temp: 30, status: '안개' },
  { id: 'city_05', name: '판교', temp: 25, status: '흐림' },
  { id: 'city_06', name: '대전', temp: 27, status: '맑음' },
  { id: 'city_07', name: '광주', temp: 29, status: '비' },
  { id: 'city_08', name: '대구', temp: 31, status: '구름' },
  { id: 'city_09', name: '울산', temp: 32, status: '안개' },
  { id: 'city_10', name: '강릉', temp: 33, status: '흐림' },
])

const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')
const hotThreshold = ref(25)
// [컴포넌트 과제 요구사항 7.] 날씨 상태 필터의 선택값을 부모에서 관리
const selectedStatus = ref('전체')

// [컴포넌트 과제 요구사항 1.] 검색 및 사용자 기능의 파생 상태를 부모에서 계산
const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()

  return weatherList.value.filter((item) => {
    const matchesQuery = !query || item.name.includes(query)
    const matchesStatus = selectedStatus.value === '전체' || item.status === selectedStatus.value

    return matchesQuery && matchesStatus
  })
})

// [컴포넌트 과제 요구사항 7.] 원본 데이터에서 중복 없는 날씨 상태 목록 생성
const weatherStatuses = computed(() => {
  return ['전체', ...new Set(weatherList.value.map((item) => item.status))]
})

const hotCities = computed(() => {
  return filteredWeatherList.value.filter((city) => city.temp >= hotThreshold.value)
})

// [컴포넌트 과제 요구사항 1.] 기존 Watcher를 부모에서 유지
watch(selectedCityInfo, (newInfo) => {
  console.log(`[watch 감지] 상태 바 문구가 변경되었습니다 -> ${newInfo}`)
})

watchEffect(() => {
  console.log(
    `[watchEffect 감지] 현재 검색어 '${searchQuery.value}'에 매핑되는 API 데이터를 필터링합니다.`,
  )
})

watch(hotThreshold, (newTemp, oldTemp) => {
  console.log(`[사용자 기능] 더움 기준 온도 변경: ${oldTemp}°C -> ${newTemp}°C`)
})

// [컴포넌트 과제 요구사항 4.] 자식의 click-detail 이벤트 수신 후 상세 정보 출력
const showDetail = (cityName, status, temp) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}]이며, 기온은 ${temp}°C입니다.`)
}
</script>

<template>
  <div class="dashboard-wrapper">
    <BaseDashboardCard>
      <!-- [컴포넌트 과제 요구사항 2.] Slot으로 검색 UI 주입 -->
      <SearchBar :current-query="searchQuery" @update-query="(val) => (searchQuery = val)" />

      <!-- [컴포넌트 과제 요구사항 7.] 사용자 정의 상태 필터를 Slot 영역에 주입 -->
      <WeatherStatusFilter
        :status-list="weatherStatuses"
        :selected-status="selectedStatus"
        @update-status="(status) => (selectedStatus = status)"
      />

      <!-- 기존 사용자 기능 유지: 더움 기준 온도 설정 -->
      <div class="threshold-control">
        <label for="component-hot-threshold">더움 기준 온도</label>
        <input
          id="component-hot-threshold"
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

      <!-- [컴포넌트 과제 요구사항 2, 4, 6.] Slot 영역에서 자식과 직접 Props/Emits 통신 -->
      <WeatherCard
        v-for="item in filteredWeatherList"
        :key="item.id"
        :city-item="item"
        :hot-threshold="hotThreshold"
        @select-card="(msg) => (selectedCityInfo = msg)"
        @click-detail="(city) => showDetail(city.name, city.status, city.temp)"
      />

      <p v-if="filteredWeatherList.length === 0" class="empty-message">
        😭 검색 결과와 일치하는 도시가 없습니다.
      </p>
    </BaseDashboardCard>

    <div class="status-bar">
      {{ selectedCityInfo }}
    </div>
  </div>
</template>

<style scoped>
.dashboard-wrapper {
  width: 600px;
  margin: 0 auto;
}

/* [컴포넌트 과제 요구사항 5.] 부모 소유 UI 디자인 Scoped CSS 분리 */
.threshold-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.threshold-control input {
  width: 80px;
}

/* [Hands-on 5] 카드 기온은 전역 단위를 따르되 더움 기준값은 항상 섭씨 */
.unit-note {
  color: #6c757d;
  font-size: 12px;
  white-space: nowrap;
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
  padding: 10px 0;
  color: #e74c3c;
  text-align: center;
}
</style>
