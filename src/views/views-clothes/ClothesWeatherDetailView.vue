<script setup>
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import {
  PhCloud,
  PhCloudRain,
  PhCloudSun,
  PhCoatHanger,
  PhMaskHappy,
  PhShieldWarning,
  PhSun,
  PhUmbrella,
} from '@phosphor-icons/vue'

import { useConfigStore } from '../../stores/configStore.js'
import { useWeatherStore } from '../../stores/weatherStore.js'
import { createAirQualitySummary } from '../../utils/airQuality.js'
import { createOutfitRecommendation } from './clothesWeatherData.js'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()
const weatherStore = useWeatherStore()

// Store 값을 직접 참조 → 실시간 날씨 도착 시 이 화면도 함께 갱신
const cityData = computed(() => weatherStore.findCityById(route.params.cityId))

const iconByWeather = {
  sunny: PhSun,
  partlyCloudy: PhCloudSun,
  rainy: PhCloudRain,
  cloudy: PhCloud,
}

// [동적 경로 매칭] Mount 시점에 :cityId와 일치하는 도시 객체 선택
onMounted(async () => {
  if (!cityData.value) return

  weatherStore.selectCity(cityData.value.id)

  // 상세 URL 직접 진입 시에도 실시간 값을 쓰도록 현재 날씨를 먼저 확인.
  // 최근 수신 값이 있으면 Store가 재요청 없이 즉시 반환
  await weatherStore.fetchLiveWeather()

  // [Hands-on 6 요구사항 2.] 해당 도시의 시간대별 예보만 추가 조회
  weatherStore.fetchForecast(cityData.value.id)

  // [Hands-on 6 확장] 대기질·기상특보는 서로 독립적으로 동시 조회
  weatherStore.fetchSafetyData(cityData.value.id)
})

const {
  forecastByCity,
  isForecastLoading,
  forecastError,
  airQualityByCity,
  isAirQualityLoading,
  airQualityError,
  warningsByCity,
  isWarningsLoading,
  warningsError,
} = storeToRefs(weatherStore)

// 현재 도시의 PM2.5·PM10 중 더 나쁜 국내 등급을 대기질 상태로 채택
const airQuality = computed(() => {
  if (!cityData.value) return null
  return createAirQualitySummary(airQualityByCity.value[cityData.value.id])
})

// [Hands-on 7] 대기질 등급에 맞는 Element Plus Tag 색상 선택
const airQualityTagType = computed(() => {
  const tagTypes = {
    good: 'success',
    normal: 'info',
    bad: 'warning',
    'very-bad': 'danger',
  }

  return tagTypes[airQuality.value?.key] ?? 'info'
})

// 특보 단계 — 경보를 가장 강하게, 주의보를 그다음 단계로 표시
const warningTagType = (level) => (level === '경보' ? 'danger' : 'warning')

// 선택 도시와 관련된 폭염·한파·호우·대설·태풍·강풍 특보
const activeWarnings = computed(() => {
  if (!cityData.value) return []
  return warningsByCity.value[cityData.value.id] ?? []
})

const warningsLoaded = computed(() => {
  if (!cityData.value) return false
  return Object.prototype.hasOwnProperty.call(warningsByCity.value, cityData.value.id)
})

// 현재 도시의 예보 슬롯 — Key 부재·실패 시 빈 배열이라 섹션 자체가 숨겨짐
const forecastSlots = computed(() => {
  return cityData.value ? (forecastByCity.value[cityData.value.id] ?? []) : []
})

// 흐름 그래프는 가독성을 위해 향후 24시간(3시간 단위 8개)만 표시
const forecastStripSlots = computed(() => forecastSlots.value.slice(0, 8))

// 막대 높이 산출을 위해 예보 구간의 최저·최고 기온 계산
const forecastRange = computed(() => {
  if (forecastStripSlots.value.length === 0) return null

  const temps = forecastStripSlots.value.map((slot) => slot.temp)
  const min = Math.min(...temps)
  const max = Math.max(...temps)

  return { min, max, gap: max - min }
})

// 막대 높이(%) — 최저·최고가 같을 때 0으로 나누지 않도록 방어
const barHeight = (temp) => {
  const range = forecastRange.value
  if (!range) return 0

  const spread = range.max - range.min || 1
  return 30 + ((temp - range.min) / spread) * 70
}

// [Hands-on 6 심화] 3시간 단위 예보에서 아침 8시·낮 13시·저녁 19시에
// 가장 가까운 슬롯을 선택. 세 시간대가 모두 있는 첫 날짜를 사용하므로
// 서로 다른 날짜의 예보가 한 플랜에 혼재하지 않음
// 예보는 3시간 간격이라 08·13·19시에 정확히 오지 않음.
// targetHour를 목표로 두고 min~max 범위 안에서 가장 가까운 슬롯을 선택
const dayParts = [
  { key: 'morning', label: '아침', targetHour: 8, minHour: 5, maxHour: 10 },
  { key: 'daytime', label: '낮', targetHour: 13, minHour: 11, maxHour: 16 },
  { key: 'evening', label: '저녁', targetHour: 19, minHour: 17, maxHour: 21 },
]

// 시간대 카드에 들어갈 한 줄 조언.
// 구간 기준은 createOutfitRecommendation의 8단계와 동일하되,
// 카드 폭에 맞게 짧은 표현을 사용
const createTimeAdvice = (slot) => {
  let advice

  if (slot.temp >= 28) advice = '가볍고 시원한 옷'
  else if (slot.temp >= 23) advice = '겉옷 없이 가볍게'
  else if (slot.temp >= 20) advice = '얇은 긴팔 또는 가디건'
  else if (slot.temp >= 17) advice = '가벼운 겉옷 필요'
  else if (slot.temp >= 12) advice = '재킷 필요'
  else if (slot.temp >= 9) advice = '니트와 트렌치코트'
  else if (slot.temp >= 5) advice = '코트와 보온 이너'
  else advice = '패딩과 방한용품'

  return slot.rainChance >= 50 ? `${advice} · 우산 준비` : advice
}

// 하루 종합 조언은 최고 기온만으로 정할 수 없음.
// 같은 최고 28도라도 최저가 19도면 겉옷이 필요하고 24도면 불필요.
// 따라서 최고 기온으로 큰 구간을 먼저 나눈 뒤 최저 기온으로 겉옷 여부를 판단
const createLayeringAdvice = (minTemp, maxTemp) => {
  if (maxTemp >= 28) {
    return minTemp <= 19
      ? '반팔 위에 벗기 쉬운 얇은 재킷을 추천해요.'
      : '통풍이 잘되는 반팔과 가벼운 하의를 추천해요.'
  }
  if (maxTemp >= 23) {
    return minTemp <= 16
      ? '반팔이나 얇은 긴팔 위에 가디건 또는 재킷을 걸쳐 주세요.'
      : '반팔 위에 얇은 셔츠를 더하면 기온 변화에 대응하기 좋아요.'
  }
  if (maxTemp >= 20) {
    return minTemp <= 12
      ? '긴팔 위에 재킷을 입고, 따뜻해지면 겉옷을 벗어 주세요.'
      : '얇은 긴팔과 가디건처럼 조절하기 쉬운 조합을 추천해요.'
  }
  if (maxTemp >= 17) return '얇은 니트와 가벼운 재킷을 함께 준비해 주세요.'
  if (maxTemp >= 12) return '니트나 맨투맨 위에 바람을 막아줄 재킷을 추천해요.'
  if (maxTemp >= 9) return '도톰한 니트와 트렌치코트 또는 야상을 추천해요.'
  if (maxTemp >= 5) return '보온 이너와 코트를 함께 입어 주세요.'
  return '패딩과 목도리 등 방한용품을 충분히 챙겨 주세요.'
}

// 요약 문장에 넣을 체감 표현.
// 옷차림 8단계와 달리 5~11도를 '추워요'로 합쳐 7단계로 사용 —
// 문장에서는 그 구간의 체감 차이가 크지 않기 때문
const describeTemperature = (temp) => {
  if (temp >= 28) return '매우 더워요'
  if (temp >= 23) return '따뜻해요'
  if (temp >= 20) return '온화해요'
  if (temp >= 17) return '선선해요'
  if (temp >= 12) return '쌀쌀해요'
  if (temp >= 5) return '추워요'
  return '매우 추워요'
}

const dailyOutfitPlan = computed(() => {
  if (forecastSlots.value.length === 0) return null

  const dateKeys = [...new Set(forecastSlots.value.map((slot) => slot.dateKey))]

  for (const dateKey of dateKeys) {
    const sameDaySlots = forecastSlots.value.filter((slot) => slot.dateKey === dateKey)
    const selectedSlots = dayParts.map((part) => {
      const candidates = sameDaySlots.filter(
        (slot) => slot.hour >= part.minHour && slot.hour <= part.maxHour,
      )
      const closest = candidates.sort(
        (a, b) => Math.abs(a.hour - part.targetHour) - Math.abs(b.hour - part.targetHour),
      )[0]

      return closest
        ? { ...closest, key: part.key, periodLabel: part.label, advice: createTimeAdvice(closest) }
        : null
    })

    if (selectedSlots.some((slot) => !slot)) continue

    const temps = selectedSlots.map((slot) => slot.temp)
    const minTemp = Math.min(...temps)
    const maxTemp = Math.max(...temps)
    const maxRainChance = Math.max(...selectedSlots.map((slot) => slot.rainChance))
    const [morning, daytime, evening] = selectedSlots
    const hasWarmDayCoolEdges = daytime.temp - Math.min(morning.temp, evening.temp) >= 5

    let summary
    if (hasWarmDayCoolEdges) {
      summary = `낮에는 ${describeTemperature(daytime.temp)} 하지만 아침과 저녁에는 기온이 내려가요.`
    } else if (maxTemp - minTemp >= 7) {
      summary = `하루 기온 차이가 ${maxTemp - minTemp}°C로 커서 체온을 조절하기 쉬운 옷이 필요해요.`
    } else {
      summary = `하루 동안 기온 변화가 크지 않고 대체로 ${describeTemperature(Math.round((minTemp + maxTemp) / 2))}`
    }

    return {
      dateLabel: selectedSlots[0].dateLabel,
      slots: selectedSlots,
      minTemp,
      maxTemp,
      maxRainChance,
      summary,
      outfitAdvice: createLayeringAdvice(minTemp, maxTemp),
    }
  }

  return null
})

// 종합 추천·추가 준비물도 선택된 하루의 아침·낮·저녁만 기준으로 판단
const needsOuterwear = computed(() => {
  if (!dailyOutfitPlan.value) return false
  return dailyOutfitPlan.value.maxTemp - dailyOutfitPlan.value.minTemp >= 8
})

const rainSlot = computed(() => {
  const rainySlots = dailyOutfitPlan.value?.slots.filter((slot) => slot.rainChance >= 50) ?? []
  return rainySlots.sort((a, b) => b.rainChance - a.rainChance)[0] ?? null
})

// 현재 날씨 기준 기본 준비물에 예보에서 도출한 항목을 추가 → 안내 문구와 일치 유지
const displayItems = computed(() => {
  const items = [...(recommendation.value?.items ?? [])]

  if (rainSlot.value && !items.includes('우산')) items.push('우산')
  if (needsOuterwear.value && !items.includes('얇은 겉옷')) items.push('얇은 겉옷')
  if (airQuality.value?.needsMask && !items.includes('보건용 마스크')) {
    items.push('보건용 마스크')
  }

  activeWarnings.value.forEach((warning) => {
    warning.items.forEach((item) => {
      if (!items.includes(item)) items.push(item)
    })
  })

  return items
})

const recommendation = computed(() => {
  return createOutfitRecommendation(cityData.value)
})

const weatherIcon = computed(() => iconByWeather[cityData.value?.weatherType] ?? PhCloud)

// [Hands-on 5 요구사항 3.] 상세 View도 전역 온도 단위 설정 적용
const displayTemp = computed(() => {
  return cityData.value ? configStore.convertTemperature(cityData.value.temp) : null
})

const goToMap = () => {
  router.push('/clothes')
}
</script>

<template>
  <section class="clothes-detail-view">
    <template v-if="cityData && recommendation">
      <header class="detail-heading">
        <p>DETAILED WEATHER</p>
        <h1>{{ cityData.fullName }}</h1>
        <span class="detail-condition">
          <component :is="weatherIcon" :size="24" weight="light" aria-hidden="true" />
          {{ cityData.status }}
        </span>
      </header>

      <!-- 기상청 특보 존재 시 일반 추천보다 안전 모드를 우선 강조 -->
      <article v-if="activeWarnings.length > 0" class="safety-mode">
        <div class="safety-title">
          <PhShieldWarning :size="30" weight="duotone" aria-hidden="true" />
          <div>
            <p>WEATHER SAFETY MODE</p>
            <h2>{{ activeWarnings.map((warning) => warning.label).join(' · ') }} 특보 발효 중</h2>
          </div>
        </div>

        <ul class="warning-list">
          <li v-for="warning in activeWarnings" :key="warning.key">
            <div class="warning-tags">
              <el-tag effect="dark" :type="warningTagType(warning.level)">
                {{ warning.label }} {{ warning.level }}
              </el-tag>
            </div>
            <span>{{ warning.advice }}</span>
          </li>
        </ul>
        <small>기상청 API 허브 특보현황 기준</small>
      </article>

      <article v-else class="warning-status">
        <PhShieldWarning :size="20" weight="light" aria-hidden="true" />
        <!-- [Hands-on 7] API 응답 대기 상태를 Skeleton으로 표현 -->
        <el-skeleton v-if="isWarningsLoading" animated :rows="1" />
        <el-alert
          v-else-if="warningsError"
          :title="warningsError"
          type="error"
          :closable="false"
          show-icon
        />
        <span v-else-if="warningsLoaded">현재 이 지역에 발효 중인 주요 기상특보가 없습니다.</span>
      </article>

      <div class="weather-metrics">
        <article>
          <span>현재 기온</span>
          <strong>{{ displayTemp }}{{ configStore.unitSymbol }}</strong>
        </article>
        <article>
          <span>습도</span>
          <strong>{{ cityData.humidity }}%</strong>
        </article>
        <article>
          <span>풍속</span>
          <strong>{{ cityData.wind }}m/s</strong>
        </article>
      </div>

      <!-- OpenWeather 대기오염 API의 PM2.5·PM10을 국내 농도 기준으로 재분류 -->
      <article v-if="isAirQualityLoading" class="air-quality-card loading">
        <!-- [Hands-on 7] 기존 카드 내부에만 Skeleton 삽입 → 레이아웃 유지 -->
        <el-skeleton animated :rows="2" />
      </article>

      <article v-else-if="airQuality" class="air-quality-card" :class="airQuality.key">
        <div class="air-quality-heading">
          <div>
            <p>AIR QUALITY</p>
            <h2>
              오늘의 대기질
              <el-tag :type="airQualityTagType" effect="dark">{{ airQuality.label }}</el-tag>
            </h2>
          </div>
          <PhMaskHappy :size="31" weight="duotone" aria-hidden="true" />
        </div>

        <div class="dust-values">
          <span
            >초미세먼지 PM2.5 <strong>{{ airQuality.pm25 }}</strong
            >㎍/㎥</span
          >
          <span
            >미세먼지 PM10 <strong>{{ airQuality.pm10 }}</strong
            >㎍/㎥</span
          >
        </div>
        <p class="air-advice">{{ airQuality.advice }}</p>
        <small>OpenWeather Air Pollution API · 국내 농도 구간 적용</small>
      </article>

      <el-alert
        v-else-if="airQualityError"
        class="data-alert"
        :title="airQualityError"
        type="error"
        :closable="false"
        show-icon
      />

      <!-- [Hands-on 6 요구사항 2.] OpenWeatherMap 예보 API로 오늘의 기온 흐름 표시 -->
      <article v-if="isForecastLoading" class="forecast-card">
        <p>TODAY'S FLOW</p>
        <el-skeleton animated :rows="3" />
      </article>

      <article v-else-if="forecastSlots.length > 0" class="forecast-card">
        <p>TODAY'S FLOW</p>
        <div class="forecast-title-row">
          <h2>하루 옷차림 플랜</h2>
          <span v-if="dailyOutfitPlan">{{ dailyOutfitPlan.dateLabel }} 예보</span>
        </div>

        <!-- 아침·낮·저녁 대표 예보와 각 시점에 필요한 옷차림을 함께 표시 -->
        <template v-if="dailyOutfitPlan">
          <ol class="day-plan">
            <li v-for="slot in dailyOutfitPlan.slots" :key="slot.key">
              <div class="plan-time">
                <strong>{{ slot.periodLabel }} {{ slot.timeLabel }}</strong>
                <span>{{ slot.status }}</span>
              </div>
              <strong class="plan-temp">
                {{ configStore.convertTemperature(slot.temp) }}{{ configStore.unitSymbol }}
              </strong>
              <p>{{ slot.advice }}</p>
            </li>
          </ol>

          <div class="daily-summary">
            <span>하루 종합 추천</span>
            <strong>{{ dailyOutfitPlan.summary }}</strong>
            <p>
              {{ dailyOutfitPlan.outfitAdvice }}
              <template v-if="dailyOutfitPlan.maxRainChance >= 50">
                최고 강수확률이 {{ dailyOutfitPlan.maxRainChance }}%이므로 우산도 준비하세요.
              </template>
            </p>
          </div>
        </template>

        <!-- 일교차가 크면 겉옷, 비 예보가 있으면 우산을 우선 안내 -->
        <div v-if="needsOuterwear" class="forecast-alert">
          <PhCoatHanger :size="22" weight="light" aria-hidden="true" />
          <span> 일교차가 {{ forecastRange.gap }}도예요. 겉옷 챙기세요. </span>
        </div>

        <div v-if="rainSlot" class="forecast-alert rain">
          <PhUmbrella :size="22" weight="light" aria-hidden="true" />
          <span>
            {{ rainSlot.partLabel }} {{ rainSlot.timeLabel }}에 비 올 확률
            {{ rainSlot.rainChance }}%. 우산 챙기세요.
          </span>
        </div>

        <ul class="forecast-strip">
          <li v-for="slot in forecastStripSlots" :key="`${slot.dateKey}-${slot.timeLabel}`">
            <span class="slot-temp">
              {{ configStore.convertTemperature(slot.temp) }}{{ configStore.unitSymbol }}
            </span>
            <span class="slot-bar" :style="{ height: barHeight(slot.temp) + '%' }" />
            <span class="slot-time">{{ slot.timeLabel }}</span>
            <span class="slot-part">{{ slot.partLabel }}</span>
          </li>
        </ul>
      </article>

      <el-alert
        v-else-if="forecastError"
        class="data-alert"
        :title="forecastError"
        type="error"
        :closable="false"
        show-icon
      />

      <article class="outfit-card">
        <p>오늘의 옷차림</p>
        <h2>{{ recommendation.title }}</h2>

        <div class="recommendation-grid">
          <div>
            <span>추천 옷차림</span>
            <ul>
              <li v-for="item in recommendation.clothes" :key="item">{{ item }}</li>
            </ul>
          </div>
          <div>
            <span>챙기면 좋아요</span>
            <ul>
              <li v-for="item in displayItems" :key="item">{{ item }}</li>
            </ul>
          </div>
        </div>
      </article>
    </template>

    <div v-else class="missing-city">
      <h1>지역 정보를 찾을 수 없습니다.</h1>
      <p>지도에서 다른 지역을 선택해 주세요.</p>
    </div>

    <button type="button" class="map-button" @click="goToMap">← 날씨 지도로 돌아가기</button>
  </section>
</template>

<style scoped>
/* 기상특보가 있을 때 가장 먼저 노출되는 안전 모드 */
.safety-mode {
  margin-top: 24px;
  padding: 22px;
  border: 1px solid #e1a79b;
  border-radius: 18px;
  background: #fff0ec;
  color: #612c23;
}

.safety-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.safety-title p,
.air-quality-heading p {
  margin: 0;
  font-size: 10px;
  font-weight: 850;
  letter-spacing: 0.14em;
}

.safety-title h2 {
  margin: 4px 0 0;
  font-size: 20px;
}

.warning-list {
  display: grid;
  gap: 8px;
  margin: 16px 0 12px;
  padding: 0;
  list-style: none;
}

.warning-list li {
  display: grid;
  grid-template-columns: 88px 1fr;
  gap: 10px;
  padding-top: 10px;
  border-top: 1px solid rgb(97 44 35 / 15%);
  font-size: 13px;
  line-height: 1.55;
}

.warning-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.safety-mode small,
.air-quality-card small {
  color: inherit;
  font-size: 10px;
  opacity: 0.65;
}

.warning-status {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 22px;
  padding: 11px 13px;
  border-radius: 12px;
  background: #eef2e8;
  color: #526143;
  font-size: 12px;
}

.warning-status .el-skeleton,
.warning-status .el-alert {
  flex: 1;
}

.data-alert {
  margin: 18px 0;
}

/* PM 농도에 따라 카드 강조색만 변경 → 정보 구조는 일관 유지 */
.air-quality-card {
  margin-bottom: 18px;
  padding: 20px 22px;
  border: 1px solid #d9e2dc;
  border-radius: 16px;
  background: #f5faf6;
  color: #33463b;
}

.air-quality-card.loading {
  color: #78848a;
  font-size: 13px;
}

.air-quality-card.normal {
  border-color: #d8dfc2;
  background: #f6f8ed;
  color: #535e35;
}

.air-quality-card.bad {
  border-color: #ead6a9;
  background: #fff8e8;
  color: #6d531f;
}

.air-quality-card.very-bad {
  border-color: #e2b0a6;
  background: #fff0ec;
  color: #71382e;
}

.air-quality-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.air-quality-heading h2 {
  margin: 5px 0 0;
  font-size: 19px;
}

.air-quality-heading h2 strong {
  color: inherit;
}

.dust-values {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 15px 0 10px;
}

.dust-values span {
  padding: 7px 10px;
  border-radius: 999px;
  background: rgb(255 255 255 / 75%);
  font-size: 12px;
}

.air-advice {
  margin: 0 0 8px;
  font-size: 13px;
  line-height: 1.55;
}

/* [Hands-on 6] 시간대별 예보 띠 */
.forecast-card {
  margin: 18px 0;
  padding: 20px 22px 16px;
  border: 1px solid #e2e7e3;
  border-radius: 16px;
  background: #ffffff;
}

.forecast-card h2 {
  margin: 5px 0 0;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.forecast-title-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.forecast-title-row > span {
  color: #78848a;
  font-size: 12px;
  white-space: nowrap;
}

.day-plan {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin: 0 0 12px;
  padding: 0;
  list-style: none;
}

.day-plan li {
  padding: 15px;
  border: 1px solid #e3e7df;
  border-radius: 13px;
  background: #f8f9f5;
}

.plan-time {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.plan-time strong {
  font-size: 13px;
}

.plan-time span {
  color: #7b8589;
  font-size: 11px;
  text-align: right;
}

.plan-temp {
  display: block;
  margin: 12px 0 7px;
  font-size: 25px;
  letter-spacing: -0.04em;
}

.day-plan p {
  min-height: 38px;
  margin: 0;
  color: #566066;
  font-size: 12px;
  line-height: 1.55;
}

.daily-summary {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 12px;
  padding: 17px 18px;
  border-radius: 13px;
  background: #e9efcf;
}

.daily-summary span {
  color: #6d7e27;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.06em;
}

.daily-summary strong {
  font-size: 16px;
  line-height: 1.5;
}

.daily-summary p {
  margin: 0;
  color: #525d40;
  font-size: 13px;
  line-height: 1.6;
}

.forecast-alert {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 10px;
  padding: 10px 13px;
  border-radius: 11px;
  background: #eef2e3;
  color: #4d5c2b;
  font-size: 14px;
  font-weight: 700;
}

.forecast-alert.rain {
  background: #e6eef4;
  color: #2f5570;
}

.forecast-strip {
  display: grid;
  grid-auto-columns: minmax(0, 1fr);
  grid-auto-flow: column;
  gap: 6px;
  margin: 14px 0 0;
  padding: 0;
  list-style: none;
}

.forecast-strip li {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 5px;
  height: 150px;
  justify-content: flex-end;
}

.slot-temp {
  font-size: 12px;
  font-weight: 750;
}

/* 막대 높이는 구간 내 상대 기온 — 절대값 비교가 아닌 흐름 표현 */
.slot-bar {
  width: 9px;
  min-height: 8px;
  border-radius: 999px;
  background: linear-gradient(180deg, #9fb266, #d9e0c6);
}

.slot-time {
  color: #4a5257;
  font-size: 11px;
}

.slot-part {
  color: #8b969b;
  font-size: 10px;
}

.forecast-hint {
  margin: 12px 0;
  color: #78848a;
  font-size: 13px;
}

.clothes-detail-view {
  max-width: 760px;
  margin: 0 auto;
  color: #20272a;

  /*
    한글 기본 줄바꿈은 글자 단위 → '추천해 / 요'처럼 어절이 쪼개짐.
    keep-all로 띄어쓰기 단위로만 끊고, 한 어절이 너무 길 때만 예외로 끊습니다.
    두 속성 모두 상속되므로 상세 화면 내부 전체 문구에 일괄 적용
  */
  word-break: keep-all;
  overflow-wrap: break-word;
}

.detail-heading p,
.outfit-card > p {
  margin: 0;
  color: #788a27;
  font-size: 11px;
  font-weight: 850;
  letter-spacing: 0.14em;
}

.detail-heading h1 {
  margin: 5px 0 6px;
  font-size: clamp(30px, 6vw, 48px);
  font-weight: 850;
  letter-spacing: -0.04em;
}

.detail-heading > span {
  color: #697478;
  font-size: 17px;
}

.detail-condition {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  /* 긴 한글 날씨 설명이 글자 단위로 잘리지 않도록 어절 단위 줄바꿈 */
  word-break: keep-all;
}

.weather-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin: 28px 0 18px;
}

.weather-metrics article {
  display: flex;
  flex-direction: column;
  padding: 20px;
  border: 1px solid #dce1de;
  border-radius: 16px;
  background: #ffffff;
}

.weather-metrics span,
.recommendation-grid span {
  color: #717b7f;
  font-size: 12px;
}

.weather-metrics strong {
  margin-top: 5px;
  font-size: 25px;
  font-weight: 800;
}

.outfit-card {
  padding: 28px;
  border-radius: 20px;
  background: #e9efcf;
}

.outfit-card h2 {
  margin: 6px 0 22px;
  font-size: 27px;
  font-weight: 800;
}

.recommendation-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.recommendation-grid > div {
  padding: 18px;
  border-radius: 14px;
  background: rgb(255 255 255 / 75%);
}

.recommendation-grid ul {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin: 10px 0 0;
  padding: 0;
  list-style: none;
}

.recommendation-grid li {
  padding: 5px 9px;
  border-radius: 999px;
  background: #ffffff;
  font-size: 13px;
  font-weight: 700;
}

.map-button {
  margin-top: 20px;
  padding: 10px 14px;
  border: 0;
  border-radius: 9px;
  background: #20272a;
  color: #ffffff;
  cursor: pointer;
}

.missing-city {
  padding: 48px 24px;
  border-radius: 18px;
  background: #ffffff;
  text-align: center;
}

@media (max-width: 560px) {
  .weather-metrics,
  .recommendation-grid {
    grid-template-columns: 1fr;
  }

  .day-plan {
    grid-template-columns: 1fr;
  }

  .day-plan p {
    min-height: 0;
  }
}
</style>
