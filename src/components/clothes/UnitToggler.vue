<script setup>
import { storeToRefs } from 'pinia'

import { useConfigStore } from '../../stores/configStore.js'

const configStore = useConfigStore()
const { unit } = storeToRefs(configStore)
</script>

<template>
  <!-- [Hands-on 5 요구사항 1.] 앱 전체의 섭씨·화씨 설정을 변경하는 UI -->
  <button
    type="button"
    class="unit-toggler"
    :aria-label="`현재 ${unit === 'celsius' ? '섭씨' : '화씨'} 단위. 클릭하여 전환`"
    @click="configStore.toggleUnit"
  >
    <span :class="{ active: unit === 'celsius' }">℃</span>
    <span :class="{ active: unit === 'fahrenheit' }">℉</span>
  </button>
</template>

<style scoped>
.unit-toggler {
  display: inline-flex;
  flex: 0 0 auto;
  gap: 2px;
  padding: 3px;
  border: 1px solid #d6ddda;
  border-radius: 999px;
  background: #f1f4f2;
  font-family: inherit;
  cursor: pointer;
}

.unit-toggler span {
  display: grid;
  width: 30px;
  height: 27px;
  place-items: center;
  border-radius: 999px;
  color: #77817c;
  font-size: 12px;
  font-weight: 750;
}

.unit-toggler span.active {
  background: #ffffff;
  box-shadow: 0 2px 7px rgb(43 50 47 / 10%);
  color: #586b31;
}
</style>
