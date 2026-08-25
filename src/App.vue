<script setup>
// App.vue는 애플리케이션의 최상위(Root) 컴포넌트이다.
// 각 코드 챌린지 컴포넌트를 import한 뒤 template에 배치하면 한 화면에서 결과를 확인할 수 있다.

// 1. v-on 이벤트 처리 실습
import EventHandlerVOn from './components/code-challenge/EventHandler_v-on.vue'
import EventObject from './components/code-challenge/EventObject.vue'
import EventModifier from './components/code-challenge/EventModifier.vue'

// 2. v-model Form 데이터 바인딩 실습
import FormDataBindingVariables from './components/code-challenge/FormDataBinding_Declaringv-modelVariables.vue'
import FormDataBindingModifier from './components/code-challenge/FormDataBinding_Modifier.vue'

// 3. 컴포넌트 Scoped CSS와 외부 CSS 실습
import VueStyle from './components/code-challenge/VueStyle.vue'

// 4. v-for, v-if, v-bind, v-on을 종합한 날씨 Mockup Hands-on
import WeatherMockup from './components/hands-on/WeatherMockup.vue'

// 5. computed, watch, watchEffect를 적용한 날씨 Composition Hands-on
import WeatherComposition from './components/hands-on/WeatherComposition.vue'
</script>

<template>
  <!-- 모든 코드 챌린지를 감싸는 최상위 레이아웃 -->
  <main class="practice-container">
    <!-- v-on: 클릭 이벤트, 이벤트 객체, 이벤트 수식어 확인 -->
    <section class="practice-group">
      <h1>1. Vue Event Handling</h1>
      <EventHandlerVOn />
      <EventObject />
      <EventModifier />
    </section>

    <!-- v-model: 입력 요소와 반응형 데이터의 양방향 바인딩 확인 -->
    <section class="practice-group">
      <h1>2. Vue Form Data Binding</h1>
      <FormDataBindingVariables />
      <FormDataBindingModifier />
    </section>

    <!-- style scoped와 외부 CSS 파일의 적용 범위 확인 -->
    <section class="practice-group">
      <h1>3. Vue Style Handling</h1>
      <VueStyle />
    </section>

    <!-- 기본 Directive와 이벤트 처리를 종합한 날씨 대시보드 Hands-on -->
    <section class="practice-group">
      <h1>4. Hands-on - Weather Mockup</h1>
      <WeatherMockup />
    </section>

    <!-- computed 검색 필터와 반응형 상태 감시 기능 확인 -->
    <section class="practice-group">
      <h1>5. Hands-on - Weather Composition</h1>
      <WeatherComposition />
    </section>
  </main>
</template>

<style scoped>
/* 실습 결과가 화면 가장자리에 붙지 않도록 전체 여백과 최대 너비를 설정한다. */
.practice-container {
  width: min(100% - 40px, 960px);
  margin: 0 auto;
  padding: 40px 0;
}

/* 코드 챌린지 주제별 영역을 시각적으로 구분한다. */
.practice-group {
  padding: 28px 0;
  border-bottom: 1px solid #d9d9d9;
}

.practice-group:last-child {
  border-bottom: 0;
}

.practice-group > h1 {
  margin-bottom: 24px;
}
</style>
