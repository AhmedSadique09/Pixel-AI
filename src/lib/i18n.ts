import type { Lang, Localized } from './types'

const dict = {
  chooseLang: {
    ja: '言語を選んでください', en: 'Choose your language', zh: '请选择语言', ko: '언어를 선택하세요',
  },
  welcomeTagline: {
    ja: '24時間 無人チェックイン', en: '24-hour unmanned check-in', zh: '24小时无人入住', ko: '24시간 무인 체크인',
  },
  welcomeEyebrow: { ja: 'ようこそ', en: 'Welcome', zh: '欢迎', ko: '환영합니다' },
  welcomeHeadingLine1: { ja: 'チェックインを', en: "Let's start your", zh: '开始', ko: '체크인을' },
  welcomeHeadingLine2: { ja: 'はじめましょう', en: 'check-in', zh: '办理入住', ko: '시작해볼까요' },
  welcomeSubtitle: {
    ja: 'スタッフ不在の時間も、このページで受付・お支払い・施設案内まで完結します。',
    en: 'Even when no staff is on site, this page handles check-in, payment and facility guidance.',
    zh: '即使没有工作人员在场，也可以在此页面完成登记、支付和设施指南。',
    ko: '직원이 없는 시간에도 이 페이지에서 체크인, 결제, 시설 안내까지 모두 해결됩니다.',
  },
  pillFast: { ja: '約1分', en: 'About 1 min', zh: '约1分钟', ko: '약 1분' },
  pillNoApp: { ja: 'アプリ不要', en: 'No app needed', zh: '无需安装应用', ko: '앱 불필요' },
  pillAiGuide: { ja: '24時間AI案内', en: '24h AI guide', zh: '24小时AI向导', ko: '24시간 AI 안내' },
  stepCheckin: { ja: '受付', en: 'Check-in', zh: '登记', ko: '체크인' },
  stepConfirm: { ja: '予約確認', en: 'Confirm booking', zh: '确认预订', ko: '예약 확인' },
  stepRules: { ja: 'ルール', en: 'Rules', zh: '规则', ko: '규칙' },
  stepPay: { ja: 'お支払い', en: 'Payment', zh: '支付', ko: '결제' },
  stepGuide: { ja: 'ガイド', en: 'Guide', zh: '指南', ko: '가이드' },
  checkinTitle: { ja: '予約を確認します', en: "Let's confirm your booking", zh: '确认您的预订', ko: '예약을 확인합니다' },
  checkinHint: {
    ja: '予約時のお名前、または車のナンバーを入力してください。',
    en: 'Enter the name on your booking, or your vehicle plate number.',
    zh: '请输入预订姓名或车辆车牌号。',
    ko: '예약자 성함 또는 차량 번호판을 입력해 주세요.',
  },
  plateFieldsLabel: { ja: 'ナンバープレートの内容', en: 'Plate number details', zh: '车牌信息', ko: '번호판 정보' },
  plateRegion: { ja: '地域名', en: 'Region', zh: '地区名称', ko: '지역명' },
  plateClass: { ja: '分類番号', en: 'Class number', zh: '分类编号', ko: '분류 번호' },
  plateHiragana: { ja: 'ひらがな', en: 'Kana', zh: '假名', ko: '가나' },
  plateSerial: { ja: '一連番号', en: 'Serial number', zh: '序号', ko: '일련번호' },
  plateSearchHint: {
    ja: 'わからない場合は、下4桁だけでも検索できます',
    en: "Not sure? You can search with just the last 4 digits",
    zh: '如果不确定，仅输入后4位数字即可搜索',
    ko: '잘 모르시면 마지막 4자리만으로도 검색할 수 있습니다',
  },
  plateUseHint: {
    ja: '場内での車両確認に使います',
    en: 'Used to identify your vehicle on site.',
    zh: '用于在场内确认车辆。',
    ko: '현장에서 차량을 확인하는 데 사용됩니다.',
  },
  findBooking: { ja: '予約を検索', en: 'Search booking', zh: '查找预订', ko: '예약 검색' },
  noBookingTitle: { ja: '予約が見つかりませんでした', en: 'No matching booking found', zh: '未找到匹配的预订', ko: '예약을 찾을 수 없습니다' },
  noBookingHint: {
    ja: '本日の予約に入力内容と一致するものはありません。',
    en: "We couldn't match today's bookings to what you entered.",
    zh: '今天的预订中没有与您输入内容相符的记录。',
    ko: '입력하신 내용과 일치하는 오늘의 예약이 없습니다.',
  },
  noBookingReasonsTitle: { ja: 'よくある理由', en: 'Common reasons', zh: '常见原因', ko: '자주 있는 이유' },
  noBookingReason1: {
    ja: '予約時に別の車のナンバーを登録した', en: 'A different plate was registered at booking', zh: '预订时登记了其他车辆的车牌', ko: '예약 시 다른 차량 번호판을 등록했습니다',
  },
  noBookingReason2: { ja: '予約日が今日ではない', en: "The booking isn't for today", zh: '预订日期不是今天', ko: '예약 날짜가 오늘이 아닙니다' },
  noBookingReason3: {
    ja: '同行者の名前で予約されている', en: 'The booking is under a companion’s name', zh: '预订使用的是同行者的姓名', ko: '동행자 이름으로 예약되어 있습니다',
  },
  editPlate: { ja: 'ナンバーを修正する', en: 'Edit plate number', zh: '修改车牌号', ko: '번호판 수정하기' },
  searchByName: { ja: '予約名で検索', en: 'Search by name', zh: '按预订姓名查找', ko: '예약자 이름으로 검색' },
  walkInOfferTitle: { ja: '予約がなくても泊まれます', en: 'You can still stay without a booking', zh: '没有预订也可以入住', ko: '예약 없이도 숙박하실 수 있습니다' },
  walkInOfferHint: {
    ja: '今夜は空きサイトがあります。当日料金で受付できます。',
    en: 'Sites are available tonight — check in at the same-day rate.',
    zh: '今晚有空位，可按当日价格办理入住。',
    ko: '오늘 밤 이용 가능한 사이트가 있습니다. 당일 요금으로 체크인할 수 있습니다.',
  },
  walkInOfferButton: { ja: '当日利用で受付する', en: 'Check in as walk-in', zh: '以当日入住方式办理', ko: '당일 이용으로 체크인하기' },
  contactOperator: { ja: '管理者に問い合わせる', en: 'Contact the operator', zh: '联系管理员', ko: '운영자에게 문의하기' },
  haveBooking: { ja: '予約があります', en: 'I have a booking', zh: '我有预订', ko: '예약이 있습니다' },
  walkInTitle: { ja: '当日利用の受付', en: 'Same-day check-in', zh: '当日入住办理', ko: '당일 이용 접수' },
  walkInHeader: { ja: 'お名前と車のナンバー', en: 'Your name and plate number', zh: '姓名与车牌号', ko: '성함과 차량 번호판' },
  walkInHint: {
    ja: '当日利用の受付に使います。次の画面でサイトを選べます。',
    en: "This is used for same-day check-in. You'll choose a site on the next screen.",
    zh: '用于当日入住办理。您可以在下一个画面选择营位。',
    ko: '당일 체크인에 사용됩니다. 다음 화면에서 사이트를 선택할 수 있습니다.',
  },
  walkIn: { ja: '予約なし（ウォークイン）', en: 'No booking (walk-in)', zh: '无预订（现场）', ko: '예약 없음 (워크인)' },
  nextChooseSite: { ja: '次へ：サイトを選ぶ', en: 'Next: choose a site', zh: '下一步：选择营位', ko: '다음: 사이트 선택' },
  yourName: { ja: 'お名前', en: 'Your name', zh: '您的姓名', ko: '이름' },
  plateOptional: { ja: 'ナンバープレート（任意）', en: 'Plate number (optional)', zh: '车牌号（选填）', ko: '번호판 (선택)' },
  continue: { ja: '続ける', en: 'Continue', zh: '继续', ko: '계속' },
  back: { ja: '戻る', en: 'Back', zh: '返回', ko: '뒤로' },
  hello: { ja: 'こんにちは、{name}さん', en: 'Hello, {name}', zh: '您好，{name}', ko: '{name}님, 안녕하세요' },
  bookingFoundBanner: { ja: '予約が見つかりました', en: 'Booking found', zh: '已找到预订', ko: '예약을 찾았습니다' },
  bookingGuestName: { ja: '{name} 様', en: '{name}', zh: '{name}', ko: '{name}님' },
  bookingDateLabel: { ja: 'ご利用日', en: 'Stay dates', zh: '使用日期', ko: '이용일' },
  bookingNightsBadge: { ja: '{n}泊', en: '{n} night', zh: '{n}晚', ko: '{n}박' },
  bookingPlanLabel: { ja: 'プラン', en: 'Plan', zh: '套餐', ko: '플랜' },
  bookingPlanPower: { ja: '電源付きサイト', en: 'Powered site', zh: '带电源营位', ko: '전원 있는 사이트' },
  bookingGuestsLabel: { ja: '人数', en: 'Guests', zh: '人数', ko: '인원' },
  bookingGuestsValue: { ja: '大人 {n}名', en: '{n} adults', zh: '成人 {n}位', ko: '성인 {n}명' },
  bookingFeeLabel: { ja: '料金', en: 'Fee', zh: '费用', ko: '요금' },
  bookingUnpaid: { ja: '未払い', en: 'Unpaid', zh: '未付款', ko: '미결제' },
  notMyBooking: { ja: '自分の予約ではありません', en: "This isn't my booking", zh: '这不是我的预订', ko: '제 예약이 아닙니다' },
  confirmCheckIn: { ja: 'この予約でチェックイン', en: 'Check in with this booking', zh: '使用此预订办理入住', ko: '이 예약으로 체크인' },
  yourSite: { ja: 'あなたのサイト', en: 'Your site', zh: '您的营位', ko: '배정된 사이트' },
  entrance: { ja: '入口', en: 'Entrance', zh: '入口', ko: '입구' },
  legendYours: { ja: 'あなたのサイト', en: 'Your site', zh: '您的营位', ko: '내 사이트' },
  legendTaken: { ja: '使用中', en: 'Taken', zh: '已占用', ko: '사용 중' },
  legendAvailable: { ja: '空き', en: 'Available', zh: '空闲', ko: '이용 가능' },
  rulesTitle: { ja: '必ずお読みください', en: 'Must-know rules', zh: '必读规则', ko: '꼭 읽어주세요' },
  rulesConfirm: {
    ja: '上記のルールを読み、同意します',
    en: 'I have read and agree to these rules',
    zh: '我已阅读并同意以上规则',
    ko: '위 규칙을 읽고 동의합니다',
  },
  payTitle: { ja: 'ご利用料金', en: 'Site fee', zh: '使用费', ko: '이용 요금' },
  payNow: { ja: '{amount}を支払う', en: 'Pay {amount}', zh: '支付 {amount}', ko: '{amount} 결제' },
  cardNumber: { ja: 'カード番号', en: 'Card number', zh: '卡号', ko: '카드 번호' },
  processing: { ja: '処理中…', en: 'Processing…', zh: '处理中…', ko: '처리 중…' },
  alreadyPaid: {
    ja: 'お支払いは完了しています。',
    en: 'Your fee is already paid.',
    zh: '您的费用已支付。',
    ko: '요금이 이미 결제되었습니다.',
  },
  paid: { ja: '支払い済み', en: 'Paid', zh: '已支付', ko: '결제 완료' },
  allSet: { ja: 'チェックイン完了', en: "You're checked in", zh: '入住办理完成', ko: '체크인 완료' },
  checkOutButton: { ja: 'チェックアウトする', en: 'Check out', zh: '退房', ko: '체크아웃' },
  checkedOutTitle: { ja: 'チェックアウト完了', en: "You're checked out", zh: '退房完成', ko: '체크아웃 완료' },
  checkedOutHint: {
    ja: 'ご利用ありがとうございました。またお越しをお待ちしております。',
    en: 'Thanks for staying with us. Safe travels, and see you again!',
    zh: '感谢您的入住，祝您旅途愉快，期待再次光临！',
    ko: '이용해 주셔서 감사합니다. 안전한 여행 되시고 또 뵙겠습니다!',
  },
  guideTitle: { ja: '施設ガイドに質問', en: 'Ask the facility guide', zh: '向设施指南提问', ko: '시설 가이드에게 질문' },
  chatLauncher: { ja: 'ガイドとチャットする', en: 'Chat with the guide', zh: '与指南聊天', ko: '가이드와 채팅하기' },
  close: { ja: '閉じる', en: 'Close', zh: '关闭', ko: '닫기' },
  guideIntro: {
    ja: 'ゴミ、電源、発電機、温泉など、何でもどうぞ。施設の資料から回答します。',
    en: 'Ask about garbage, power, generators, onsen… I answer from the facility’s own documents.',
    zh: '垃圾、电源、发电机、温泉等问题都可以问，我会根据设施资料回答。',
    ko: '쓰레기, 전기, 발전기, 온천 등 무엇이든 물어보세요. 시설 자료를 바탕으로 답변합니다.',
  },
  askPlaceholder: { ja: '質問を入力…', en: 'Type your question…', zh: '输入您的问题…', ko: '질문을 입력하세요…' },
  send: { ja: '送信', en: 'Send', zh: '发送', ko: '보내기' },
  source: { ja: '出典', en: 'Source', zh: '来源', ko: '출처' },
  noAnswer: {
    ja: '施設の資料にはこの情報が見つかりませんでした。',
    en: 'I could not find this in the facility documents.',
    zh: '设施资料中没有找到相关信息。',
    ko: '시설 자료에서 이 내용을 찾지 못했습니다.',
  },
  askOperator: { ja: '運営者にLINEで聞く', en: 'Ask the operator on LINE', zh: '通过LINE询问管理员', ko: 'LINE으로 운영자에게 문의' },
  operatorPinged: {
    ja: '運営者のLINEに送信しました。返信をお待ちください。',
    en: 'Sent to the operator on LINE. They will get back to you.',
    zh: '已通过LINE发送给管理员，请稍候。',
    ko: '운영자 LINE으로 전송했습니다. 곧 답변드립니다.',
  },
  tryAsking: { ja: 'よくある質問', en: 'Popular questions', zh: '常见问题', ko: '자주 묻는 질문' },
  landingLine1: { ja: '深夜の到着。', en: 'Midnight arrival.', zh: '深夜抵达。', ko: '한밤중 도착.' },
  landingLine2: { ja: '受付は無人でも大丈夫。', en: 'Nobody at the desk.', zh: '前台无人也没问题。', ko: '데스크에 직원이 없어도 OK.' },
  landingSub: {
    ja: 'QRコードを読み取るだけで、チェックイン、支払い、施設の質問まで母国語で完了。新しい施設は数分で開設できます。',
    en: 'Guests scan a QR code, check in, pay and get answers in their own language. A new park goes live in minutes.',
    zh: '住客扫描二维码即可办理入住、支付，并用母语获得解答。新营地几分钟即可上线。',
    ko: 'QR 코드를 스캔하면 체크인, 결제, 시설 문의까지 모국어로 해결됩니다. 새 시설은 몇 분 만에 열 수 있습니다.',
  },
  openGuest: { ja: 'ゲスト画面を開く', en: 'Open guest view', zh: '打开住客页面', ko: '게스트 화면 열기' },
  openOperator: { ja: '管理パネル', en: 'Admin panel', zh: '管理面板', ko: '관리자 패널' },
  scanAtGate: { ja: 'ゲートでスキャン', en: 'Scan at the gate', zh: '在入口扫描', ko: '입구에서 스캔' },
  payMethods: { ja: 'お支払い方法', en: 'Payment method', zh: '支付方式', ko: '결제 수단' },
  methodCard: { ja: 'クレジットカード', en: 'Credit card', zh: '信用卡', ko: '신용카드' },
  methodPayPay: { ja: 'PayPay', en: 'PayPay', zh: 'PayPay', ko: 'PayPay' },
  methodKonbini: { ja: 'コンビニ払い', en: 'Convenience store', zh: '便利店支付', ko: '편의점 결제' },
  methodWallet: { ja: 'Apple Pay / Google Pay', en: 'Apple Pay / Google Pay', zh: 'Apple Pay / Google Pay', ko: 'Apple Pay / Google Pay' },
  taxIncluded: { ja: '税込', en: 'Tax incl.', zh: '含税', ko: '세금 포함' },
  taxNote: {
    ja: '（内消費税10% {tax}）',
    en: '(incl. 10% consumption tax {tax})',
    zh: '（含10%消费税 {tax}）',
    ko: '(소비세 10% {tax} 포함)',
  },
  holderName: { ja: 'カード名義（ローマ字）', en: 'Name on card', zh: '持卡人姓名', ko: '카드 명의' },
  expiry: { ja: '有効期限 (MM/YY)', en: 'Expiry (MM/YY)', zh: '有效期 (MM/YY)', ko: '유효기간 (MM/YY)' },
  cvc: { ja: 'セキュリティコード', en: 'Security code', zh: '安全码', ko: '보안 코드' },
  invalidInput: { ja: '入力内容を確認してください', en: 'Please check the details', zh: '请检查输入内容', ko: '입력 내용을 확인해 주세요' },
  threeDsTitle: { ja: '3Dセキュア認証', en: '3-D Secure check', zh: '3D安全验证', ko: '3D 시큐어 인증' },
  threeDsHint: {
    ja: 'カード会社から届いたワンタイムパスワードを入力してください',
    en: 'Enter the one-time password from your card issuer',
    zh: '请输入发卡行发送的一次性密码',
    ko: '카드사에서 받은 일회용 비밀번호를 입력하세요',
  },
  verify: { ja: '認証する', en: 'Verify', zh: '验证', ko: '인증' },
  paypayStart: { ja: 'PayPayで支払う', en: 'Pay with PayPay', zh: '使用PayPay支付', ko: 'PayPay로 결제' },
  paypayScan: {
    ja: 'PayPayアプリでこのQRを読み取ってください',
    en: 'Scan this QR with the PayPay app',
    zh: '请用PayPay应用扫描此二维码',
    ko: 'PayPay 앱으로 이 QR을 스캔하세요',
  },
  paypayApprove: { ja: 'PayPayアプリで承認', en: 'Approve in PayPay app', zh: '在PayPay应用中确认', ko: 'PayPay 앱에서 승인' },
  konbiniStore: { ja: 'お支払いコンビニ', en: 'Choose a store', zh: '选择便利店', ko: '편의점 선택' },
  phoneNumber: { ja: '電話番号', en: 'Phone number', zh: '电话号码', ko: '전화번호' },
  konbiniIssue: { ja: '払込票を発行', en: 'Get payment slip', zh: '获取付款单', ko: '납부표 발급' },
  konbiniCode: { ja: '受付番号', en: 'Payment code', zh: '受理编号', ko: '접수 번호' },
  konbiniHint: {
    ja: 'レジでこの番号を伝えてお支払いください。',
    en: 'Give this code at the register and pay.',
    zh: '请在收银台出示此编号并付款。',
    ko: '계산대에서 이 번호를 말씀하시고 결제하세요.',
  },
  konbiniPaid: { ja: '支払い完了', en: 'I have paid', zh: '已付款', ko: '결제 완료' },
  walletConfirm: { ja: 'お支払いを確認', en: 'Confirm payment', zh: '确认支付', ko: '결제 확인' },
  receiptTitle: { ja: 'お支払い完了', en: 'Payment complete', zh: '支付完成', ko: '결제 완료' },
  receiptNo: { ja: '領収番号', en: 'Receipt no.', zh: '收据编号', ko: '영수증 번호' },
  toGuide: { ja: '施設ガイドへ', en: 'Continue to the guide', zh: '前往设施指南', ko: '가이드로 이동' },
  prepaidNote: { ja: 'ご予約時にお支払い済みです。', en: 'Paid in advance with your booking.', zh: '预订时已付款。', ko: '예약 시 결제가 완료되었습니다.' },
  steps: { ja: 'ステップ {n} / {total}', en: 'Step {n} of {total}', zh: '第 {n} 步 / 共 {total} 步', ko: '{n}/{total} 단계' },
} satisfies Record<string, Localized>

export type MessageKey = keyof typeof dict

export function t(lang: Lang, key: MessageKey, vars: Record<string, string | number> = {}): string {
  const template = dict[key][lang]
  return Object.entries(vars).reduce((out, [name, value]) => out.replaceAll(`{${name}}`, String(value)), template)
}

export function pick(localized: Localized, lang: Lang): string {
  return localized[lang] || localized.en
}

export function yen(amount: number): string {
  return `¥${amount.toLocaleString('ja-JP')}`
}

const DATE_LOCALE: Record<Lang, string> = { ja: 'ja-JP', en: 'en-US', zh: 'zh-CN', ko: 'ko-KR' }

/** "Today" through "today + nights" for the booking-found/site screens, formatted per locale. */
export function stayDates(lang: Lang, nights: number): string {
  const format = new Intl.DateTimeFormat(DATE_LOCALE[lang], { month: 'numeric', day: 'numeric', weekday: 'short' })
  const checkIn = new Date()
  const checkOut = new Date()
  checkOut.setDate(checkOut.getDate() + nights)
  return `${format.format(checkIn)} – ${format.format(checkOut)}`
}
