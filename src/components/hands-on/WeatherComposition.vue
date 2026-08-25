<script setup>
import { ref, computed, watch, watchEffect } from 'vue'

// 1. 반응형 상태 관리: 검색어(searchQuery), 선택된 도시(selectedCityInfo), 그리고 지역별 날씨
// 데이터 배열(weatherList)을 반응형 상태로 정의. (1일차 동일)
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  { id: 'city_04', name: '춘천', temp: 30, status: '안개' },
  { id: 'city_05', name: '판교', temp: 25, status: '흐림' },
])

// 2. [1일차 데이터] 검색어 및 알림창 제어용 데이터
const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

// 3. 검색 도시 (computed 활용): 전체 날씨 리스트 중에서 사용자가 입력한 검색어가 도시 이름
// 에 포함된 항목만 필터링하여 Computed 배열에 담아 놓는다. (filteredWeatherList)
const filteredWeatherList = computed(() => {
  // 사용자가 입력한 검색어의 앞뒤 공백을 제거합니다.
  const query = searchQuery.value.trim()

  // 검색어가 비어있다면 원본 weatherList를 그대로 보여줍니다.
  if (!query) {
    return weatherList.value
  }

  return weatherList.value.filter((item) => item.name.includes(query))
})

// 3. 반응형 변수 변화 감시 (watch, watchEffect):
// - selectedCityInfo 감시 (watch 이용): 상태바 문구가 바뀔때 마다 콘솔로그를 작성
// - searchQuery 감시 (watchEffect 이용): 도시 검색어를 타이핑할 때 마다 변하는 searchQuery를 추적하여 콘솔로그로 작성
watch(selectedCityInfo, (newInfo) => {
  console.log(`[watch 감지] 상태 바 문구가 변경되었습니다 -> ${newInfo}`)
})

watchEffect(() => {
  console.log(
    `[watchEffect 감지] 현재 검색어 '${searchQuery.value}'에 매핑되는 API 데이터를 필터링합니다.`,
  )
})

// 알림 대행 함수
const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}

// 변경: 기온 상세 버튼에서 기온과 온도 구분을 안내하는 함수를 추가합니다.
const showTemperatureDetail = (cityName, temp) => {
  const temperatureLabel = temp >= 25 ? '더워요' : '시원해요'
  window.alert(`${cityName}의 현재 기온은 ${temp}°C이며, [${temperatureLabel}] 상태입니다.`)
}

// 변경: JavaScript 영역을 닫아 아래 template과 명확하게 분리합니다.
</script>

<template>
  <div class="dashboard-wrapper">
    <section class="search-box">
      <h3>도시 검색</h3>
      <input
        type="text"
        :value="searchQuery"
        @input="(e) => (searchQuery = e.target.value)"
        placeholder="검색할 도시 이름 입력"
      />
      <p>
        검색 중인 도시 : <strong>{{ searchQuery }}</strong>
      </p>
    </section>

    <section class="list-box">
      <h3>지역별 날씨</h3>

      <!-- 변경: computed가 계산한 검색 결과를 화면에 반복 출력합니다. -->
      <div
        v-for="item in filteredWeatherList"
        :key="item.id"
        class="weather-card"
        @click="selectedCityInfo = `${item.name}이 선택되었습니다.`"
      >
        <!-- 변경: 날씨와 기온 상세보기 항목을 하나의 행에 함께 배치합니다. -->
        <div class="weather-row">
          <div class="detail-item">
            <span>{{ item.name }}</span>
            <button class="btn-detail" @click.stop="showDetail(item.name, item.status)">
              날씨 상세
            </button>
          </div>

          <div class="detail-item">
            <button class="btn-detail" @click.stop="showTemperatureDetail(item.name, item.temp)">
              기온 상세
            </button>

            <!-- 변경: 과제 조건에 맞게 기온별 라벨을 카드에 조건부 렌더링합니다. -->
            <span v-if="item.temp >= 25">🔥 더움 (25도 이상)</span>
            <span v-else>❄️ 선선함 (25도 미만)</span>
          </div>
        </div>
      </div>

      <!-- 변경: 검색 결과 배열이 비었을 때 안내 문구를 조건부 렌더링합니다. -->
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
/* 변경: 날씨와 기온 항목 전체를 한 행에 배치합니다. */
.weather-row {
  display: flex;
  align-items: center;
  justify-content: flex-start; /* 왼쪽부터 차례대로 배치 */
  gap: 8px; /* 항목 사이 간격 */
  margin: 8px 0;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 외부 예시 CSS의 absolute 설정과 충돌하지 않도록 버튼 위치를 초기화합니다. */
.btn-detail {
  position: static;
}

/* 변경: 검색 결과가 없을 때 표시하는 안내 문구를 정돈합니다. */
.empty-message {
  margin: 16px 0 0;
  text-align: center;
  color: #e74c3c;
}
</style>
