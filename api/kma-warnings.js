// [Hands-on 8] 기상청 API 허브 특보현황 중계 함수
//
// 기상청 API 허브는 브라우저의 교차 출처 요청(CORS)을 허용하지 않아
// 배포 환경에서 브라우저 직접 호출 불가.
// 이 함수가 대신 호출하며, 인증키는 서버 환경변수에서만 읽음
const KMA_ENDPOINT = 'https://apihub.kma.go.kr/api/typ01/url/wrn_now_data.php'

export default async function handler(request, response) {
  const apiKey = process.env.KMA_API_KEY

  if (!apiKey) {
    response.statusCode = 503
    response.setHeader('content-type', 'application/json; charset=utf-8')
    return response.end(JSON.stringify({ message: 'KMA_API_KEY가 설정되지 않았습니다.' }))
  }

  const upstream = new URL(KMA_ENDPOINT)
  upstream.searchParams.set('fe', 'f')
  upstream.searchParams.set('tm', '')
  upstream.searchParams.set('disp', '0')
  upstream.searchParams.set('help', '0')
  upstream.searchParams.set('authKey', apiKey)

  try {
    const upstreamResponse = await fetch(upstream)
    const buffer = Buffer.from(await upstreamResponse.arrayBuffer())

    // 기상청 응답은 EUC-KR → UTF-8 변환 후 반환
    // 오류 응답은 JSON(UTF-8)이므로 Content-Type으로 구분
    const upstreamType = upstreamResponse.headers.get('content-type') ?? ''
    const isEucKr = upstreamType.toLowerCase().includes('euc-kr')
    const body = new TextDecoder(isEucKr ? 'euc-kr' : 'utf-8').decode(buffer)

    response.statusCode = upstreamResponse.status
    response.setHeader('content-type', 'text/plain; charset=utf-8')
    // 특보는 변동이 잦지 않아 짧게 캐시
    response.setHeader('cache-control', 's-maxage=300, stale-while-revalidate=600')
    return response.end(body)
  } catch {
    response.statusCode = 502
    response.setHeader('content-type', 'application/json; charset=utf-8')
    return response.end(JSON.stringify({ message: '기상청 서버에 연결하지 못했습니다.' }))
  }
}
