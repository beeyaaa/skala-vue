import axios from 'axios'

import { toWeatherType } from '../views/views-clothes/clothesWeatherData.js'

// [Hands-on 8 요구사항] API Key를 브라우저에 내려보내지 않음.
// api/owm.js 서버리스 함수가 서버 환경변수의 키를 붙여 대신 호출
const client = axios.create({
  baseURL: '/api/owm',
  timeout: 8000,
})

// 모든 요청에 공통으로 붙는 파라미터 (섭씨 고정 + 한국어 설명)
const commonParams = () => ({
  units: 'metric',
  lang: 'kr',
})

// [Hands-on 6 요구사항 1.] 좌표 기반 현재 날씨 조회
export const fetchCityWeather = async (city) => {
  const { data } = await client.get('', {
    params: { endpoint: 'weather', lat: city.lat, lon: city.lon, ...commonParams() },
  })

  return {
    // 원본 데이터는 항상 섭씨로 저장, ℉ 변환은 configStore가 담당
    temp: Math.round(data.main.temp),
    humidity: data.main.humidity,
    wind: Math.round(data.wind.speed * 10) / 10,
    status: data.weather[0].description,
    weatherType: toWeatherType(data.weather[0].main, data.clouds?.all ?? 0),
  }
}

// [Hands-on 6 확장] 같은 OpenWeather Key로 현재 대기오염 정보 조회.
// 응답의 PM2.5·PM10 실측 농도(µg/m³)는 화면에서 국내 기준 등급으로 재해석
export const fetchCityAirQuality = async (city) => {
  const { data } = await client.get('', {
    params: { endpoint: 'air_pollution', lat: city.lat, lon: city.lon },
  })

  const measurement = data.list?.[0]
  if (!measurement) throw new Error('대기질 측정값이 없습니다.')

  return {
    aqi: measurement.main?.aqi ?? null,
    pm10: Math.round(measurement.components?.pm10 ?? 0),
    pm25: Math.round(measurement.components?.pm2_5 ?? 0),
    measuredAt: measurement.dt ? new Date(measurement.dt * 1000) : new Date(),
  }
}

// [Hands-on 6 요구사항 2.] 같은 서비스의 다른 API를 추가해 기능 확장 (3시간 단위 예보)
// 주의: dt_txt는 UTC 기준 문자열 → 도시 timezone(초 단위 오프셋)을 더해
// 현지 시각으로 변환해야 "아침 · 낮 · 밤" 표기가 정확함
// 아침·낮·저녁이 모두 포함된 하루를 고르도록 기본 48시간(16개 슬롯) 수신
export const fetchCityForecast = async (city, slots = 16) => {
  const { data } = await client.get('', {
    params: { endpoint: 'forecast', lat: city.lat, lon: city.lon, ...commonParams() },
  })

  const offsetSeconds = data.city?.timezone ?? 0

  return data.list.slice(0, slots).map((slot) => {
    // dt(UTC 초) + 도시 오프셋을 UTC 게터로 읽으면 현지 시각
    const localDate = new Date((slot.dt + offsetSeconds) * 1000)
    const hour = localDate.getUTCHours()
    const year = localDate.getUTCFullYear()
    const month = localDate.getUTCMonth() + 1
    const day = localDate.getUTCDate()

    return {
      // 상세 화면에서 같은 현지 날짜의 예보끼리 묶을 때 사용
      dateKey: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      dateLabel: `${month}월 ${day}일`,
      hour,
      timeLabel: `${hour}시`,
      partLabel: describeDayPart(hour),
      temp: Math.round(slot.main.temp),
      status: slot.weather[0].description,
      weatherType: toWeatherType(slot.weather[0].main, slot.clouds?.all ?? 0),
      // pop은 강수 확률(0~1) — 우산 안내 표시에 사용
      rainChance: Math.round((slot.pop ?? 0) * 100),
    }
  })
}

// 현지 시각을 사람이 읽는 시간대 이름으로 변환
const describeDayPart = (hour) => {
  if (hour < 6) return '새벽'
  if (hour < 11) return '아침'
  if (hour < 17) return '낮'
  if (hour < 21) return '저녁'
  return '밤'
}

// [Hands-on 6 요구사항 2.] Geocoding API로 내장 목록에 없는 지역까지 검색.
// 한글 질의 그대로 지원(예: 성남 → Seongnam-si), local_names.ko로 한글 이름 수신
export const searchCities = async (query) => {
  const { data } = await client.get('', {
    params: { endpoint: 'geo', q: query, limit: 5 },
  })

  return data
    .filter((item) => item.country === 'KR')
    .map((item) => ({
      // 동일 좌표 재검색 시 중복 누적을 막기 위해 좌표 기반 ID 사용
      id: `geo_${item.lat.toFixed(3)}_${item.lon.toFixed(3)}`,
      name: item.local_names?.ko ?? item.name,
      fullName: item.local_names?.ko ?? item.name,
      lat: item.lat,
      lon: item.lon,
    }))
}
