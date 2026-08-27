import axios from 'axios'

// [Hands-on 8] 인증키를 브라우저에 내려보내지 않음.
// api/kma-warnings.js 서버리스 함수가 서버 환경변수의 키로 호출하고
// EUC-KR 응답을 UTF-8로 변환해 반환 (API 허브는 CORS 미지원)
const client = axios.create({
  baseURL: '/api/kma-warnings',
  timeout: 9000,
})

// 기상청 코드(WRN)를 화면 표시용 특보 정보와 안전 행동으로 변환
const WARNING_RULES = {
  H: {
    key: 'heatwave',
    label: '폭염',
    advice: '한낮 야외 활동을 줄이고 통풍이 잘되는 옷과 물을 준비하세요.',
    items: ['물', '모자'],
  },
  C: {
    key: 'cold-wave',
    label: '한파',
    advice: '노출 부위를 줄이고 두꺼운 외투와 방한용품을 챙기세요.',
    items: ['두꺼운 외투', '장갑'],
  },
  R: {
    key: 'heavy-rain',
    label: '호우',
    advice: '침수 위험 지역을 피하고 방수 겉옷과 우산을 준비하세요.',
    items: ['우산', '방수 겉옷'],
  },
  S: {
    key: 'heavy-snow',
    label: '대설',
    advice: '보온성이 높은 옷과 미끄럼을 줄이는 신발을 착용하세요.',
    items: ['방한용품', '미끄럼 방지 신발'],
  },
  T: {
    key: 'typhoon',
    label: '태풍',
    advice: '불필요한 외출을 줄이고 강한 비바람에 대비하세요.',
    items: ['방수 겉옷', '비상용품'],
  },
  W: {
    key: 'strong-wind',
    label: '강풍',
    advice: '바람에 날릴 수 있는 물건을 피하고 바람막이를 준비하세요.',
    items: ['바람막이'],
  },
}

const LEVEL_LABELS = {
  1: '예비특보',
  2: '주의보',
  3: '경보',
  예비: '예비특보',
  주의: '주의보',
  경보: '경보',
}

// 기존형 API는 코드 대신 '폭염', '주의보', '해제' 같은 한글 값을 반환.
// 코드형·한글형을 모두 처리해 API 형식 변경에 대응
const WARNING_CODE_BY_LABEL = {
  폭염: 'H',
  한파: 'C',
  호우: 'R',
  대설: 'S',
  태풍: 'T',
  강풍: 'W',
}

// CMD 3·4·7은 각각 해제·대치해제·변경해제 → 활성 특보에서 제외
const RELEASE_COMMANDS = new Set(['3', '4', '7'])

// 기상청 특보는 도시명이 아니라 광역 단위(REG_KO)로 발표됨.
// 예: 수원 특보는 '경기도 남부'처럼 표기 → 도시명만으로는 매칭 실패.
// 광역시가 아닌 도시는 소속 도(道) 이름을 함께 후보에 넣어 매칭률을 높임
const PROVINCE_BY_CITY = {
  수원: '경기',
  춘천: '강원',
  강릉: '강원',
  청주: '충북',
  홍성: '충남',
  안동: '경북',
  포항: '경북',
  울릉도: '경북',
  독도: '경북',
  전주: '전북',
  목포: '전남',
  여수: '전남',
  창원: '경남',
}

// 광역시는 '부산'과 '부산광역시'가 응답에 섞여 나와 두 표기를 모두 후보로 사용
const REGION_ALIASES = {
  서울: ['서울', '서울특별시'],
  인천: ['인천', '인천광역시'],
  부산: ['부산', '부산광역시'],
  대구: ['대구', '대구광역시'],
  광주: ['광주', '광주광역시'],
  대전: ['대전', '대전광역시'],
  울산: ['울산', '울산광역시'],
  제주: ['제주', '제주도', '제주특별자치도'],
}

const getRegionAliases = (city) => {
  const aliases = new Set([city.name, city.fullName])

  REGION_ALIASES[city.name]?.forEach((alias) => aliases.add(alias))
  if (PROVINCE_BY_CITY[city.name]) aliases.add(PROVINCE_BY_CITY[city.name])

  return [...aliases].filter(Boolean)
}

// API 허브의 typ01 응답은 JSON이 아닌 쉼표 구분 텍스트.
// 주석(#)과 종료 표시(=)를 제거해 특보 객체로 변환
const parseWarningRows = (text) => {
  return String(text)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => line.replace(/,?\s*=\s*$/, ''))
    .map((line) => line.split(',').map((value) => value.trim()))
    .filter((columns) => columns.length >= 9)
    .map(([regUp, regUpKo, regId, regKo, tmFc, tmEf, wrn, lvl, cmd]) => ({
      regUp,
      regUpKo,
      regId,
      regKo,
      tmFc,
      tmEf,
      wrn,
      lvl,
      cmd,
    }))
}

export const parseKmaWarnings = (text, city) => {
  const aliases = getRegionAliases(city)
  const warnings = new Map()

  parseWarningRows(text).forEach((row) => {
    const warningCode = WARNING_CODE_BY_LABEL[row.wrn] ?? row.wrn
    const rule = WARNING_RULES[warningCode]
    const isReleased = RELEASE_COMMANDS.has(row.cmd) || row.cmd.includes('해제')
    if (!rule || isReleased) return

    const regionText = `${row.regUpKo} ${row.regKo}`
    if (!aliases.some((alias) => regionText.includes(alias))) return

    warnings.set(rule.key, {
      ...rule,
      level: LEVEL_LABELS[row.lvl] ?? row.lvl ?? '특보',
      region: row.regKo || row.regUpKo || city.fullName,
      announcedAt: row.tmFc,
      effectiveAt: row.tmEf,
    })
  })

  return [...warnings.values()]
}

// [기상청 API 허브 - 특보현황 조회]
// 기준시각(tm)을 비우면 현재 시각의 발표 현황 반환.
// 활성 특보와 지역명(REG_KO)을 함께 제공해 도시별 안전 모드에 적합
export const fetchActiveWeatherWarnings = async (city) => {
  const { data } = await client.get('', { responseType: 'text' })

  if (String(data).includes('Authentication') || String(data).includes('403 Forbidden')) {
    throw new Error('기상청 API 인증 또는 활용 신청을 확인해 주세요.')
  }

  return parseKmaWarnings(data, city)
}
