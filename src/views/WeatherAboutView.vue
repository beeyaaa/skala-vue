<script setup>
import {
  PhCloudArrowDown,
  PhCloudSun,
  PhCode,
  PhCursorClick,
  PhMapTrifold,
} from '@phosphor-icons/vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// [라우팅 과제 요구사항 5.] 버튼 이벤트에서 프로그래밍 방식으로 서비스 화면 이동
const goToClothes = () => {
  router.push('/clothes')
}

// 변경: [라우팅 과제 요구사항 5.] 서비스 소개에서 메인 날씨 대시보드로 이동
const goToDashboard = () => {
  router.push({ name: 'WeatherHome' })
}

// README처럼 구현 내용을 반복 출력하기 위한 설명 데이터
const implementationList = [
  {
    title: '지도와 도시 데이터',
    icon: PhMapTrifold,
    description:
      '공개 지도 SVG 위에 도시의 위경도를 투영해 마커를 배치합니다. 정확한 위치를 나타내는 앵커 점과 읽기 위한 라벨을 분리해, 라벨이 겹쳐도 위치가 흔들리지 않습니다.',
  },
  {
    title: '컴포넌트 분리',
    icon: PhCode,
    description:
      '지도 View, 도시 마커, 추천 팝업, 상세 날씨 View로 역할을 나누고 Props와 Emit으로 데이터와 이벤트를 전달합니다.',
  },
  {
    title: '반응형 추천 계산',
    icon: PhCloudSun,
    description:
      '선택된 도시와 검색어는 Pinia Store에서 관리하고, computed로 8개 기온 구간과 비·바람·대기질·특보 조건을 합쳐 옷차림과 준비물을 계산합니다.',
  },
  {
    title: '동적 라우팅',
    icon: PhCursorClick,
    description:
      '상세 버튼을 누르면 Vue Router가 도시 ID를 포함한 /clothes/weather/:cityId 경로로 이동합니다.',
  },
  {
    title: '실시간 데이터 연동',
    icon: PhCloudArrowDown,
    description:
      'OpenWeatherMap의 현재 날씨·예보·대기질과 기상청 특보를 Axios로 불러옵니다. API Key는 서버리스 함수에서만 사용해 브라우저에 노출되지 않습니다.',
  },
]

const techStack = [
  'Vue 3',
  'Composition API',
  'Vue Router',
  'Pinia',
  'Axios',
  'Element Plus',
  'Vite',
  'Phosphor Icons',
]
</script>

<template>
  <section class="about-container">
    <header class="about-hero">
      <p class="eyebrow">ABOUT THE SERVICE</p>
      <h1>오늘 뭐 입지?</h1>
      <p class="hero-description">
        전국 22개 도시의 실시간 날씨를 지도에서 확인하고, 기온·예보·대기질·기상특보를 종합해 오늘
        무엇을 입고 무엇을 챙길지 알려주는 서비스입니다.
      </p>
      <div class="hero-actions">
        <button type="button" class="service-button" @click="goToClothes">
          서비스 사용해 보기
        </button>
        <button type="button" class="dashboard-button" @click="goToDashboard">
          메인 대시보드로 돌아가기
        </button>
      </div>
    </header>

    <section class="about-section" aria-labelledby="features-title">
      <div class="section-heading">
        <span>01</span>
        <div>
          <p>FEATURES</p>
          <h2 id="features-title">주요 기능</h2>
        </div>
      </div>

      <ul class="feature-list">
        <li>전국 22개 도시의 실시간 기온과 날씨를 지도에 표시</li>
        <li>기온 8개 구간과 예보·대기질·기상특보를 반영한 옷차림 · 준비물 추천</li>
        <li>아침 · 낮 · 저녁 시간대별 옷차림 계획과 일교차 안내</li>
        <li>섭씨 · 화씨 전환, 날씨 상태 필터, 지도에 없는 지역까지 한글 검색</li>
      </ul>
    </section>

    <section class="about-section" aria-labelledby="implementation-title">
      <div class="section-heading">
        <span>02</span>
        <div>
          <p>IMPLEMENTATION</p>
          <h2 id="implementation-title">구현 방법</h2>
        </div>
      </div>

      <div class="implementation-grid">
        <article v-for="item in implementationList" :key="item.title">
          <span class="implementation-icon">
            <component :is="item.icon" :size="26" weight="light" aria-hidden="true" />
          </span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
        </article>
      </div>
    </section>

    <section class="about-section compact-section" aria-labelledby="stack-title">
      <div class="section-heading">
        <span>03</span>
        <div>
          <p>TECH STACK</p>
          <h2 id="stack-title">사용 기술</h2>
        </div>
      </div>

      <div class="tech-list">
        <span v-for="tech in techStack" :key="tech">{{ tech }}</span>
      </div>
    </section>

    <section class="future-section">
      <p>데이터는 여기서 옵니다</p>
      <h2>실시간 공공 · 공개 데이터 기반</h2>
      <ol>
        <li>
          <strong>OpenWeatherMap</strong
          ><span>현재 날씨 · 3시간 단위 예보 · 대기질 · 지역 검색</span>
        </li>
        <li><strong>기상청 API 허브</strong><span>폭염 · 한파 · 호우 등 기상특보 현황</span></li>
        <li>
          <strong>Wikimedia Commons</strong><span>대한민국 · 울릉도 · 독도 공개 지도 원본</span>
        </li>
      </ol>
    </section>
  </section>
</template>

<style scoped>
.about-container {
  max-width: 1040px;
  margin: 0 auto;
  padding: 64px 24px 90px;
  color: #29302d;
}

.eyebrow {
  margin: 0 0 10px;
  color: #66783d;
  font-size: 11px;
  font-weight: 750;
  letter-spacing: 0.16em;
}

.about-hero {
  padding: 44px 46px;
  border: 1px solid #dfe4e0;
  border-radius: 24px;
  background: #fbfaf6;
}

.about-hero h1 {
  margin: 0;
  font-size: clamp(42px, 7vw, 72px);
  font-weight: 800;
  letter-spacing: -0.06em;
}

.hero-description {
  max-width: 610px;
  margin: 14px 0 27px;
  color: #626c67;
  font-size: 17px;
  line-height: 1.7;
}

.service-button {
  padding: 13px 18px;
  border: 0;
  border-radius: 9px;
  background: #29302d;
  color: #ffffff;
  font-family: inherit;
  font-weight: 700;
  cursor: pointer;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.dashboard-button {
  padding: 12px 17px;
  border: 1px solid #cfd6d1;
  border-radius: 9px;
  background: transparent;
  color: #3f4944;
  font-family: inherit;
  font-weight: 700;
  cursor: pointer;
}

.about-section {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 34px;
  padding: 56px 4px;
  border-bottom: 1px solid #dce1de;
}

.section-heading {
  display: flex;
  align-items: flex-start;
  gap: 13px;
}

.section-heading > span {
  color: #8b9690;
  font-size: 12px;
}

.section-heading p {
  margin: 0 0 5px;
  color: #66783d;
  font-size: 10px;
  font-weight: 750;
  letter-spacing: 0.14em;
}

.section-heading h2,
.future-section h2 {
  margin: 0;
  font-size: 26px;
  font-weight: 780;
  letter-spacing: -0.035em;
}

.feature-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.feature-list li {
  padding: 18px 19px;
  border-radius: 12px;
  background: #ffffff;
  color: #4f5954;
  line-height: 1.55;
}

.feature-list li::before {
  margin-right: 8px;
  color: #66783d;
  content: '✓';
}

.implementation-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.implementation-grid article {
  min-height: 205px;
  padding: 23px;
  border: 1px solid #dfe4e0;
  border-radius: 16px;
  background: #ffffff;
}

.implementation-icon {
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  border-radius: 50%;
  background: #edf1e5;
  color: #5f713a;
}

.implementation-grid h3 {
  margin: 16px 0 8px;
  font-size: 18px;
}

.implementation-grid p {
  margin: 0;
  color: #68716d;
  font-size: 14px;
  line-height: 1.65;
}

.compact-section {
  align-items: center;
}

.tech-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tech-list span {
  padding: 8px 12px;
  border: 1px solid #dce2d8;
  border-radius: 999px;
  background: #f9faf7;
  color: #4d5852;
  font-size: 13px;
  font-weight: 650;
}

.future-section {
  margin-top: 58px;
  padding: 38px 40px;
  border-radius: 20px;
  background: #e9eee0;
}

.future-section > p {
  margin: 0 0 7px;
  color: #66783d;
  font-size: 12px;
  font-weight: 700;
}

.future-section ol {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin: 28px 0 0;
  padding: 0;
  list-style: none;
}

.future-section li {
  display: flex;
  flex-direction: column;
  padding: 18px;
  border-radius: 13px;
  background: rgb(255 255 255 / 72%);
}

.future-section li span {
  margin-top: 5px;
  color: #67716c;
  font-size: 13px;
  line-height: 1.5;
}

@media (max-width: 760px) {
  .about-container {
    padding: 36px 18px 64px;
  }

  .about-hero {
    padding: 32px 25px;
  }

  .about-section {
    grid-template-columns: 1fr;
    gap: 22px;
    padding: 42px 0;
  }

  .feature-list,
  .implementation-grid,
  .future-section ol {
    grid-template-columns: 1fr;
  }

  .implementation-grid article {
    min-height: 0;
  }

  .future-section {
    padding: 30px 24px;
  }
}
</style>
