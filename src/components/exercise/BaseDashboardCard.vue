<!-- [컴포넌트 과제 요구사항 2.]
  - 검색박스와 리스트박스의 디자인 공통화
  - <slot> 배치로 부모 컴포넌트가 도시 검색·날씨 현황 주입 -->

<template>
  <div class="base-dashboard-card">
    <slot></slot>
  </div>
</template>

<style scoped>
.base-dashboard-card {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  border: 1px solid #e9ecef;
}
</style>
