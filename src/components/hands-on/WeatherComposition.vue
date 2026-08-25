<script setup>
import { ref, computed, watch, watchEffect } from 'vue'

// [과제 요구사항 1.] 지역별 날씨 데이터 배열 반응형 상태 정의
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  { id: 'city_04', name: '춘천', temp: 30, status: '안개' },
  { id: 'city_05', name: '판교', temp: 25, status: '흐림' },
])

// [과제 요구사항 1.] 검색어 + 선택 도시 안내 문구 반응형 상태 정의
const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

// [과제 요구사항 5.] 사용자 지정 더움 기준 온도 반응형 상태
const hotThreshold = ref(25)

// [과제 요구사항 2.] 검색어 포함 도시 필터링 computed 배열 정의
const filteredWeatherList = computed(() => {
  // 사용자가 입력한 검색어의 앞뒤 공백을 제거합니다.
  const query = searchQuery.value.trim()

  // 검색어가 비어있다면 원본 weatherList를 그대로 보여줍니다.
  if (!query) {
    return weatherList.value
  }

  return weatherList.value.filter((item) => item.name.includes(query))
})

// [과제 요구사항 5.] 현재 검색 결과 중 기준 온도 이상인 도시 계산
const hotCities = computed(() => {
  return filteredWeatherList.value.filter((city) => city.temp >= hotThreshold.value)
})

// [과제 요구사항 3.] watch: 선택 도시 안내 문구 변경 감시
watch(selectedCityInfo, (newInfo) => {
  console.log(`[watch 감지] 상태 바 문구가 변경되었습니다 -> ${newInfo}`)
})

// [과제 요구사항 3.] watchEffect: 검색어 자동 추적 + 변경 로그 기록
watchEffect(() => {
  console.log(
    `[watchEffect 감지] 현재 검색어 '${searchQuery.value}'에 매핑되는 API 데이터를 필터링합니다.`,
  )
})

// [과제 요구사항 5.] 더움 기준 온도 변경 감시 + 변경 로그 기록
watch(hotThreshold, (newTemp, oldTemp) => {
  console.log(`[사용자 기능] 더움 기준 온도 변경: ${oldTemp}°C -> ${newTemp}°C`)
})

// 상세보기 팝업: 날씨 + 기온 정보 출력
const showDetail = (cityName, status, temp) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}]이며, 기온은 ${temp}°C입니다.`)
}

// JavaScript 영역과 template 영역 분리
</script>

<template>
  <div class="dashboard-wrapper">
    <section class="search-box">
      <h3>도시 검색</h3>
      <!-- [과제 요구사항 1.] 입력값과 searchQuery 반응형 상태 연결 -->
      <input
        type="text"
        :value="searchQuery"
        @input="(e) => (searchQuery = e.target.value)"
        placeholder="검색할 도시 이름 입력"
      />
      <p>
        검색 중인 도시 : <strong>{{ searchQuery }}</strong>
      </p>

      <!-- [과제 요구사항 5.] 사용자가 더움 기준 온도를 직접 설정하는 입력 요소 -->
      <div class="threshold-control">
        <label for="hot-threshold">더움 기준 온도</label>
        <input id="hot-threshold" v-model.number="hotThreshold" type="number" min="0" max="50" />
        <span>°C</span>
      </div>

      <!-- [과제 요구사항 5.] computed로 계산한 기준 온도 이상 도시 출력 -->
      <p>
        더운 도시:
        <strong>{{ hotCities.map((city) => city.name).join(', ') || '없음' }}</strong>
      </p>
    </section>

    <section class="list-box">
      <h3>지역별 날씨</h3>

      <!-- [과제 요구사항 4.] 빈 검색어: 원본 출력 / 검색어 입력: computed 결과 출력 -->
      <div
        v-for="item in filteredWeatherList"
        :key="item.id"
        class="weather-card"
        @click="selectedCityInfo = `${item.name}이 선택되었습니다.`"
      >
        <!-- 도시명 + 상세보기 + 온도 라벨 한 행 구성 -->
        <div class="weather-row">
          <span>{{ item.name }}</span>
          <button class="btn-detail" @click.stop="showDetail(item.name, item.status, item.temp)">
            상세보기
          </button>

          <!-- 과제 조건에 맞게 기온별 라벨을 카드에 조건부 렌더링 -->
          <span v-if="item.temp >= hotThreshold">🔥 더움</span>
          <span v-else>❄️ 선선함</span>
        </div>
      </div>

      <!-- [과제 요구사항 4.] 검색 결과 없음 안내 문구 조건부 렌더링 -->
      <p v-if="filteredWeatherList.length === 0" class="empty-message">
        검색 결과와 일치하는 도시가 없습니다.
      </p>
    </section>

    <div class="status-bar">
      {{ selectedCityInfo }}
    </div>
  </div>
</template>

<style scoped>
/* 날씨 카드 내부 항목 한 행 배치 */
.weather-row {
  display: flex;
  align-items: center;
  justify-content: flex-start; /* 왼쪽부터 차례대로 배치 */
  gap: 8px; /* 항목 사이 간격 */
  margin: 8px 0;
}

/* 외부 CSS absolute 설정 충돌 방지: 버튼 위치 초기화 */
.btn-detail {
  position: static;
}

/* [과제 요구사항 5.] 기준 온도 입력 요소 한 행 배치 */
.threshold-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.threshold-control input {
  width: 80px;
}

/* 검색 결과 없음 안내 문구 */
.empty-message {
  margin: 16px 0 0;
  text-align: center;
  color: #e74c3c;
}
</style>
