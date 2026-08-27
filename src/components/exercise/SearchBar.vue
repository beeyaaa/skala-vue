<script setup>
// 도시 검색 시 update-query 이벤트를 발생하면서 검색어를 부모에게 전달 (emits)
defineEmits(['update-query'])

// 부모로 부터 검색도시 반응형 데이터를 전달받아 표시 (props)
defineProps({
  currentQuery: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="search-inner">
    <h3>도시 검색</h3>
    <input
      type="text"
      :value="currentQuery"
      @input="$emit('update-query', $event.target.value)"
      placeholder="검색할 도시 이름 입력"
    />
    <p>
      검색 중인 도시: <strong>{{ currentQuery }}</strong>
    </p>
  </div>
</template>

<style scoped>
/* [컴포넌트 과제 요구사항 5.] 검색 컴포넌트 전용 디자인 분리 */
.search-inner input {
  width: 90%;
  padding: 8px;
  font-size: 14px;
}
</style>
