// AirKorea의 PM10·PM2.5 농도 구간을 기준으로 각각 등급 산정.
// 두 값의 등급이 다르면 건강 보호를 위해 더 나쁜 등급을 최종 등급으로 채택
const LEVELS = [
  {
    key: 'good',
    label: '좋음',
    advice: '대기질이 좋아 평소처럼 야외 활동을 해도 좋아요.',
    needsMask: false,
  },
  {
    key: 'normal',
    label: '보통',
    advice: '대기질이 무난해 일반적인 야외 활동이 가능해요.',
    needsMask: false,
  },
  {
    key: 'bad',
    label: '나쁨',
    advice: '장시간 야외 활동을 줄이고 민감군은 보건용 마스크를 준비하세요.',
    needsMask: true,
  },
  {
    key: 'very-bad',
    label: '매우 나쁨',
    advice: '야외 활동을 가급적 피하고 외출 시 보건용 마스크를 착용하세요.',
    needsMask: true,
  },
]

// 환경부 대기환경기준 4단계 구간 (㎍/㎥)
// 좋음 0~30 · 보통 31~80 · 나쁨 81~150 · 매우 나쁨 151 이상
const gradePm10 = (value) => {
  if (value <= 30) return 0
  if (value <= 80) return 1
  if (value <= 150) return 2
  return 3
}

// PM2.5는 입자가 작아 같은 농도라도 더 유해 → PM10보다 낮은 기준 적용
// 좋음 0~15 · 보통 16~35 · 나쁨 36~75 · 매우 나쁨 76 이상
const gradePm25 = (value) => {
  if (value <= 15) return 0
  if (value <= 35) return 1
  if (value <= 75) return 2
  return 3
}

export const createAirQualitySummary = (measurement) => {
  if (!measurement) return null

  const levelIndex = Math.max(gradePm10(measurement.pm10), gradePm25(measurement.pm25))

  return {
    ...LEVELS[levelIndex],
    pm10: measurement.pm10,
    pm25: measurement.pm25,
    measuredAt: measurement.measuredAt,
  }
}
