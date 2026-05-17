export const KBO_TEAMS = [
  '두산 베어스',
  'LG 트윈스',
  'KT 위즈',
  'SSG 랜더스',
  'NC 다이노스',
  '키움 히어로즈',
  '삼성 라이온즈',
  '한화 이글스',
  '롯데 자이언츠',
  'KIA 타이거즈',
] as const

export const KBO_STADIUMS = [
  '잠실야구장',
  '수원KT위즈파크',
  '인천SSG랜더스필드',
  '창원NC파크',
  '고척스카이돔',
  '대구삼성라이온즈파크',
  '대전한화생명이글스파크',
  '사직야구장',
  '광주-기아챔피언스필드',
] as const

export const WEATHER_OPTIONS = ['맑음', '흐림', '비', '더움', '추움'] as const

export const HOME_STADIUM_MAP: Record<string, string> = {
  '두산 베어스': '잠실야구장',
  'LG 트윈스': '잠실야구장',
  'KT 위즈': '수원KT위즈파크',
  'SSG 랜더스': '인천SSG랜더스필드',
  'NC 다이노스': '창원NC파크',
  '키움 히어로즈': '고척스카이돔',
  '삼성 라이온즈': '대구삼성라이온즈파크',
  '한화 이글스': '대전한화생명이글스파크',
  '롯데 자이언츠': '사직야구장',
  'KIA 타이거즈': '광주-기아챔피언스필드',
}

export const NAVER_TEAM_MAP: Record<string, string> = {
  '두산 베어스': 'OB',
  'LG 트윈스': 'LG',
  'KT 위즈': 'KT',
  'SSG 랜더스': 'SK',
  'NC 다이노스': 'NC',
  '키움 히어로즈': 'WO',
  '삼성 라이온즈': 'SS',
  '한화 이글스': 'HH',
  '롯데 자이언츠': 'LT',
  'KIA 타이거즈': 'HT',
}
