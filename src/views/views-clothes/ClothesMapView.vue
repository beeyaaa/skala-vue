<script setup>
import { computed, onMounted, onUnmounted, watch, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
// 온디맨드 방식에는 전역 CSS가 없어 이 컴포넌트의 스타일만 직접 import
import 'element-plus/es/components/message/style/css'

import BaseMapPanel from '../../components/clothes/BaseMapPanel.vue'
import ClothesCityMarker from '../../components/clothes/ClothesCityMarker.vue'
import ClothesWeatherPopup from '../../components/clothes/ClothesWeatherPopup.vue'
import { useWeatherStore } from '../../stores/weatherStore.js'
import { MAP_FRAME, createOutfitRecommendation, projectCityPosition } from './clothesWeatherData.js'

const router = useRouter()
const weatherStore = useWeatherStore()
const {
  searchQuery,
  selectedCity,
  selectedWeatherType,
  filteredWeatherList,
  isLoading,
  errorMessage,
  dataSource,
  lastUpdatedAt,
  externalCities,
  isSearchingExternal,
} = storeToRefs(weatherStore)

// [Hands-on 6] 실시간 연동 여부와 갱신 시각을 한 줄로 요약
const dataSourceLabel = computed(() => {
  if (isLoading.value) return '불러오는 중'
  if (dataSource.value !== 'api') return '임시 데이터'

  const time = lastUpdatedAt.value?.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return time ? `실시간 · ${time} 기준` : '실시간'
})

// [Hands-on 6] 화면 진입 시 실시간 날씨 조회.
// API Key가 없으면 Store가 Mock Data를 유지하므로 화면은 항상 동작.
// OpenWeatherMap 무료 플랜 관측값이 약 10분 주기로 갱신 → 동일 간격으로 재조회
const REFRESH_INTERVAL_MS = 10 * 60 * 1000
let refreshTimer = null

onMounted(() => {
  weatherStore.fetchLiveWeather()

  // 화면이 열려 있는 동안 새로고침 없이도 최신 값으로 갱신
  refreshTimer = setInterval(() => {
    weatherStore.fetchLiveWeather({ force: true })
  }, REFRESH_INTERVAL_MS)
})

// 지도 화면 이탈 시 타이머 정리 → 불필요한 API 호출 차단
onUnmounted(() => {
  clearInterval(refreshTimer)
})

// 선택 도시 변경 시에만 옷차림 추천 결과 재계산
const selectedRecommendation = computed(() => {
  return createOutfitRecommendation(selectedCity.value)
})

// [Hands-on 2] 검색·필터·도시 선택 결과를 즉시 보여주는 상태바 문구
const statusMessage = computed(() => {
  if (isLoading.value) {
    return '실시간 날씨를 불러오는 중입니다...'
  }

  if (isSearchingExternal.value) {
    return '다른 지역을 찾는 중...'
  }

  // 내장 목록에 없어 Geocoding으로 찾은 지역은 지도에 임시 표시만
  if (externalCities.value.length > 0) {
    return `검색 결과 ${externalCities.value.length}곳을 지도에 표시했습니다. 마커를 누르면 열립니다.`
  }

  if (selectedCity.value && selectedRecommendation.value) {
    return `${selectedCity.value.name}이 선택되었습니다. · ${selectedCity.value.status} · ${selectedRecommendation.value.title}`
  }

  if (searchQuery.value || selectedWeatherType.value !== '전체') {
    return `조건에 맞는 도시 ${filteredWeatherList.value.length}개가 지도에 표시됩니다.`
  }

  return '도시를 검색하거나 지도 마커를 선택해 보세요.'
})

// [지도 좌표계] 지도에 그려진 범위 안의 도시는 위경도로 계산한 프레임 내부 좌표 사용.
// 백령도처럼 범위를 살짝 벗어나는 곳도 같은 식을 외삽해 함께 계산
const mappedCities = computed(() => {
  return [...filteredWeatherList.value, ...externalCities.value]
    .filter((city) => !city.offMap)
    .map((city) => ({ ...city, ...projectCityPosition(city) }))
})

// 울릉도·독도는 실제 축척 적용 시 화면 밖으로 이탈 → 동해상 고정 위치에 표시.
// 섬 그림과 마커가 같은 좌표를 사용해 앵커 점이 섬 그림 위에 정확히 위치
const offMapCities = computed(() => filteredWeatherList.value.filter((city) => city.offMap))

const islandAssets = {
  city_21: '/images/ulleungdo-map.svg',
  city_22: '/images/dokdo-map.svg',
}

// 지도 이미지와 마커가 같은 프레임 값을 공유하도록 인라인 스타일로 전달
const mapFrameStyle = {
  top: MAP_FRAME.top + '%',
  height: MAP_FRAME.height + '%',
  // 지도를 늘리지 않고 실제 가로:세로 비율 유지 (한반도 형태 왜곡 방지)
  aspectRatio: String(MAP_FRAME.aspect),
}

// 이미지를 확대(imageWidth/Height)한 뒤 왼쪽·위쪽 여백만큼 끌어올려(imageLeft/Top)
// 지형이 그려진 영역만 프레임에 정확히 맞춤
const mapImageStyle = {
  width: MAP_FRAME.imageWidth + '%',
  height: MAP_FRAME.imageHeight + '%',
  left: MAP_FRAME.imageLeft + '%',
  top: MAP_FRAME.imageTop + '%',
}

const selectCity = (city) => {
  weatherStore.selectCity(city.id)
}

const closePopup = () => {
  weatherStore.clearSelectedCity()
}

// [Hands-on 7] 사용자 수동 갱신 시 처리 결과를 짧은 Message로 안내
const refreshWeather = async () => {
  await weatherStore.fetchLiveWeather({ force: true })

  if (errorMessage.value) {
    ElMessage.error(errorMessage.value)
    return
  }

  ElMessage.success('최신 날씨로 갱신했습니다.')
}

// [추가 View Routing] 선택한 도시 ID를 동적 경로에 담아 상세 View로 이동
const showDetail = () => {
  router.push('/clothes/weather/' + selectedCity.value.id)
}

// [Hands-on 2 요구사항 3.] 선택 도시와 검색어 변화를 각각 watch·watchEffect로 감시
watch(selectedCity, (city) => {
  console.log(`[watch 감지] 선택 도시: ${city?.name ?? '선택 해제'}`)
})

watchEffect(() => {
  console.log(`[watchEffect 감지] 현재 검색어: ${searchQuery.value || '(검색어 없음)'}`)
})

// [Hands-on 2 요구사항 5.] 본인 추가 날씨 상태 필터의 변화 감시
watch(selectedWeatherType, (newType, oldType) => {
  console.log(`[사용자 기능] 날씨 필터 변경: ${oldType} -> ${newType}`)
})
</script>

<template>
  <section class="clothes-map-view">
    <!-- 지도 클릭 시 팝업 닫힘, 마커는 .stop으로 클릭 전파 차단 -->
    <div class="weather-map-stage" @click="closePopup">
      <BaseMapPanel>
        <template #status>
          <!-- [Hands-on 1 요구사항 3.] 한글 입력 검색어를 그대로 반환 표시 -->
          <p v-if="searchQuery" class="search-echo">
            검색 중인 도시: <strong>{{ searchQuery }}</strong>
          </p>

          <p class="search-status" aria-live="polite">{{ statusMessage }}</p>

          <!-- [Hands-on 6] 통신 실패 시에도 화면 정지 없이 안내만 추가 -->
          <el-alert
            v-if="errorMessage"
            class="search-error"
            :title="errorMessage"
            type="error"
            :closable="false"
            show-icon
          />
        </template>

        <template #meta>
          <!-- [Hands-on 6] 현재 표시 값이 실시간인지 임시 데이터인지 구분 표시 -->
          <button
            type="button"
            class="data-source"
            :class="dataSource"
            :disabled="isLoading"
            title="눌러서 지금 바로 갱신"
            @click.stop="refreshWeather"
          >
            {{ dataSourceLabel }}
          </button>
        </template>
      </BaseMapPanel>

      <!-- 공개 지도 원본에서 지형이 그려진 영역만 프레임에 꽉 채워 노출 -->
      <div class="map-frame" :style="mapFrameStyle">
        <!-- 이미지의 빈 여백만 절단, 마커는 프레임 경계를 넘어도 잘리지 않음 -->
        <div class="map-clip">
          <img
            class="korea-map"
            :style="mapImageStyle"
            src="/images/south-korea-map.svg"
            alt="대한민국 지도"
          />
        </div>

        <!-- 지도 안의 도시 — 좌표가 프레임 기준이라 지도와 정확히 일치 -->
        <ClothesCityMarker
          v-for="city in mappedCities"
          :key="city.id"
          :city="city"
          :selected="selectedCity?.id === city.id"
          @select="selectCity"
        />
      </div>

      <!-- 동해상의 섬 — 섬 그림과 마커가 같은 좌표 공유 -->
      <template v-for="city in offMapCities" :key="city.id">
        <img
          v-if="islandAssets[city.id]"
          class="island-map"
          :style="{ left: city.x + '%', top: city.y + '%' }"
          :src="islandAssets[city.id]"
          :alt="`${city.name} 지도`"
        />

        <ClothesCityMarker
          :city="city"
          :selected="selectedCity?.id === city.id"
          @select="selectCity"
        />
      </template>

      <p
        v-if="filteredWeatherList.length === 0 && externalCities.length === 0"
        class="empty-result"
      >
        검색 결과와 일치하는 도시가 없습니다.
      </p>

      <ClothesWeatherPopup
        v-if="selectedCity && selectedRecommendation"
        :city="selectedCity"
        :recommendation="selectedRecommendation"
        @close="closePopup"
        @show-detail="showDetail"
      />
    </div>

    <p class="map-source">지도: Wikimedia Commons 공개 지도 원본</p>
  </section>
</template>

<style scoped>
.clothes-map-view {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;

  /*
    한글 기본 줄바꿈은 글자 단위 → '추천해 / 요'처럼 어절이 쪼개짐.
    keep-all로 띄어쓰기 단위로만 끊고, 한 어절이 너무 길 때만 예외로 끊습니다.
    두 속성 모두 상속되므로 지도 화면 내부 전체 문구에 일괄 적용
  */
  word-break: keep-all;
  overflow-wrap: break-word;
}

.weather-map-stage {
  position: relative;
  min-height: min(820px, calc(100vh - 126px));
  overflow: hidden;
  border: 1px solid #dfe5e7;
  border-radius: 0 0 24px 24px;
  background-color: #edf3f6;
  box-shadow: inset 0 0 90px rgb(121 143 153 / 10%);
}

/* [Hands-on 6] 데이터 출처 배지 */
.data-source {
  display: inline-block;
  border: 0;
  font-family: inherit;
  cursor: pointer;
  padding: 3px 10px;
  border-radius: 999px;
  background: #eef1ec;
  color: #6d7772;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
}

.data-source:hover:not(:disabled) {
  background: #e3e8dc;
  color: #4d5c2b;
}

.data-source:disabled {
  cursor: default;
}

.data-source.api {
  background: #e9eedf;
  color: #56682f;
}

.search-status {
  margin: 0;
  color: #65706b;
  font-size: 12px;
}

/* [Hands-on 1 요구사항 3.] 검색어 표시 줄 */
.search-echo {
  margin: 0;
  color: #29302d;
  font-size: 12px;
}

.search-echo strong {
  color: #56682f;
}

/* [Hands-on 6] 실시간 통신 실패 안내 */
.search-error {
  margin: 0;
  color: #b3452f;
  font-size: 12px;
}

.empty-result {
  position: absolute;
  z-index: 5;
  top: 50%;
  left: 50%;
  margin: 0;
  padding: 14px 18px;
  border-radius: 12px;
  background: rgb(253 252 248 / 92%);
  color: #68726e;
  transform: translate(-50%, -50%);
}

.map-frame {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.map-clip {
  position: absolute;
  inset: 0;
  overflow: hidden;
  user-select: none;
  pointer-events: none;
}

.korea-map {
  position: absolute;
  top: 0;
  left: 0;
  object-fit: fill;
  opacity: 0.62;
  filter: saturate(0.1) brightness(1.14);
}

.island-map {
  position: absolute;
  z-index: 1;
  width: 34px;
  height: 34px;
  object-fit: cover;
  border-radius: 50%;
  opacity: 0.5;
  filter: grayscale(1) contrast(0.8);
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.map-source {
  margin: 8px 3px 0;
  color: #849095;
  font-size: 11px;
  text-align: right;
}

/* 지도 프레임과 마커가 같은 비율 값을 공유 → 화면 폭 변화 시 별도 보정 불필요 */
@media (max-width: 900px) {
  .weather-map-stage {
    min-height: 700px;
    border-radius: 0;
  }
}
</style>
