<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  // 참고 코드와 동일하게 이름이 지정된 Route를 이용해 메인 화면으로 이동
  router.push({ name: 'WeatherHome' })
}
</script>

<template>
  <!-- [라우팅 과제 요구사항 1.] 등록되지 않은 URL에서 보여주는 Catch-all 화면 -->
  <div class="not-found-container">
    <div class="not-found-content">
      <!-- 시각적 포인트를 위한 아이콘 또는 큰 텍스트 (옵션) -->
      <div class="error-icon">☀️❓</div>

      <h2>페이지를 찾을 수 없습니다.</h2>
      <p>요청하신 주소가 존재하지 않거나,<br />아직 개발되지 않았습니다.</p>

      <!-- 포인트 컬러가 적용된 버튼 -->
      <button class="home-button" @click="goHome">날씨 메인으로 이동</button>
    </div>
  </div>
</template>

<!-- Scoped CSS로 이 컴포넌트에만 스타일 적용 -->
<style scoped>
.not-found-container {
  max-width: 640px;
  margin: 80px auto;
  padding: 48px 24px;
  border: 1px solid #dfe5eb;
  border-radius: 12px;
  background: #ffffff;
  text-align: center;
}

.error-code {
  margin: 0;
  color: #2e7d32;
  font-size: 64px;
  font-weight: 900;
}

.not-found-container button {
  margin-top: 18px;
  padding: 9px 14px;
  border: 0;
  border-radius: 6px;
  background: #2c3e50;
  color: #ffffff;
  cursor: pointer;
}
</style>
