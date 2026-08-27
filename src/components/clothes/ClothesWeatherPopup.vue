<script setup>
import {
  PhCloud,
  PhCloudRain,
  PhCloudSun,
  PhLeaf,
  PhPants,
  PhSun,
  PhTShirt,
  PhX,
} from '@phosphor-icons/vue'
import { computed } from 'vue'

import { useConfigStore } from '../../stores/configStore.js'
import { splitSentences } from '../../views/views-clothes/clothesWeatherData.js'

// [오늘 뭐 입지? 팝업] 부모 View가 선택한 도시와 계산된 추천 정보를 Props로 수신
const props = defineProps({
  city: {
    type: Object,
    required: true,
  },
  recommendation: {
    type: Object,
    required: true,
  },
})

// 팝업 닫기·상세 화면 이동은 부모 View가 처리하도록 커스텀 이벤트 전달
defineEmits(['close', 'show-detail'])

const iconByWeather = {
  sunny: PhSun,
  partlyCloudy: PhCloudSun,
  rainy: PhCloudRain,
  cloudy: PhCloud,
}

const weatherIcon = computed(() => iconByWeather[props.city.weatherType] ?? PhCloud)

// [Hands-on 5 요구사항 3.] 팝업도 Navigation Bar의 단위 설정을 동일 적용
const configStore = useConfigStore()
const displayTemp = computed(() => configStore.convertTemperature(props.city.temp))

// 추천 근거는 문장 단위로 줄바꿈해 가독성 확보
const reasonSentences = computed(() => splitSentences(props.recommendation.reason))
</script>

<template>
  <!-- 배경 클릭 시 닫힘, 팝업 내부 클릭은 .stop으로 버블링 차단 -->
  <div class="popup-overlay" role="dialog" aria-modal="true" @click="$emit('close')">
    <article class="weather-popup" @click.stop>
      <button class="close-button" type="button" aria-label="팝업 닫기" @click="$emit('close')">
        <PhX :size="27" weight="light" aria-hidden="true" />
      </button>

      <div class="popup-grid">
        <section class="weather-summary">
          <h2>{{ city.name }}</h2>

          <div class="temperature-row">
            <strong
              >{{ displayTemp }}<small>{{ configStore.unitSymbol }}</small></strong
            >
            <div class="condition">
              <component :is="weatherIcon" :size="60" weight="light" aria-hidden="true" />
              <span>{{ city.status }}</span>
            </div>
          </div>

          <div class="reason-row">
            <span class="round-icon"><PhLeaf :size="25" weight="light" /></span>
            <p>
              <span v-for="sentence in reasonSentences" :key="sentence">{{ sentence }}</span>
            </p>
          </div>
        </section>

        <section class="outfit-summary">
          <div class="summary-row">
            <span class="round-icon"><PhTShirt :size="27" weight="light" /></span>
            <div>
              <p>오늘 입기 한 줄 요약</p>
              <strong>{{ recommendation.title }}</strong>
            </div>
          </div>

          <div class="summary-row">
            <span class="round-icon"><PhPants :size="27" weight="light" /></span>
            <div>
              <p>추천 옷차림</p>
              <strong>{{ recommendation.clothes.join(' · ') }}</strong>
            </div>
          </div>

          <div class="summary-row">
            <span class="round-icon"><PhCloudSun :size="27" weight="light" /></span>
            <div>
              <p>챙기면 좋은 준비물</p>
              <strong>{{ recommendation.items.join(' · ') }}</strong>
            </div>
          </div>
        </section>
      </div>

      <button class="detail-button" type="button" @click="$emit('show-detail')">
        상세 날씨 보기
      </button>
    </article>
  </div>
</template>

<style scoped>
.popup-overlay {
  position: absolute;
  z-index: 30;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 32px;
  background: rgb(232 239 242 / 25%);
  backdrop-filter: blur(1.5px);
  cursor: pointer;
}

.weather-popup {
  position: relative;
  /* 추천 근거가 문장 단위로 한 줄에 들어가도록 팝업 폭 확보 */
  width: min(100%, 820px);
  padding: 42px 36px 30px;
  border: 1px solid rgb(48 55 52 / 12%);
  border-radius: 22px;
  background: rgb(253 252 248 / 97%);
  box-shadow:
    0 28px 65px rgb(42 49 46 / 19%),
    inset 0 1px 0 #ffffff;
  color: #292f2c;
  cursor: default;

  /*
    한글 기본 줄바꿈은 글자 단위 → '추천해 / 요'처럼 어절이 쪼개짐.
    keep-all로 띄어쓰기 단위로만 분리, 한 어절이 과도하게 길 때만 예외 허용.
    두 속성 모두 상속되므로 팝업 내부 전체 문구에 일괄 적용
  */
  word-break: keep-all;
  overflow-wrap: break-word;
}

.close-button {
  position: absolute;
  top: 18px;
  right: 20px;
  display: grid;
  place-items: center;
  padding: 4px;
  border: 0;
  background: transparent;
  color: #737a76;
  cursor: pointer;
}

.popup-grid {
  display: grid;
  /* 설명 문장이 들어가는 왼쪽 영역에 더 넓은 비율 배정 */
  grid-template-columns: 1.15fr 0.85fr;
  gap: 32px;
}

.weather-popup h2 {
  margin: 0 0 12px;
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -0.04em;
}

.weather-summary {
  padding-right: 32px;
  border-right: 1px solid #dde0dc;
}

.temperature-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding-bottom: 26px;
  border-bottom: 1px solid #d9ddda;
}

.temperature-row > strong {
  flex: 0 0 auto;
  font-size: 62px;
  font-weight: 750;
  letter-spacing: -0.065em;
  line-height: 1;
}

.temperature-row small {
  font-size: 29px;
  font-weight: 550;
  letter-spacing: -0.03em;
}

.condition {
  display: flex;
  align-items: center;
  flex-direction: column;
  /* 기온을 먼저 배치, 남는 폭 안에서 날씨 설명이 줄바꿈되도록 처리 */
  flex: 0 1 auto;
  min-width: 0;
  gap: 4px;
  color: #252c29;
}

.condition span {
  font-size: 13px;
  line-height: 1.35;
  text-align: center;
  /*
    '약간의 구름이 낀 하늘' 같은 긴 한글 설명이 '하 / 늘'로 잘리지 않도록
    어절(띄어쓰기) 단위로만 줄바꿈
  */
  word-break: keep-all;
  overflow-wrap: break-word;
}

.reason-row,
.summary-row {
  display: flex;
  align-items: center;
  gap: 14px;
}

.reason-row {
  padding-top: 24px;
}

.reason-row p span {
  /* 마침표로 분리된 문장마다 한 줄 점유, 문장 내부 줄바꿈 없음 */
  display: block;
  white-space: nowrap;
}

.reason-row p {
  margin: 0;
  color: #5d6661;
  font-size: 13px;
  line-height: 1.55;
}

.round-icon {
  display: grid;
  flex: 0 0 46px;
  width: 46px;
  height: 46px;
  place-items: center;
  border-radius: 50%;
  background: #edf1e5;
  color: #596b37;
}

.outfit-summary {
  display: flex;
  flex-direction: column;
}

.summary-row {
  flex: 1;
  padding: 15px 0;
  border-bottom: 1px solid #dfe2de;
}

.summary-row:last-child {
  border-bottom: 0;
}

.summary-row p {
  margin: 0 0 3px;
  color: #7a817d;
  font-size: 11px;
}

.summary-row strong {
  display: block;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.025em;
  line-height: 1.4;
}

.detail-button {
  width: 100%;
  margin-top: 25px;
  padding: 15px 16px;
  border: 0;
  border-radius: 9px;
  background: #242b2e;
  color: #ffffff;
  font-family: inherit;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: background 160ms ease;
}

.detail-button:hover {
  background: #3d484c;
}

@media (max-width: 720px) {
  .popup-overlay {
    align-items: end;
    padding: 14px;
  }

  .weather-popup {
    max-height: calc(100% - 14px);
    overflow-y: auto;
    padding: 36px 24px 24px;
  }

  .popup-grid {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  /* 작은 화면에서 넘침 방지를 위해 어절 단위 자동 줄바꿈 허용 */
  .reason-row p span {
    white-space: normal;
  }

  .weather-summary {
    padding-right: 0;
    border-right: 0;
  }

  .temperature-row > strong {
    font-size: 52px;
  }
}
</style>
