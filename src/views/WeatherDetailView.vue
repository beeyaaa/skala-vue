<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useConfigStore } from '../stores/configStore.js'

// [라우팅 과제 요구사항 4.] 현재 URL 정보는 route로 읽고, 화면 이동은 router로 수행
const route = useRoute()
const router = useRouter()

// 서버 API 연동 전 단계에서 사용하는 지역별 상세 Mock Data
const mockDetails = {
  city_01: {
    name: '서울특별시',
    temp: 28,
    status: '맑음',
    humidity: '55%',
    wind: '2.5m/s',
  },
  city_02: {
    name: '경기도 수원시',
    temp: 24,
    status: '비',
    humidity: '85%',
    wind: '4.1m/s',
  },
  city_03: {
    name: '부산광역시',
    temp: 26,
    status: '구름',
    humidity: '65%',
    wind: '5.0m/s',
  },
  city_04: {
    name: '강원특별자치도 춘천시',
    temp: 30,
    status: '안개',
    humidity: '70%',
    wind: '1.8m/s',
  },
  city_05: {
    name: '경기도 성남시 판교',
    temp: 25,
    status: '흐림',
    humidity: '62%',
    wind: '3.2m/s',
  },
  // 변경: 메인 대시보드에 복원한 Hands-on 도시도 상세 Route에서 조회 가능하도록 추가
  city_06: { name: '대전광역시', temp: 27, status: '맑음', humidity: '58%', wind: '2.2m/s' },
  city_07: { name: '광주광역시', temp: 29, status: '비', humidity: '82%', wind: '3.7m/s' },
  city_08: { name: '대구광역시', temp: 31, status: '구름', humidity: '60%', wind: '2.9m/s' },
  city_09: { name: '울산광역시', temp: 32, status: '안개', humidity: '73%', wind: '4.3m/s' },
  city_10: {
    name: '강원특별자치도 강릉시',
    temp: 33,
    status: '흐림',
    humidity: '68%',
    wind: '5.1m/s',
  },
}

const cityData = ref(null)

// [Hands-on 5 요구사항 3.] 상세 화면도 Navigation Bar의 전역 단위 설정을 따름
const configStore = useConfigStore()
const displayTemp = computed(() =>
  cityData.value ? configStore.convertTemperature(cityData.value.temp) : null,
)

// [라우팅 과제 요구사항 4.] Mount 시점에 동적 세그먼트 :cityId로 상세 데이터 선택
onMounted(() => {
  const cityId = route.params.cityId
  cityData.value = mockDetails[cityId] ?? null
})

const goHome = () => {
  router.push({ name: 'WeatherHome' })
}
</script>

<template>
  <section class="detail-container">
    <p class="eyebrow">WEATHER DETAIL</p>
    <h1>지역별 상세 기상 관측 정보</h1>

    <div v-if="cityData" class="info-card">
      <h2>{{ cityData.name }}</h2>
      <dl>
        <div>
          <dt>기온</dt>
          <dd>{{ displayTemp }}{{ configStore.unitSymbol }}</dd>
        </div>
        <div>
          <dt>기상 현황</dt>
          <dd>{{ cityData.status }}</dd>
        </div>
        <div>
          <dt>습도</dt>
          <dd>{{ cityData.humidity }}</dd>
        </div>
        <div>
          <dt>풍속</dt>
          <dd>{{ cityData.wind }}</dd>
        </div>
      </dl>
    </div>

    <div v-else class="missing-data">해당 도시 ID에 해당하는 상세 데이터가 없습니다.</div>

    <button type="button" class="back-button" @click="goHome">← 메인 대시보드로 돌아가기</button>
  </section>
</template>

<style scoped>
.detail-container {
  max-width: 640px;
  margin: 0 auto;
}

.eyebrow {
  color: #2e7d32;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.info-card,
.missing-data {
  margin: 24px 0;
  padding: 24px;
  border: 1px solid #dfe5eb;
  border-radius: 10px;
  background: #ffffff;
}

.info-card h2 {
  margin-top: 0;
}

.info-card dl {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin: 0;
}

.info-card dl div {
  padding: 14px;
  border-radius: 6px;
  background: #f4f6f8;
}

.info-card dt {
  color: #6c757d;
  font-size: 13px;
}

.info-card dd {
  margin: 5px 0 0;
  font-size: 18px;
  font-weight: 700;
}

.back-button {
  padding: 9px 14px;
  border: 0;
  border-radius: 6px;
  background: #2c3e50;
  color: #ffffff;
  cursor: pointer;
}
</style>
