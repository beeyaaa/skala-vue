import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { fetchActiveWeatherWarnings } from '../api/kmaWarningApi.js'
import {
  fetchCityAirQuality,
  fetchCityForecast,
  fetchCityWeather,
  searchCities,
} from '../api/weatherApi.js'
import {
  clothesWeatherList,
  weatherTypeLabels,
  weatherTypeOrder,
} from '../views/views-clothes/clothesWeatherData.js'

// [Hands-on 5 요구사항 4.] 본인 추가 Store — 지도와 상세 View가 같은 날씨 상태를 공유
export const useWeatherStore = defineStore('weather', () => {
  // state: API 연동 전에는 Mock Data로 시작, 응답 수신 시 같은 배열을 갱신
  const weatherList = ref([...clothesWeatherList])
  const searchQuery = ref('')
  const selectedCityId = ref(null)
  const selectedWeatherType = ref('전체')

  // [Hands-on 6] 비동기 통신의 진행/실패 상태를 화면에 알리기 위한 state
  const isLoading = ref(false)
  const errorMessage = ref('')
  const dataSource = ref('mock')
  const lastUpdatedAt = ref(null)

  // [Hands-on 6 요구사항 2.] 도시별 시간대 예보 — 같은 도시 재진입 시 재요청하지 않도록 캐시
  const forecastByCity = ref({})
  const isForecastLoading = ref(false)
  const forecastError = ref('')

  // [Hands-on 6 확장] 도시별 대기질·기상특보도 Store에서 관리.
  // 상세 View 재진입 시 불필요한 API 요청을 막기 위해 도시 ID를 Key로 캐시
  const airQualityByCity = ref({})
  const isAirQualityLoading = ref(false)
  const airQualityError = ref('')
  const warningsByCity = ref({})
  const isWarningsLoading = ref(false)
  const warningsError = ref('')

  // [Hands-on 6 요구사항 2.] 내장 22개 목록에 없는 지역의 검색 결과.
  // 검색으로 찾은 임시 도시 — weatherList에 섞지 않아 새로고침 시 소멸
  const externalCities = ref([])
  const isSearchingExternal = ref(false)
  let searchTimer = null

  // getter: 검색어와 날씨 상태 필터를 모두 만족하는 도시만 지도에 표시
  const filteredWeatherList = computed(() => {
    const query = searchQuery.value.trim()

    return weatherList.value.filter((city) => {
      const matchesQuery = !query || city.name.includes(query) || city.fullName.includes(query)
      const matchesWeather =
        selectedWeatherType.value === '전체' || city.weatherType === selectedWeatherType.value

      return matchesQuery && matchesWeather
    })
  })

  // [Hands-on 6 대비] 필터 버튼을 하드코딩하지 않고 현재 데이터에서 직접 생성.
  // 실시간 API로 '비'·'눈'이 내려와도 버튼이 자동 반영
  const weatherTypeFilters = computed(() => {
    const usedTypes = new Set(weatherList.value.map((city) => city.weatherType))

    const options = weatherTypeOrder
      .filter((type) => usedTypes.has(type))
      .map((type) => ({ value: type, label: weatherTypeLabels[type] }))

    return [{ value: '전체', label: '전체' }, ...options]
  })

  // getter: 선택된 ID를 실제 도시 객체로 변환
  // 내장 도시와 검색으로 추가된 임시 도시를 함께 조회
  const allCities = computed(() => [...weatherList.value, ...externalCities.value])

  const selectedCity = computed(() => {
    return allCities.value.find((city) => city.id === selectedCityId.value) ?? null
  })

  const findCityById = (cityId) => {
    return allCities.value.find((city) => city.id === cityId) ?? null
  }

  // actions: 상태 변경 지점을 Store 함수로 집약해 변경 흐름을 명확화
  const selectCity = (cityId) => {
    selectedCityId.value = cityId
  }

  const clearSelectedCity = () => {
    selectedCityId.value = null
  }

  const updateSearchQuery = (query) => {
    searchQuery.value = query
    clearSelectedCity()
    scheduleExternalSearch()
  }

  // 검색어를 비우면 임시 마커도 함께 제거
  const clearExternalCities = () => {
    externalCities.value = []
  }

  // 내장 목록에서 결과가 나오면 API 호출 생략.
  // 결과가 없을 때만 타이핑이 멈춘 뒤 Geocoding API를 1회 호출
  const scheduleExternalSearch = () => {
    clearTimeout(searchTimer)
    clearExternalCities()

    const query = searchQuery.value.trim()
    if (query.length < 2 || filteredWeatherList.value.length > 0) return

    searchTimer = setTimeout(async () => {
      isSearchingExternal.value = true

      try {
        const found = await searchCities(query)
        // 이미 지도에 있는 도시는 제외, 호출 수 절감을 위해 상위 3곳만 표시
        const targets = found
          .filter((item) => !weatherList.value.some((city) => city.id === item.id))
          .slice(0, 3)

        // 날씨까지 확보해야 마커 기온 표시와 즉시 팝업 오픈이 가능
        const settled = await Promise.allSettled(targets.map((item) => fetchCityWeather(item)))

        // 검색어가 변경된 경우 뒤늦게 도착한 결과는 폐기
        if (searchQuery.value.trim() !== query) return

        externalCities.value = targets
          .map((item, index) =>
            settled[index].status === 'fulfilled'
              ? { ...item, ...settled[index].value, isExternal: true }
              : null,
          )
          .filter(Boolean)
      } catch {
        clearExternalCities()
      } finally {
        isSearchingExternal.value = false
      }
      // 타이핑이 멈춘 것으로 볼 수 있는 최소 간격(ms).
      // 너무 짧으면 글자마다 API를 호출하고, 너무 길면 반응이 느리게 느껴짐
    }, 450)
  }

  const updateWeatherType = (weatherType) => {
    selectedWeatherType.value = weatherType
    clearSelectedCity()
  }

  // [Hands-on 6 요구사항 1.] 22개 도시의 실제 날씨를 병렬 조회해 Mock Data를 대체
  // 지도·상세 View 양쪽에서 호출되므로 최근 수신 값이 있으면 재호출 생략
  const FRESH_FOR_MS = 10 * 60 * 1000

  const fetchLiveWeather = async ({ force = false } = {}) => {
    if (isLoading.value) return

    const isFresh =
      dataSource.value === 'api' &&
      lastUpdatedAt.value &&
      Date.now() - lastUpdatedAt.value.getTime() < FRESH_FOR_MS

    if (isFresh && !force) return

    isLoading.value = true
    errorMessage.value = ''

    // allSettled 사용 → 일부 도시가 실패해도 나머지 결과는 그대로 반영
    const results = await Promise.allSettled(
      weatherList.value.map((city) => fetchCityWeather(city)),
    )

    let successCount = 0

    weatherList.value = weatherList.value.map((city, index) => {
      const result = results[index]

      // 실패한 도시는 기존 Mock 값 유지 → 화면 공백 방지
      if (result.status !== 'fulfilled') return city

      successCount += 1
      return { ...city, ...result.value }
    })

    if (successCount === 0) {
      errorMessage.value = '실시간 날씨를 불러오지 못해 임시 데이터를 표시합니다.'
    } else {
      dataSource.value = 'api'
      lastUpdatedAt.value = new Date()

      if (successCount < results.length) {
        errorMessage.value = `${results.length - successCount}개 도시는 임시 데이터를 표시합니다.`
      }
    }

    // 데이터 변경으로 선택된 필터가 사라질 수 있어 안전하게 초기화
    const availableTypes = weatherTypeFilters.value.map((filter) => filter.value)
    if (!availableTypes.includes(selectedWeatherType.value)) {
      selectedWeatherType.value = '전체'
    }

    isLoading.value = false
  }

  // [Hands-on 6 요구사항 2.] 상세 화면 진입 시 해당 도시의 3시간 단위 예보만 1건 호출.
  // 지도에서 22개를 일괄 호출하지 않아 무료 호출 한도에 여유 확보
  const fetchForecast = async (cityId) => {
    const city = findCityById(cityId)
    if (!city) return

    // 이미 수신한 도시는 캐시를 그대로 사용.
    // 예보 데이터 구조가 바뀐 경우 날짜 정보가 포함된 새 형식으로 재수신
    const cachedForecast = forecastByCity.value[cityId]
    const hasCurrentForecastShape =
      Array.isArray(cachedForecast) && cachedForecast.length > 0 && cachedForecast[0].dateKey
    if (hasCurrentForecastShape) return

    isForecastLoading.value = true
    forecastError.value = ''

    try {
      const slots = await fetchCityForecast(city)
      forecastByCity.value = { ...forecastByCity.value, [cityId]: slots }
    } catch {
      forecastError.value = '시간대별 예보를 불러오지 못했습니다.'
    } finally {
      isForecastLoading.value = false
    }
  }

  // OpenWeather Air Pollution API에서 PM2.5·PM10 농도 조회
  const fetchAirQuality = async (cityId) => {
    const city = findCityById(cityId)
    if (!city || airQualityByCity.value[cityId]) return

    isAirQualityLoading.value = true
    airQualityError.value = ''

    try {
      const measurement = await fetchCityAirQuality(city)
      airQualityByCity.value = { ...airQualityByCity.value, [cityId]: measurement }
    } catch {
      airQualityError.value = '미세먼지 정보를 불러오지 못했습니다.'
    } finally {
      isAirQualityLoading.value = false
    }
  }

  // 기상청 현재 특보 중 선택 도시 관련 특보만 추출해 안전 모드에 사용
  const fetchWeatherWarnings = async (cityId) => {
    const city = findCityById(cityId)
    if (!city || warningsByCity.value[cityId]) return

    isWarningsLoading.value = true
    warningsError.value = ''

    try {
      const warnings = await fetchActiveWeatherWarnings(city)
      warningsByCity.value = { ...warningsByCity.value, [cityId]: warnings }
    } catch {
      warningsError.value = '기상특보 정보를 불러오지 못했습니다.'
    } finally {
      isWarningsLoading.value = false
    }
  }

  // 상세 화면에서 두 안전 데이터를 대기 없이 동시 요청.
  // 한 API가 실패해도 다른 API 결과는 정상 반영
  const fetchSafetyData = async (cityId) => {
    await Promise.allSettled([fetchAirQuality(cityId), fetchWeatherWarnings(cityId)])
  }

  return {
    weatherList,
    searchQuery,
    selectedCityId,
    selectedWeatherType,
    isLoading,
    errorMessage,
    dataSource,
    lastUpdatedAt,
    filteredWeatherList,
    weatherTypeFilters,
    selectedCity,
    findCityById,
    selectCity,
    clearSelectedCity,
    updateSearchQuery,
    updateWeatherType,
    externalCities,
    isSearchingExternal,
    clearExternalCities,
    fetchLiveWeather,
    forecastByCity,
    isForecastLoading,
    forecastError,
    fetchForecast,
    airQualityByCity,
    isAirQualityLoading,
    airQualityError,
    warningsByCity,
    isWarningsLoading,
    warningsError,
    fetchAirQuality,
    fetchWeatherWarnings,
    fetchSafetyData,
  }
})
