<template>
  <!-- [Hands-on 3] 컨테이너는 자리만 정의, 실제 내용은 부모가 Slot으로 주입 -->
  <!-- 변경: 검색·필터가 Navigation Bar로 이동 → 지도 위 얇은 상태 표시줄만 유지 -->
  <section class="map-status-bar" @click.stop>
    <div class="status-main">
      <slot name="status" />
    </div>
    <div class="status-meta">
      <slot name="meta" />
    </div>
  </section>
</template>

<style scoped>
.map-status-bar {
  position: absolute;
  z-index: 5;
  top: 12px;
  left: 14px;
  display: flex;
  align-items: center;
  max-width: calc(100% - 28px);
  gap: 12px;
  padding: 7px 14px;
  border: 1px solid rgb(43 50 47 / 9%);
  border-radius: 999px;
  background: rgb(253 252 248 / 88%);
  box-shadow: 0 4px 14px rgb(42 49 46 / 7%);
  backdrop-filter: blur(6px);
}

.status-main {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  min-width: 0;
  gap: 10px;
}

.status-meta {
  flex: 0 0 auto;
}

@media (max-width: 680px) {
  .map-status-bar {
    top: 8px;
    left: 10px;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
    border-radius: 14px;
  }
}
</style>
