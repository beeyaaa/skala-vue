<script setup>
import { computed } from 'vue'
import { PhCloud, PhCloudRain, PhCloudSun, PhSun } from '@phosphor-icons/vue'

import { useConfigStore } from '../../stores/configStore.js'

// 지도 View로부터 도시 한 건과 선택 여부를 전달받음
const props = defineProps({
  city: {
    type: Object,
    required: true,
  },
  selected: {
    type: Boolean,
    default: false,
  },
})

// 마커 클릭을 부모 View의 선택 상태 변경으로 연결
defineEmits(['select'])

const iconByWeather = {
  sunny: PhSun,
  partlyCloudy: PhCloudSun,
  rainy: PhCloudRain,
  cloudy: PhCloud,
}

const weatherIcon = computed(() => iconByWeather[props.city.weatherType] ?? PhCloud)

// [Hands-on 5 요구사항 3.] 전역 단위 설정 변경 시 모든 도시 마커 기온도 함께 변경
const configStore = useConfigStore()
const displayTemp = computed(() => configStore.convertTemperature(props.city.temp))

// 라벨끼리 겹칠 때 "라벨만" 좌우로 이동. 앵커 점(실제 위치)은 고정
const pillStyle = computed(() => ({
  transform: `translateX(-50%) translateX(${props.city.labelDx ?? 0}px)`,
}))
</script>

<template>
  <!--
    위치 정확도와 라벨 가독성을 분리한 구조
    - anchor-dot: 위경도로 계산한 "정확한 지점" 표시
    - city-pill: 읽기용 라벨이라 점 위에 부유 → 겹쳐도 위치 자체는 불변
  -->
  <div class="city-marker" :class="{ selected }" :style="{ left: city.x + '%', top: city.y + '%' }">
    <span class="anchor-dot" aria-hidden="true" />

    <button
      type="button"
      class="city-pill"
      :style="pillStyle"
      :aria-label="`${city.name} ${displayTemp}${configStore.unitSymbol} ${city.status}`"
      :aria-pressed="selected"
      @click.stop="$emit('select', city)"
    >
      <strong>{{ city.name }}</strong>
      <span>{{ displayTemp }}{{ configStore.unitSymbol }}</span>
      <component :is="weatherIcon" :size="18" weight="regular" aria-hidden="true" />
    </button>
  </div>
</template>

<style scoped>
.city-marker {
  position: absolute;
  z-index: 4;
  /* 요소의 원점이 곧 계산된 좌표 */
  transform: translate(-50%, -50%);
}

/* 정확한 지점을 나타내는 점 — 라벨과 달리 절대 이동하지 않음 */
.anchor-dot {
  position: absolute;
  top: 0;
  left: 0;
  width: 8px;
  height: 8px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  background: #5d6f36;
  box-shadow: 0 1px 4px rgb(31 38 35 / 35%);
  transform: translate(-50%, -50%);
}

/* 라벨은 점 바로 위에 배치 */
.city-pill {
  position: absolute;
  bottom: 9px;
  left: 50%;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 9px;
  border: 1px solid rgb(43 50 47 / 13%);
  border-radius: 999px;
  background: rgb(250 249 245 / 94%);
  box-shadow:
    0 5px 12px rgb(31 38 35 / 12%),
    inset 0 1px 0 rgb(255 255 255 / 90%);
  color: #29302d;
  font-family: inherit;
  transform: translateX(-50%);
  transition:
    border-color 160ms ease,
    box-shadow 160ms ease;
  cursor: pointer;
  white-space: nowrap;
}

.city-pill strong {
  font-size: 12px;
  font-weight: 750;
}

.city-pill span {
  color: #505955;
  font-size: 12px;
}

/* 라벨이 겹칠 때 마우스 오버 시 전면 표시 */
.city-marker:hover {
  z-index: 7;
}

.city-pill:hover,
.city-pill:focus-visible {
  border-color: #6b7c46;
  box-shadow:
    0 8px 18px rgb(31 38 35 / 20%),
    0 0 0 3px rgb(107 124 70 / 14%);
  outline: 0;
}

.city-marker.selected {
  z-index: 8;
}

.city-marker.selected .anchor-dot {
  width: 11px;
  height: 11px;
  background: #3f4d24;
}

.city-marker.selected .city-pill {
  border: 2px solid #66783d;
  box-shadow:
    0 8px 20px rgb(46 57 39 / 22%),
    0 0 0 4px rgb(102 120 61 / 14%);
}

@media (max-width: 900px) {
  .city-pill {
    gap: 4px;
    padding: 4px 7px;
  }

  .city-pill strong,
  .city-pill span {
    font-size: 11px;
  }

  .city-pill :deep(svg) {
    width: 15px;
    height: 15px;
  }
}

/* 좁은 화면에서는 라벨 간 가림 발생 → 아이콘 제거 후 최소 크기로 축소 */
@media (max-width: 680px) {
  .city-pill {
    gap: 3px;
    padding: 3px 6px;
  }

  .city-pill strong,
  .city-pill span {
    font-size: 10px;
  }

  .city-pill :deep(svg) {
    display: none;
  }
}
</style>
