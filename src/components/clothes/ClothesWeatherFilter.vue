<script setup>
// [Hands-on 3 요구사항 7.] 지도 View에 인라인이던 필터를 별도 컴포넌트로 분리.
// 부모로부터 목록과 현재 선택값을 Props로 수신, 선택 결과만 Emits로 반환
defineProps({
  filters: {
    type: Array,
    required: true,
  },
  selectedType: {
    type: String,
    required: true,
  },
})

defineEmits(['update-type'])
</script>

<template>
  <div class="weather-filters" role="group" aria-label="날씨 상태 필터">
    <button
      v-for="filter in filters"
      :key="filter.value"
      type="button"
      :class="{ active: selectedType === filter.value }"
      :aria-pressed="selectedType === filter.value"
      @click="$emit('update-type', filter.value)"
    >
      {{ filter.label }}
    </button>
  </div>
</template>

<style scoped>
/* [Hands-on 3 요구사항 5.] 필터 전용 디자인을 이 컴포넌트로 분리 */
.weather-filters {
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  gap: 2px;
  padding: 3px;
  border: 1px solid #d6ddda;
  border-radius: 999px;
  background: #f1f4f2;
}

.weather-filters button {
  min-height: 27px;
  padding: 0 10px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: #6d7772;
  font-family: inherit;
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;
}

.weather-filters button:hover,
.weather-filters button:focus-visible {
  color: #56682f;
  outline: 0;
}

.weather-filters button.active {
  background: #ffffff;
  box-shadow: 0 2px 7px rgb(43 50 47 / 10%);
  color: #586b31;
  font-weight: 750;
}
</style>
