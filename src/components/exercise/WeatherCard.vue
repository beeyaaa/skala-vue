<script setup>
import { computed } from 'vue'

import { useConfigStore } from '../../stores/configStore.js'

// 선택된 도시 객체를 전달 받아 표시 (props)
const props = defineProps({
  cityItem: {
    type: Object,
    required: true,
  },
  // [컴포넌트 과제 요구사항 4.] 부모의 사용자 지정 더움 기준 온도 수신
  hotThreshold: {
    type: Number,
    required: true,
  },
})

// [컴포넌트 과제 요구사항 4.] 카드 선택 및 상세보기 이벤트를 부모로 전달
// 변경: 상세보기는 도시 객체 하나만 전달 → 부모가 필요한 값만 선택 사용
const emit = defineEmits(['select-card', 'click-detail'])

// [Hands-on 5 요구사항 3.] 메인 대시보드 카드도 Navigation Bar의 전역 단위 설정을 따름.
// 원본 데이터(cityItem.temp)는 항상 섭씨 유지, 화면 표시 값만 변환
const configStore = useConfigStore()
const displayTemp = computed(() => configStore.convertTemperature(props.cityItem.temp))
</script>

<template>
  <div class="weather-card" @click="emit('select-card', `${cityItem.name}이 선택되었습니다.`)">
    <div class="weather-row">
      <span class="city-name">{{ cityItem.name }}</span>

      <!-- [Hands-on 5 요구사항 3.] 단위 설정에 따라 ℃ / ℉ 표시 동시 변경 -->
      <span class="temperature">{{ displayTemp }}{{ configStore.unitSymbol }}</span>

      <button class="btn-detail" @click.stop="emit('click-detail', cityItem)">상세보기</button>

      <!-- 더움 판정은 단위 변환과 무관하게 항상 원본 섭씨 값으로 계산 -->
      <span v-if="cityItem.temp >= hotThreshold" class="badge hot">🔥 더움</span>
      <span v-else class="badge cool">❄️ 선선함</span>
    </div>
  </div>
</template>

<style scoped>
.weather-card {
  background: #fff;
  border: 1px solid #dee2e6;
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 6px;
  cursor: pointer;
}
.weather-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.city-name {
  font-weight: 700;
}
/* [Hands-on 5 요구사항 3.] 단위 전환 시 폭이 흔들리지 않도록 최소 너비를 고정 */
.temperature {
  min-width: 56px;
  color: #2e7d32;
  font-weight: 700;
}
.badge {
  display: inline-block;
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 4px;
  color: #fff;
}
.hot {
  background-color: #ff7675;
}
.cool {
  background-color: #74b9ff;
}
.btn-detail {
  position: static;
  padding: 6px 10px;
  cursor: pointer;
}
</style>
