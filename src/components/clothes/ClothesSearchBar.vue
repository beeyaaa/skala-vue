<script setup>
import { nextTick, ref } from 'vue'
import { PhMagnifyingGlass, PhX } from '@phosphor-icons/vue'

const props = defineProps({
  currentQuery: {
    type: String,
    default: '',
  },
})

defineEmits(['update-query'])

// 지도 영역 확보를 위해 검색창은 돋보기 버튼 클릭 시에만 펼침
const isSearchOpen = ref(Boolean(props.currentQuery))
const searchInput = ref(null)

const toggleSearch = async () => {
  isSearchOpen.value = !isSearchOpen.value

  if (isSearchOpen.value) {
    await nextTick()
    searchInput.value?.focus()
  }
}
</script>

<template>
  <div class="search-control" :class="{ open: isSearchOpen }">
    <button
      type="button"
      class="search-toggle"
      :class="{ active: currentQuery }"
      :aria-label="isSearchOpen ? '도시 검색창 닫기' : '도시 검색창 열기'"
      :aria-expanded="isSearchOpen"
      @click="toggleSearch"
    >
      <PhX v-if="isSearchOpen" :size="19" aria-hidden="true" />
      <PhMagnifyingGlass v-else :size="20" aria-hidden="true" />
    </button>

    <!-- [Hands-on 1·3] :value로 Props 표시, @input으로 부모에 변경 이벤트 전달 -->
    <label class="search-field">
      <span class="sr-only">도시 검색</span>
      <input
        ref="searchInput"
        type="search"
        :value="currentQuery"
        placeholder="도시 이름을 검색하세요"
        autocomplete="off"
        :tabindex="isSearchOpen ? 0 : -1"
        @input="$emit('update-query', $event.target.value)"
      />
    </label>
  </div>
</template>

<style scoped>
.search-control {
  display: flex;
  align-items: center;
  gap: 7px;
}

.search-toggle {
  position: relative;
  display: grid;
  flex: 0 0 40px;
  width: 40px;
  height: 40px;
  place-items: center;
  border: 1px solid #d4dad7;
  border-radius: 11px;
  background: #ffffff;
  color: #4f5a55;
  cursor: pointer;
}

.search-toggle:hover,
.search-toggle:focus-visible {
  border-color: #66783d;
  color: #56682f;
  outline: 0;
}

.search-toggle.active::after {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #66783d;
  content: '';
}

.search-field {
  width: 0;
  overflow: hidden;
  opacity: 0;
  visibility: hidden;
  transition:
    width 180ms ease,
    opacity 140ms ease,
    visibility 0s linear 180ms;
  pointer-events: none;
}

.search-control.open .search-field {
  width: min(200px, 22vw);
  opacity: 1;
  visibility: visible;
  transition-delay: 0s;
  pointer-events: auto;
}

.search-field input {
  width: 100%;
}

.search-field input {
  min-height: 40px;
  padding: 0 14px;
  border: 1px solid #d4dad7;
  border-radius: 11px;
  background: #ffffff;
  color: #29302d;
  font-family: inherit;
  font-size: 14px;
  outline: 0;
}

.search-field input:focus {
  border-color: #66783d;
  box-shadow: 0 0 0 3px rgb(102 120 61 / 12%);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  clip-path: inset(50%);
}

@media (max-width: 680px) {
  .search-control.open .search-field {
    width: min(200px, 52vw);
  }
}
</style>
