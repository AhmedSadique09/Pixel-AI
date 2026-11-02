import type { AppState, Booking, Facility } from './types'

export const STATE_VERSION = 3
export const DEFAULT_FACILITY_ID = 'pine-ridge-rv-park'

const SITES = ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6'] as const

const defaultFacility: Facility = {
  id: DEFAULT_FACILITY_ID,
  name: {
    ja: 'パインリッジRVパーク',
    en: 'Pine Ridge RV Park',
    zh: '松岭房车营地',
    ko: '파인리지 RV 파크',
  },
  fee: 3000,
  sites: SITES,
  docName: 'Pine Ridge RV Park Rules.pdf',
  docs: [],
  createdAt: 0,
  isCustom: false,
  rules: [
    {
      ja: '静粛時間は21:00〜翌7:00です。大声・音楽はご遠慮ください。',
      en: 'Quiet hours are 21:00 to 7:00. No loud voices or music.',
      zh: '安静时间为21:00至次日7:00，请勿大声喧哗或播放音乐。',
      ko: '정숙 시간은 21:00~다음 날 07:00입니다. 큰 소리와 음악은 삼가주세요.',
    },
    {
      ja: '発電機の使用は8:00〜21:00まで。夜間は外部電源をご利用ください。',
      en: 'Generators may run 8:00 to 21:00 only. Use the site power at night.',
      zh: '发电机仅可在8:00至21:00使用，夜间请使用营位电源。',
      ko: '발전기는 8:00~21:00에만 사용할 수 있습니다. 야간에는 사이트 전원을 이용하세요.',
    },
    {
      ja: 'ゴミは分別して、入口横のゴミステーションへ。24時間利用できます。',
      en: 'Sort your garbage and take it to the station by the entrance, open 24 hours.',
      zh: '垃圾请分类后投放到入口旁的垃圾站，24小时开放。',
      ko: '쓰레기는 분리하여 입구 옆 쓰레기 수거장에 버리세요. 24시간 이용 가능합니다.',
    },
    {
      ja: '直火・焚き火は禁止。BBQは指定エリアのみ、21:00までに消火してください。',
      en: 'No open fires. BBQ only in the marked area, fire out by 21:00.',
      zh: '禁止明火。烧烤仅限指定区域，请在21:00前熄灭。',
      ko: '직화·모닥불 금지. BBQ는 지정 구역에서만, 21:00까지 불을 꺼주세요.',
    },
    {
      ja: 'チェックアウトは11:00までです。',
      en: 'Check-out is by 11:00.',
      zh: '退房时间为11:00之前。',
      ko: '체크아웃은 11:00까지입니다.',
    },
    {
      ja: '場内は時速10km以下。ペットはリードを付けてください。',
      en: 'Speed limit 10 km/h. Keep pets on a leash.',
      zh: '场内限速10公里/小时，宠物请牵绳。',
      ko: '구내 제한속도 10km/h. 반려동물은 목줄을 착용하세요.',
    },
  ],
  suggestions: [
    {
      ja: '発電機は何時まで使えますか？',
      en: 'Until what time can I run a generator?',
      zh: '发电机可以用到几点？',
      ko: '발전기는 몇 시까지 사용할 수 있나요?',
    },
    {
      ja: '近くの温泉は何時までですか？',
      en: 'How late is the nearby onsen open?',
      zh: '附近的温泉开到几点？',
      ko: '근처 온천은 몇 시까지인가요?',
    },
    {
      ja: 'ゴミはどこに捨てますか？',
      en: 'Where do I throw away garbage?',
      zh: '垃圾扔在哪里？',
      ko: '쓰레기는 어디에 버리나요?',
    },
  ],
  faq: [
    {
      id: 'generator',
      keywords: ['発電機', 'ジェネレーター', 'generator', 'genset', '发电机', '發電機', '발전기'],
      source: 'Pine Ridge RV Park Rules.pdf · p.2 Power & generators',
      answer: {
        ja: '発電機は8:00〜21:00までご使用いただけます。21:00以降は静粛時間のため、外部電源（15A）をご利用ください。',
        en: 'Generators can be used from 8:00 until 21:00. After 21:00 it is quiet time, so please use the 15A site power instead.',
        zh: '发电机可在8:00至21:00使用。21:00后为安静时间，请改用营位的15A电源。',
        ko: '발전기는 8:00부터 21:00까지 사용할 수 있습니다. 21:00 이후는 정숙 시간이므로 15A 사이트 전원을 이용해 주세요.',
      },
    },
    {
      id: 'onsen',
      keywords: ['温泉', '風呂', 'お風呂', 'onsen', 'hot spring', 'bath', '泡汤', '온천', '목욕'],
      source: 'Nearby Guide.pdf · p.1 Hoshino-no-Yu',
      answer: {
        ja: '近くの温泉「星の湯」は車で5分。営業は22:00まで（最終受付21:30）です。当園の宿泊者は入浴料が100円引きになります。',
        en: 'The nearby onsen “Hoshino-no-Yu” is a 5-minute drive. It is open until 22:00 (last entry 21:30). Park guests get ¥100 off.',
        zh: '附近的温泉“星之汤”驱车5分钟。营业至22:00（最后入场21:30），本营地住客可优惠100日元。',
        ko: '근처 온천 “호시노유”는 차로 5분 거리입니다. 22:00까지 영업(마지막 입장 21:30)하며, 투숙객은 100엔 할인됩니다.',
      },
    },
    {
      id: 'garbage',
      keywords: ['ゴミ', 'ごみ', '廃棄', 'garbage', 'trash', 'rubbish', 'waste', '垃圾', '쓰레기'],
      source: 'Pine Ridge RV Park Rules.pdf · p.3 Garbage',
      answer: {
        ja: 'ゴミは「燃える」「燃えない」「缶・ビン」に分別し、入口横のゴミステーションへ。24時間いつでも利用できます。',
        en: 'Sort garbage into burnable, non-burnable and cans/bottles, and take it to the station by the entrance. It is open 24 hours.',
        zh: '请将垃圾分为可燃、不可燃、罐瓶三类，投放到入口旁的垃圾站，24小时开放。',
        ko: '쓰레기는 가연, 불연, 캔·병으로 분리해 입구 옆 쓰레기 수거장에 버리세요. 24시간 이용 가능합니다.',
      },
    },
    {
      id: 'power',
      keywords: ['電源', '電気', 'コンセント', 'アンペア', 'power', 'electric', 'outlet', 'plug', 'hookup', '电源', '用电', '插座', '전원', '전기', '콘센트'],
      source: 'Pine Ridge RV Park Rules.pdf · p.2 Power & generators',
      answer: {
        ja: '各サイトに15Aの外部電源があります。電子レンジとエアコンの同時使用はブレーカーが落ちる場合があるのでご注意ください。',
        en: 'Each site has a 15A power hookup. Running a microwave and air conditioner together may trip the breaker.',
        zh: '每个营位都有15A外接电源。同时使用微波炉和空调可能导致跳闸。',
        ko: '각 사이트에는 15A 외부 전원이 있습니다. 전자레인지와 에어컨을 동시에 사용하면 차단기가 내려갈 수 있습니다.',
      },
    },
    {
      id: 'quiet',
      keywords: ['静粛', '消灯', 'うるさ', '騒', 'quiet', 'noise', 'loud', 'music', '安静', '噪音', '음악', '정숙', '소음'],
      source: 'Pine Ridge RV Park Rules.pdf · p.1 Quiet hours',
      answer: {
        ja: '静粛時間は21:00〜翌7:00です。この間は大声や音楽、車のアイドリングをお控えください。',
        en: 'Quiet hours are 21:00 to 7:00. Please avoid loud voices, music and idling engines during this time.',
        zh: '安静时间为21:00至次日7:00，期间请勿大声说话、放音乐或让发动机空转。',
        ko: '정숙 시간은 21:00~다음 날 07:00입니다. 이 시간에는 큰 소리, 음악, 공회전을 삼가주세요.',
      },
    },
    {
      id: 'checkout',
      keywords: ['チェックアウト', '何時に出', 'check-out', 'checkout', 'check out', '退房', '체크아웃'],
      source: 'Pine Ridge RV Park Rules.pdf · p.1 Check-in & check-out',
      answer: {
        ja: 'チェックアウトは11:00までです。延長をご希望の場合は運営者にご連絡ください。',
        en: 'Check-out is by 11:00. If you need a later check-out, please contact the operator.',
        zh: '退房时间为11:00之前。如需延长，请联系管理员。',
        ko: '체크아웃은 11:00까지입니다. 연장을 원하시면 운영자에게 연락해 주세요.',
      },
    },
    {
      id: 'bbq',
      keywords: ['bbq', 'バーベキュー', '焚き火', '直火', 'campfire', 'barbecue', '烧烤', '篝火', '모닥불', '바비큐'],
      source: 'Pine Ridge RV Park Rules.pdf · p.3 Fire & BBQ',
      answer: {
        ja: '直火・焚き火は禁止です。BBQは場内東側の指定エリアのみで、21:00までに完全に消火してください。',
        en: 'Open fires are not allowed. BBQ is only in the marked area on the east side and must be fully out by 21:00.',
        zh: '禁止明火和篝火。烧烤仅限场地东侧指定区域，请在21:00前完全熄灭。',
        ko: '직화와 모닥불은 금지입니다. BBQ는 동쪽 지정 구역에서만 가능하며 21:00까지 완전히 불을 꺼주세요.',
      },
    },
    {
      id: 'wifi',
      keywords: ['wifi', 'wi-fi', 'ワイファイ', 'ネット', 'internet', '无线', '网络', '와이파이', '인터넷'],
      source: 'Pine Ridge RV Park Rules.pdf · p.4 Facilities',
      answer: {
        ja: '管理棟周辺で無料Wi-Fiが使えます。ネットワーク名は PineRidge-Guest、パスワードは camp2026 です。',
        en: 'Free Wi-Fi is available around the office building. Network: PineRidge-Guest, password: camp2026.',
        zh: '管理楼周边提供免费Wi-Fi。网络名称：PineRidge-Guest，密码：camp2026。',
        ko: '관리동 주변에서 무료 Wi-Fi를 사용할 수 있습니다. 네트워크: PineRidge-Guest, 비밀번호: camp2026.',
      },
    },
  ],
}

const defaultBookings: readonly Booking[] = [
  { id: 'b1', guestName: 'Taro Tanaka', alias: '田中 太郎', plate: '品川 300 さ 12-34', site: 'A3', paid: false, nights: 1, guests: 2 },
  { id: 'b2', guestName: 'John Smith', alias: 'ジョン スミス', plate: '横浜 500 あ 56-78', site: 'B2', paid: false, nights: 1, guests: 2 },
  { id: 'b3', guestName: 'Wang Xiaoming', alias: '王小明', plate: '練馬 300 ち 90-12', site: 'A5', paid: false, nights: 2, guests: 3 },
  { id: 'b4', guestName: 'Kim Minsu', alias: '김민수', plate: '大阪 300 ほ 34-56', site: 'B4', paid: false, nights: 1, guests: 1 },
  { id: 'b5', guestName: 'Hanako Sato', alias: '佐藤 花子', plate: '名古屋 500 た 78-90', site: 'A1', paid: false, nights: 2, guests: 4 },
  { id: 'b6', guestName: 'Mike Johnson', alias: 'マイク ジョンソン', plate: '札幌 300 す 11-22', site: 'B1', paid: false, nights: 1, guests: 2 },
]

export function createSeedState(): AppState {
  return {
    version: STATE_VERSION,
    facilities: [defaultFacility],
    bookings: { [DEFAULT_FACILITY_ID]: defaultBookings },
    arrivals: [],
    questions: [],
  }
}

/** Bilingual sample rules a presenter can load to create a second park in seconds. */
export const SAMPLE_RULES_TEXT = `# 到着・チェックイン / Arrival
Check-in from 14:00. Late arrivals are welcome; use the QR code at the gate. 14:00以降チェックイン可能です。夜遅い到着もOK。

# ゴミ / Garbage
ゴミは持ち帰りが基本です。Garbage is take-home only; there is no garbage station. 缶・ビンのみ管理棟前のボックスへ。

# 発電機 / Generators
発電機の使用は9:00から20:00まで。Generators may run from 9:00 to 20:00 only. 20時以降は静粛時間です。

# 電源 / Power
各サイトに20Aの電源があります。Each site has a 20A power hookup. 同時に使える家電は最大2台までです。

# 温泉 / Onsen
近くの温泉「山彦の湯」は車で8分、21:00まで営業。The nearby onsen Yamabiko-no-Yu is an 8-minute drive and open until 21:00.

# 消灯・静粛 / Quiet hours
消灯は21:30です。Quiet hours start at 21:30 and end at 7:00. 焚き火は禁止です。

# チェックアウト / Check-out
チェックアウトは10:30までです。Check-out is by 10:30.
`
