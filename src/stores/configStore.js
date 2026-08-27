import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

// [Hands-on 5 요구사항] 여러 View가 공통으로 쓰는 온도 단위를 전역 Store로 관리
export const useConfigStore = defineStore('config', () => {
  // state: 사용자가 선택한 온도 단위. 원본 날씨 데이터는 항상 섭씨로 유지
  const unit = ref('celsius')

  // getter: 현재 단위에 맞는 기호를 반응형으로 계산
  const unitSymbol = computed(() => (unit.value === 'celsius' ? '℃' : '℉'))

  // action: 섭씨 ↔ 화씨 전환
  const toggleUnit = () => {
    unit.value = unit.value === 'celsius' ? 'fahrenheit' : 'celsius'
  }

  // 여러 컴포넌트가 같은 변환 규칙을 쓰도록 변환 로직을 Store에 집약
  const convertTemperature = (celsius) => {
    if (unit.value === 'fahrenheit') {
      return Math.round((celsius * 9) / 5 + 32)
    }

    return celsius
  }

  return { unit, unitSymbol, toggleUnit, convertTemperature }
})
