// [Hands-on 8] OpenWeatherMap 중계 함수
//
// 키는 서버 환경변수에서만 읽어 이 함수 안에서 주입.
// 배포된 JS에 키가 포함되지 않음
//
// 임의 경로 중계 시 공개 프록시로 악용될 수 있어
// 실제 사용하는 4개 엔드포인트만 허용
const ALLOWED_PATHS = {
  weather: 'https://api.openweathermap.org/data/2.5/weather',
  forecast: 'https://api.openweathermap.org/data/2.5/forecast',
  air_pollution: 'https://api.openweathermap.org/data/2.5/air_pollution',
  geo: 'https://api.openweathermap.org/geo/1.0/direct',
}

// 클라이언트가 넘길 수 있는 파라미터도 화이트리스트로 제한
const ALLOWED_PARAMS = ['lat', 'lon', 'q', 'limit', 'units', 'lang']

export default async function handler(request, response) {
  // Vercel은 req.query를 채워 주지만 개발 서버에서는 직접 파싱 필요
  const url = new URL(request.url, 'http://localhost')
  const endpoint = url.searchParams.get('endpoint')
  const target = ALLOWED_PATHS[endpoint]

  if (!target) {
    response.statusCode = 400
    response.setHeader('content-type', 'application/json; charset=utf-8')
    return response.end(JSON.stringify({ message: '허용되지 않은 endpoint입니다.' }))
  }

  const apiKey = process.env.OPENWEATHER_API_KEY
  if (!apiKey) {
    response.statusCode = 503
    response.setHeader('content-type', 'application/json; charset=utf-8')
    return response.end(JSON.stringify({ message: 'OPENWEATHER_API_KEY가 설정되지 않았습니다.' }))
  }

  const upstream = new URL(target)
  ALLOWED_PARAMS.forEach((name) => {
    const value = url.searchParams.get(name)
    if (value !== null) upstream.searchParams.set(name, value)
  })
  upstream.searchParams.set('appid', apiKey)

  try {
    const upstreamResponse = await fetch(upstream)
    const body = await upstreamResponse.text()

    response.statusCode = upstreamResponse.status
    response.setHeader('content-type', 'application/json; charset=utf-8')
    // 동일 좌표 반복 조회 시 상위 캐시를 활용해 호출량 절감
    response.setHeader('cache-control', 's-maxage=300, stale-while-revalidate=600')
    return response.end(body)
  } catch {
    response.statusCode = 502
    response.setHeader('content-type', 'application/json; charset=utf-8')
    return response.end(JSON.stringify({ message: '날씨 서버에 연결하지 못했습니다.' }))
  }
}
