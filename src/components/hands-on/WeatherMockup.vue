<script setup>
import { ref } from 'vue'

// [과제 요구사항 1.] 날씨 데이터 배열 반응형 상태 정의
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  // [과제 요구사항 5.] 추가 도시 데이터: 춘천, 판교
  { id: 'city_04', name: '춘천', temp: 30, status: '안개' },
  { id: 'city_05', name: '판교', temp: 25, status: '흐림' },
])

// [과제 요구사항 3.] 한글 도시 검색어 반응형 상태
const searchQuery = ref('')
// [과제 요구사항 4.] 선택 도시 상태바 문구 반응형 상태
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

// [과제 요구사항 4.] 상세보기 클릭: 도시 날씨 alert 출력
// [과제 요구사항 5.] 상세 정보 확장: 기온 정보 추가
const showDetail = (cityName, status, temp) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}]이며, 기온은 ${temp}°C입니다.`)
}
</script>

<template>
  <div class="dashboard-wrapper">
    <section class="search-box">
      <h3>도시 검색</h3>
      <!-- input type="text" v-model="searchQuery" placeholder="검색할 도시 이름 입력" / -->
      <!-- [과제 요구사항 3.] :value + @input 기반 한글 입력값 반영 -->
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

      <!-- [과제 요구사항 1.] v-for 반복 렌더링 + id 기반 :key 바인딩 -->
      <div
        v-for="item in weatherList"
        :key="item.id"
        class="weather-card"
        @click="selectedCityInfo = `${item.name}이 선택되었습니다.`"
      >
        <!-- [과제 요구사항 5.] 도시명 + 상세보기 + 온도 라벨 한 행 구성 -->
        <div class="weather-row">
          <span>{{ item.name }}</span>
          <!-- [과제 요구사항 4.] .stop을 통한 부모 카드 클릭 이벤트 버블링 차단 -->
          <button class="btn-detail" @click.stop="showDetail(item.name, item.status, item.temp)">
            상세보기
          </button>

          <!-- [과제 요구사항 2.] 기온별 더움/선선함 라벨 조건부 렌더링 -->
          <span v-if="item.temp >= 25">🔥 더움</span>
          <span v-else>❄️ 선선함</span>
        </div>
      </div>
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
</style>
