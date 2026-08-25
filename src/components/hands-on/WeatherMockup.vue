<script setup>
import { ref } from 'vue'

const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  { id: 'city_04', name: '춘천', temp: 30, status: '안개' },
  { id: 'city_05', name: '판교', temp: 25, status: '흐림' },
])

const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 입니다.`)
}

// 기온 상세보기 팝업에서도 온도 구분을 함께 안내합니다.
const showTemperatureDetail = (cityName, temp) => {
  const temperatureLabel = temp >= 25 ? '더워요' : '시원해요'
  window.alert(`${cityName}의 현재 기온은 ${temp}°C이며, [${temperatureLabel}] 상태입니다.`)
}
</script>

<template>
  <div class="dashboard-wrapper">
    <section class="search-box">
      <h3>도시 검색</h3>
      <!-- input type="text" v-model="searchQuery" placeholder="검색할 도시 이름 입력" / -->
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

      <div
        v-for="item in weatherList"
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
</style>
