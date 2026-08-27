// [오늘 뭐 입지? Mock Data]
// Router 과제 단계에서는 API 대신 고정 데이터 사용, Axios 실습에서 실시간 데이터로 교체
//
// labelDx: 라벨이 다른 마커와 겹칠 때 "라벨만" 좌우로 미는 값(px).
//          앵커 점(위경도로 계산한 실제 위치)은 움직이지 않으므로 위치 정확도는 유지됨
export const clothesWeatherList = [
  {
    id: 'city_01',
    name: '서울',
    fullName: '서울특별시',
    temp: 28,
    status: '맑음',
    weatherType: 'sunny',
    humidity: 55,
    wind: 2.5,
    lat: 37.5665,
    lon: 126.978,
    x: 38,
    y: 18,
  },
  {
    id: 'city_02',
    name: '수원',
    fullName: '경기도 수원시',
    temp: 24,
    status: '구름',
    weatherType: 'cloudy',
    humidity: 68,
    wind: 2.1,
    lat: 37.2636,
    lon: 127.0286,
    // 인천 앵커 점을 가려서 오른쪽으로 (38px)
    labelDx: 38,
    x: 38,
    y: 30,
  },
  {
    id: 'city_03',
    name: '부산',
    fullName: '부산광역시',
    temp: 26,
    status: '구름',
    weatherType: 'cloudy',
    humidity: 65,
    wind: 5,
    lat: 35.1796,
    lon: 129.0756,
    x: 75,
    y: 81,
    // 창원 라벨과 겹쳐 오른쪽으로 (32px)
    labelDx: 32,
  },
  {
    id: 'city_04',
    name: '춘천',
    fullName: '강원특별자치도 춘천시',
    temp: 30,
    status: '맑음',
    weatherType: 'sunny',
    humidity: 52,
    wind: 1.8,
    lat: 37.8813,
    lon: 127.7298,
    x: 52,
    y: 16,
  },
  {
    id: 'city_05',
    name: '제주',
    fullName: '제주특별자치도 제주시',
    temp: 22,
    status: '흐림',
    weatherType: 'cloudy',
    humidity: 72,
    wind: 3.2,
    lat: 33.4996,
    lon: 126.5312,
    x: 18,
    y: 93,
  },
  {
    id: 'city_06',
    name: '백령도',
    fullName: '인천광역시 옹진군 백령도',
    temp: 24,
    status: '구름',
    weatherType: 'cloudy',
    humidity: 74,
    wind: 5.3,
    lat: 37.974,
    lon: 124.63,
    // 화면 왼쪽 끝에서 잘려 오른쪽으로 (45px)
    labelDx: 45,
  },
  {
    id: 'city_07',
    name: '인천',
    fullName: '인천광역시',
    temp: 27,
    status: '구름 조금',
    weatherType: 'partlyCloudy',
    humidity: 61,
    wind: 3.4,
    lat: 37.4563,
    lon: 126.7052,
    x: 29,
    y: 27,
    // 서울·수원 라벨과 겹쳐 왼쪽으로 (-60px)
    labelDx: -60,
  },
  {
    id: 'city_08',
    name: '강릉',
    fullName: '강원특별자치도 강릉시',
    temp: 29,
    status: '구름 조금',
    weatherType: 'partlyCloudy',
    humidity: 58,
    wind: 2.8,
    lat: 37.7519,
    lon: 128.8761,
    x: 66,
    y: 13,
  },
  {
    id: 'city_09',
    name: '청주',
    fullName: '충청북도 청주시',
    temp: 31,
    status: '맑음',
    weatherType: 'sunny',
    humidity: 49,
    wind: 1.6,
    lat: 36.6424,
    lon: 127.489,
    x: 53,
    y: 34,
  },
  {
    id: 'city_10',
    name: '홍성',
    fullName: '충청남도 홍성군',
    temp: 28,
    status: '맑음',
    weatherType: 'sunny',
    humidity: 54,
    wind: 2.2,
    lat: 36.6012,
    lon: 126.6608,
    x: 34,
    y: 42,
  },
  {
    id: 'city_11',
    name: '대전',
    fullName: '대전광역시',
    temp: 32,
    status: '구름',
    weatherType: 'cloudy',
    humidity: 50,
    wind: 2.4,
    lat: 36.3504,
    lon: 127.3845,
    x: 47,
    y: 43,
  },
  {
    id: 'city_12',
    name: '안동',
    fullName: '경상북도 안동시',
    temp: 32,
    status: '맑음',
    weatherType: 'sunny',
    humidity: 47,
    wind: 1.9,
    lat: 36.5684,
    lon: 128.7294,
    x: 64,
    y: 42,
  },
  {
    id: 'city_13',
    name: '전주',
    fullName: '전북특별자치도 전주시',
    temp: 33,
    status: '맑음',
    weatherType: 'sunny',
    humidity: 48,
    wind: 1.5,
    lat: 35.8242,
    lon: 127.148,
    x: 27,
    y: 61,
  },
  {
    id: 'city_14',
    name: '포항',
    fullName: '경상북도 포항시',
    temp: 30,
    status: '구름 조금',
    weatherType: 'partlyCloudy',
    humidity: 60,
    wind: 3.1,
    lat: 36.019,
    lon: 129.3435,
    x: 77,
    y: 53,
    // 대구 라벨과 맞닿아 오른쪽으로 (14px)
    labelDx: 14,
  },
  {
    id: 'city_15',
    name: '울산',
    fullName: '울산광역시',
    temp: 29,
    status: '구름 조금',
    weatherType: 'partlyCloudy',
    humidity: 62,
    wind: 3.8,
    lat: 35.5384,
    lon: 129.3114,
    x: 80,
    y: 67,
  },
  {
    id: 'city_16',
    name: '목포',
    fullName: '전라남도 목포시',
    temp: 28,
    status: '구름',
    weatherType: 'cloudy',
    humidity: 70,
    wind: 4.2,
    lat: 34.8118,
    lon: 126.3922,
    x: 19,
    y: 76,
  },
  {
    id: 'city_17',
    name: '광주',
    fullName: '광주광역시',
    temp: 31,
    status: '맑음',
    weatherType: 'sunny',
    humidity: 52,
    wind: 1.7,
    lat: 35.1595,
    lon: 126.8526,
    x: 31,
    y: 74,
  },
  {
    id: 'city_18',
    name: '여수',
    fullName: '전라남도 여수시',
    temp: 29,
    status: '맑음',
    weatherType: 'sunny',
    humidity: 67,
    wind: 4.4,
    lat: 34.7604,
    lon: 127.6622,
    x: 37,
    y: 88,
  },
  {
    id: 'city_19',
    name: '창원',
    fullName: '경상남도 창원시',
    temp: 28,
    status: '구름',
    weatherType: 'cloudy',
    humidity: 64,
    wind: 2.9,
    lat: 35.2279,
    lon: 128.6811,
    x: 59,
    y: 88,
    // 부산 라벨과 겹쳐 왼쪽으로 (-32px)
    labelDx: -32,
  },
  {
    id: 'city_20',
    name: '대구',
    fullName: '대구광역시',
    temp: 33,
    status: '맑음',
    weatherType: 'sunny',
    humidity: 45,
    wind: 1.4,
    lat: 35.8714,
    lon: 128.6014,
    x: 64,
    y: 58,
  },
  {
    id: 'city_21',
    name: '울릉도',
    fullName: '경상북도 울릉군 울릉도',
    temp: 26,
    status: '구름',
    weatherType: 'cloudy',
    humidity: 75,
    wind: 5.6,
    lat: 37.4845,
    lon: 130.9057,
    offMap: true,
    x: 84,
    y: 22,
  },
  {
    id: 'city_22',
    name: '독도',
    fullName: '경상북도 울릉군 독도',
    temp: 25,
    status: '구름',
    weatherType: 'cloudy',
    humidity: 77,
    wind: 6.1,
    lat: 37.2411,
    lon: 131.8653,
    offMap: true,
    x: 92,
    y: 33,
    // 포항 라벨과 맞닿아 왼쪽으로 (-16px)
    labelDx: -16,
  },
]

// [지도 좌표계]
// public/images/south-korea-map.svg 는 viewBox 800x1200 이지만, 실제로 지형이 그려진(잉크가 찍히는)
// 영역은 x 106~708 / y 19~1175 뿐이다. 아래 값은 Canvas로 픽셀을 직접 스캔해 측정했다.
const MAP_INK = {
  left: 106 / 800,
  right: 708 / 800,
  top: 19 / 1200,
  bottom: 1175 / 1200,
}

// 잉크 영역이 프레임을 정확히 채우도록 이미지를 확대하고 왼쪽/위쪽 여백만큼 끌어올린다.
const inkWidth = MAP_INK.right - MAP_INK.left
const inkHeight = MAP_INK.bottom - MAP_INK.top

export const MAP_FRAME = {
  // 지도 프레임이 Stage에서 차지하는 세로 비율. 가로는 아래 aspect로 자동 결정된다.
  top: 1,
  height: 96,
  // 잉크 영역의 실제 가로:세로 비율. 지도를 늘리지 않아 한반도 형태가 왜곡되지 않는다.
  aspect: (708 - 106) / (1175 - 19),
  // 프레임 안에서 이미지에 적용할 크기와 위치
  imageWidth: 100 / inkWidth,
  imageHeight: 100 / inkHeight,
  imageLeft: (-MAP_INK.left * 100) / inkWidth,
  imageTop: (-MAP_INK.top * 100) / inkHeight,
}

// 잉크 영역 네 모서리의 실제 위경도.
// 제주도 폭(126.16~126.96°E)과 지도 동단을 기준으로 역산했고, 결과를 아래 두 지점으로 검증했다.
//  - 본토 남단(y=942) → 34.29°N (해남 땅끝)
//  - 제주도 북단(y=1094) → 33.57°N (제주시)
export const MAP_BOUNDS = {
  lonMin: 126.137,
  lonMax: 129.576,
  latMin: 33.195,
  latMax: 38.62,
}

// 위경도를 지도 프레임 내부 비율로 바꾼 뒤 Stage 기준 비율로 옮긴다.
// 지도 이미지와 마커가 완전히 같은 변환을 거치므로 창 크기가 바뀌어도 어긋나지 않는다.
export const projectCityPosition = (city) => {
  return {
    x: ((city.lon - MAP_BOUNDS.lonMin) / (MAP_BOUNDS.lonMax - MAP_BOUNDS.lonMin)) * 100,
    y: ((MAP_BOUNDS.latMax - city.lat) / (MAP_BOUNDS.latMax - MAP_BOUNDS.latMin)) * 100,
  }
}

// 지도에 그려진 영역 안에 들어오는 좌표인지 확인한다.
// 울릉도·독도·백령도처럼 범위를 벗어나면 프레임 밖 고정 위치를 쓴다.
export const isInsideMap = (city) => {
  if (city.offMap) return false

  return (
    city.lon >= MAP_BOUNDS.lonMin &&
    city.lon <= MAP_BOUNDS.lonMax &&
    city.lat >= MAP_BOUNDS.latMin &&
    city.lat <= MAP_BOUNDS.latMax
  )
}

// [Hands-on 6 대비] 날씨 종류의 화면 표기와 정렬 순서를 한 곳에서 관리.
// 필터 버튼 목록은 이 표를 참고해 실제 데이터에서 자동 생성
export const weatherTypeLabels = {
  sunny: '맑음',
  partlyCloudy: '구름 조금',
  cloudy: '구름',
  rainy: '비',
  snowy: '눈',
  stormy: '천둥번개',
  foggy: '안개',
}

// 필터 버튼이 데이터 순서에 따라 뒤바뀌지 않도록 고정 정렬 기준 제공
export const weatherTypeOrder = Object.keys(weatherTypeLabels)

// [Hands-on 6 대비] OpenWeatherMap 응답을 프로젝트 내부 weatherType으로 변환.
// 아이콘·필터·옷차림 추천이 이 값 하나만 참조하도록 진입점 단일화
export const toWeatherType = (owmMain, cloudPercent = 0) => {
  switch (owmMain) {
    case 'Clear':
      return 'sunny'
    case 'Clouds':
      // OpenWeatherMap이 구름 양을 백분율로 함께 제공 → 두 단계로 구분
      return cloudPercent <= 50 ? 'partlyCloudy' : 'cloudy'
    case 'Rain':
    case 'Drizzle':
      return 'rainy'
    case 'Snow':
      return 'snowy'
    case 'Thunderstorm':
      return 'stormy'
    case 'Mist':
    case 'Fog':
    case 'Haze':
    case 'Smoke':
    case 'Dust':
    case 'Sand':
      return 'foggy'
    default:
      return 'cloudy'
  }
}

// 한 문단을 문장 단위로 분리.
// 마침표 뒤 공백에서만 분리 → "예상돼요." / "추천해요." 처럼 문장이 통째로 유지
export const splitSentences = (text) => {
  if (!text) return []

  return text
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)
}

// 기온과 날씨 상태를 입력받아 옷차림·준비물을 계산하는 일반 JavaScript 함수.
// 기온 구간은 '기온별 옷차림' 참고표의 8개 구간을 적용
export const createOutfitRecommendation = (city) => {
  if (!city) return null

  let title
  let clothes
  let reason

  if (city.temp >= 28) {
    title = '최대한 가볍고 시원하게'
    clothes = ['민소매', '반팔', '반바지', '원피스']
    reason = '더운 날씨가 예상돼요. 통풍이 잘되는 가벼운 옷을 추천해요.'
  } else if (city.temp >= 23) {
    title = '반팔 중심의 가벼운 옷차림'
    clothes = ['반팔', '얇은 셔츠', '반바지', '면바지']
    reason = '활동하기 좋은 따뜻한 날씨예요. 얇고 편안한 옷차림이 잘 맞아요.'
  } else if (city.temp >= 20) {
    title = '얇은 긴팔이나 가디건 한 겹'
    clothes = ['얇은 가디건', '긴팔', '면바지', '청바지']
    reason = '낮에는 온화하지만 아침저녁에는 선선할 수 있어요. 얇은 겉옷을 챙겨요.'
  } else if (city.temp >= 17) {
    title = '가벼운 니트와 겉옷 챙기기'
    clothes = ['얇은 니트', '맨투맨', '가디건', '청바지']
    reason = '선선함이 느껴지는 기온이에요. 체온을 조절할 수 있는 얇은 겉옷이 좋아요.'
  } else if (city.temp >= 12) {
    title = '쌀쌀함을 막아줄 재킷 필요'
    clothes = ['재킷', '가디건', '야상', '청바지']
    reason = '쌀쌀한 날씨예요. 바람을 막고 체온을 지켜줄 겉옷이 필요해요.'
  } else if (city.temp >= 9) {
    title = '도톰한 겉옷으로 따뜻하게'
    clothes = ['재킷', '트렌치코트', '야상', '니트']
    reason = '차가운 공기가 느껴지는 기온이에요. 도톰한 겉옷을 꼭 챙겨 주세요.'
  } else if (city.temp >= 5) {
    title = '코트와 보온 이너 챙기기'
    clothes = ['코트', '가죽 재킷', '히트텍', '니트']
    reason = '추위가 느껴지는 날씨예요. 보온 이너와 두꺼운 겉옷을 함께 입어요.'
  } else {
    title = '패딩과 방한용품으로 보온하기'
    clothes = ['패딩', '두꺼운 코트', '목도리', '기모 제품']
    reason = '매우 추운 날씨예요. 두꺼운 외투와 방한용품으로 체온을 지켜 주세요.'
  }

  // 기온으로 기본 옷차림 결정 후 비·햇빛·바람 조건에 맞는 준비물 추가
  const items = []
  if (city.weatherType === 'rainy' || city.status.includes('비')) items.push('우산', '방수 신발')
  if (city.status === '맑음' && city.temp >= 25) items.push('모자', '선크림')
  if (city.wind >= 4) items.push(city.temp <= 11 ? '목도리' : '바람막이')

  // 별도 기상 조건이 없어도 기온에 맞는 기본 준비물 안내
  if (items.length === 0) {
    if (city.temp >= 28) items.push('물')
    else if (city.temp >= 20) items.push('얇은 겉옷')
    else items.push('보온용품')
  }

  return { title, clothes, items, reason }
}
