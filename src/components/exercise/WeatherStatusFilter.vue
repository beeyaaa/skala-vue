<script setup>
// [컴포넌트 과제 요구사항 7.] 부모로부터 날씨 상태 목록과 현재 선택값을 전달받음 (Props)
defineProps({
  statusList: {
    type: Array,
    required: true,
  },
  selectedStatus: {
    type: String,
    required: true,
  },
})

// [컴포넌트 과제 요구사항 7.] 선택한 날씨 상태를 부모에게 전달 (Emits)
const emit = defineEmits(['update-status'])
</script>

<template>
  <div class="status-filter">
    <h3>날씨 상태</h3>

    <div class="status-buttons">
      <button
        v-for="status in statusList"
        :key="status"
        type="button"
        :class="{ active: status === selectedStatus }"
        @click="emit('update-status', status)"
      >
        {{ status }}
      </button>
    </div>
  </div>
</template>

<style scoped>
/* [컴포넌트 과제 요구사항 5, 7.] 상태 필터 컴포넌트 전용 디자인 */
.status-filter {
  margin: 16px 0;
}

.status-filter h3 {
  margin-bottom: 10px;
}

.status-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.status-buttons button {
  padding: 7px 12px;
  border: 1px solid #b8c2cc;
  border-radius: 16px;
  background: #fff;
  color: #495057;
  cursor: pointer;
}

.status-buttons button.active {
  border-color: #2e7d32;
  background: #2e7d32;
  color: #fff;
}
</style>
