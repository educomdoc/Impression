import { ForestSpace, EmotionTag, Impression } from '../types';
import imgSodae from '../assets/images/regenerated_image_1790755611474.jpg';
import imgSoyoheon from '../assets/images/regenerated_image_1790755609937.jpg';
import imgPoongseol from '../assets/images/regenerated_image_1790755608037.jpg';
import imgYoowon from '../assets/images/regenerated_image_1790755606081.jpg';
import imgMyeongjeong from '../assets/images/regenerated_image_1790755604282.jpg';
import imgGagabinbin from '../assets/images/regenerated_image_1790755601349.jpg';

export const SAYUWON_SPACES: ForestSpace[] = [
  {
    id: 'sodae',
    name: '소대 (巢臺)',
    subtitle: '알바로 시자의 20.5m 사색의 전망탑',
    description: '15도 기울어진 채 하늘을 향해 솟아오른 백색 콘크리트 탑. 계단을 천천히 오르며 창 너머로 변화하는 숲의 풍경을 마주하고, 꼭대기에서 사유원의 수목과 팔공산의 웅장한 능선을 굽어보는 성찰의 망루입니다.',
    architect: '알바로 시자 (Álvaro Siza)',
    tag: '시선과 비상',
    image: imgSodae,
    meditationTip: '기울어진 탑을 오르내릴 때 내 발걸음의 무게중심과 시선의 확장에 집중해보세요.',
    quote: '"하늘과 땅 사이, 나를 내려놓고 숲을 굽어보는 자리"'
  },
  {
    id: 'soyoheon',
    name: '소요헌 (逍遙軒)',
    subtitle: '포르투갈 거장 알바로 시자의 백색 콘크리트 미학',
    description: '숲의 능선에 조용히 안착한 건축물. 거친 콘크리트 개구부 사이로 스며드는 빛의 궤적과 소나무 숲의 프레임이 절묘한 침묵의 미술관이자 명상처를 이룹니다.',
    architect: '알바로 시자 (Álvaro Siza)',
    tag: '빛과 그림자',
    image: imgSoyoheon,
    meditationTip: '콘크리트 벽 너머로 비쳐드는 빛의 이동을 가만히 응시해보세요.',
    quote: '"건축이 자연의 일부가 되어 숨 쉬는 곳"'
  },
  {
    id: 'poongseol',
    name: '풍설기천년 (風雪幾千年)',
    subtitle: '천 년의 풍설을 견뎌낸 300년 모과나무 108그루',
    description: '수령 300년이 넘는 고목 모과나무 108그루가 자리를 지키는 사색의 정원. 비바람을 견뎌낸 뒤틀린 줄기마다 인고와 거룩한 생명의 경이가 깃들어 있습니다.',
    architect: '자연과 세월의 합작',
    tag: '시간과 생명',
    image: imgPoongseol,
    meditationTip: '모과나무의 깊게 패인 수피를 손으로 느끼며 시간의 무게를 음미해보세요.',
    quote: '"인고의 세월이 빚어낸 거룩한 생명력"'
  },
  {
    id: 'yoowon',
    name: '유원 (幽園)',
    subtitle: '숲의 그늘과 돌, 물길이 어우러진 한국식 전통 정원',
    description: '은밀하고 그윽한 골짜기를 따라 조성된 한국 전통 정원의 숨결. 자연을 거스르지 않는 소박한 돌담과 숲의 향기, 졸졸 흐르는 계곡 물소리가 마음에 깊은 쉼을 선사합니다.',
    architect: '자연 친화적 전통 조경',
    tag: '그윽함과 쉼',
    image: imgYoowon,
    meditationTip: '그윽한 숲 그늘 아래 바위에 걸터앉아 자연의 고요한 숨소리에 귀를 기울여보세요.',
    quote: '"그윽한 숲 그늘 아래 온전히 젖어드는 휴식"'
  },
  {
    id: 'myeongjeong',
    name: '명정 (溟亭)',
    subtitle: '붉은 코르텐강과 고요한 수공간, 승효상의 사유처',
    description: '코르텐강(내후성 강판)으로 둘러싸인 깊은 중정 속 물과 빛. 세상의 소음이 차단되고 오직 물결의 일렁임과 붉은 벽의 그림자만이 내면을 비춥니다.',
    architect: '승효상 건축가',
    tag: '침묵과 비움',
    image: imgMyeongjeong,
    meditationTip: '수면에 비치는 하늘과 붉은 벽 사이에서 호흡하며 잡념을 물속으로 흘려보내세요.',
    quote: '"비움으로써 채워지는 침묵의 영토"'
  },
  {
    id: 'gagabinbin',
    name: '가가빈빈 (嘉嘉彬彬)',
    subtitle: '숲속 파노라마와 따뜻한 차 한 잔, 사유의 티하우스',
    description: '아름답고 빛나는 사람들이 모여 차를 나누는 사유원의 명소. 사방이 통유리로 열린 공간에서 연못과 능선을 내려다보며, 산책과 명상 후 따뜻한 차와 함께 마음에 머문 사유를 갈무리하는 자리입니다.',
    architect: '최욱 건축가',
    tag: '차와 여운',
    image: imgGagabinbin,
    meditationTip: '찻잔의 따스한 온기를 두 손으로 감싸 쥐고 차향을 음미하며 오늘 하루를 천천히 되짚어보세요.',
    quote: '"향기로운 차 한 잔과 함께 깊어지는 사유의 시간"'
  }
];

export const EMOTIONS_BEFORE: EmotionTag[] = [
  { id: 'b_tired', label: '지치고 무거움', category: 'before', color: 'bg-stone-200 text-stone-700' },
  { id: 'b_busy', label: '머릿속이 복잡함', category: 'before', color: 'bg-amber-100 text-amber-800' },
  { id: 'b_anxious', label: '불안과 조급함', category: 'before', color: 'bg-rose-100 text-rose-800' },
  { id: 'b_lost', label: '방황과 답답함', category: 'before', color: 'bg-purple-100 text-purple-800' },
  { id: 'b_empty', label: '공허하고 메마름', category: 'before', color: 'bg-blue-100 text-blue-800' },
  { id: 'b_curious', label: '기대와 호기심', category: 'before', color: 'bg-emerald-100 text-emerald-800' },
];

export const EMOTIONS_AFTER: EmotionTag[] = [
  { id: 'a_peace', label: '고요한 평온', category: 'after', color: 'bg-emerald-700 text-white' },
  { id: 'a_clear', label: '맑아진 머릿속', category: 'after', color: 'bg-teal-700 text-white' },
  { id: 'a_empty', label: '가벼운 비워냄', category: 'after', color: 'bg-stone-700 text-white' },
  { id: 'a_warm', label: '마음의 온기 회복', category: 'after', color: 'bg-amber-700 text-white' },
  { id: 'a_gratitude', label: '벅찬 감사와 사랑', category: 'after', color: 'bg-rose-700 text-white' },
  { id: 'a_insight', label: '새로운 통찰과 용기', category: 'after', color: 'bg-indigo-700 text-white' },
];

export const NATURE_STAMPS = [
  {
    id: 'stamp_sodae',
    name: '소대 전망탑',
    url: imgSodae
  },
  {
    id: 'stamp_soyoheon',
    name: '소요헌 빛의 회랑',
    url: imgSoyoheon
  },
  {
    id: 'stamp_poongseol',
    name: '300년 고목 모과나무',
    url: imgPoongseol
  },
  {
    id: 'stamp_yoowon',
    name: '유원의 그윽한 쉼터',
    url: imgYoowon
  },
  {
    id: 'stamp_myeongjeong',
    name: '명정의 물그림자',
    url: imgMyeongjeong
  },
  {
    id: 'stamp_gagabinbin',
    name: '가가빈빈 차실',
    url: imgGagabinbin
  }
];

export const INITIAL_IMPRESSIONS: Impression[] = [
  {
    id: 'imp-sodae-1',
    title: '소대의 20.5m 탑 위에서 내려다본 세상',
    content: '알바로 시자가 설계한 15도 기울어진 소대 전망탑을 천천히 걸어 올라갔습니다. 계단 틈새로 스며드는 빛을 따라 정상에 섰을 때, 눈앞에 펼쳐진 팔공산의 산세와 사유원의 숲이 가슴을 벅차게 했습니다. 높은 곳에 올라서니 내가 아등바등 붙잡고 있던 걱정들이 참 작게 느껴졌습니다.',
    spaceId: 'sodae',
    spaceName: '소대 (巢臺)',
    authorName: '바람의 시선',
    date: '2026.09.28',
    timeString: '오후 3:15',
    weather: 'wind',
    walkDurationMinutes: 80,
    meditationMinutes: 20,
    emotionBefore: '지치고 무거움',
    emotionAfter: '새로운 통찰과 용기',
    mindTemperature: 38.8,
    photoUrl: imgSodae,
    tags: ['소대', '알바로시자', '전망탑', '시선의확장', '팔공산'],
    isPublic: true,
    likesCount: 34,
    isLikedByMe: false,
    comments: [
      {
        id: 'c-sodae-1',
        author: '소요인',
        text: '소대 꼭대기에서 부는 바람을 맞으면 머리가 정말 맑아지더군요.',
        createdAt: '2026.09.28 17:20'
      }
    ],
    createdAt: Date.now() - 86400000 * 3
  },
  {
    id: 'imp-soyoheon-1',
    title: '소요헌에서 만난 빛의 궤적',
    content: '알바로 시자의 백색 콘크리트 공간 안으로 빛이 사선으로 쏟아졌습니다. 걷다가 멈추어 서서 창밖 소나무 숲의 흔들림을 지켜보았습니다. 내 생각도 빛처럼 천천히 방향을 틀고 있었습니다. 무언가를 더 채우려 애쓰던 일상에서 온전히 벗어나 텅 빈 자유를 누렸습니다.',
    spaceId: 'soyoheon',
    spaceName: '소요헌 (逍遙軒)',
    authorName: '빛과 그림자',
    date: '2026.09.29',
    timeString: '오후 4:15',
    weather: 'sunset',
    walkDurationMinutes: 110,
    meditationMinutes: 30,
    emotionBefore: '머릿속이 복잡함',
    emotionAfter: '가벼운 비워냄',
    mindTemperature: 37.8,
    photoUrl: imgSoyoheon,
    tags: ['알바로시자', '소요헌', '빛', '비움', '자유'],
    isPublic: true,
    likesCount: 22,
    isLikedByMe: false,
    comments: [],
    createdAt: Date.now() - 86400000 * 2
  },
  {
    id: 'imp-poongseol-1',
    title: '300년 모과나무 앞에서 깨달은 세월의 품격',
    content: '풍설기천년의 108그루 고목 모과나무 아래 섰습니다. 뒤틀리고 갈라진 껍질은 아픔의 흉터가 아니라 세월의 훈장이었습니다. 서른아홉, 삶의 분기점에서 조급했던 제 마음이 부끄러워졌습니다. 견디고 버티며 제자리를 지키는 것만으로도 이토록 거룩한 아름다움이 될 수 있음을 배웠습니다.',
    spaceId: 'poongseol',
    spaceName: '풍설기천년 (風雪幾千年)',
    authorName: '묵묵히 걷는 이',
    date: '2026.09.29',
    timeString: '오전 11:00',
    weather: 'sunny',
    walkDurationMinutes: 90,
    meditationMinutes: 20,
    emotionBefore: '불안과 조급함',
    emotionAfter: '새로운 통찰과 용기',
    mindTemperature: 39.2,
    photoUrl: imgPoongseol,
    tags: ['풍설기천년', '모과나무', '시간의무게', '위로', '버팀'],
    isPublic: true,
    likesCount: 45,
    isLikedByMe: true,
    comments: [
      {
        id: 'c-poongseol-1',
        author: '청산',
        text: '"견디고 버티는 것만으로 거룩하다"는 구절이 마음에 깊이 남습니다.',
        createdAt: '2026.09.29 13:20'
      }
    ],
    createdAt: Date.now() - 86400000
  },
  {
    id: 'imp-yoowon-1',
    title: '유원의 그윽한 숲 그늘에서 얻은 쉼',
    content: '유원의 돌담길을 따라 걸으며 산새 소리와 졸졸 흐르는 맑은 계곡 물소리에 귀를 기울였습니다. 도심 속에서 늘 쫓기듯 뛰던 심장이 비로소 자연의 박자에 맞춰 천천히 뛰기 시작했습니다. 아무런 목적 없이 그저 숲 그늘에 머무는 것만으로 영혼이 소생하는 느낌이었습니다.',
    spaceId: 'yoowon',
    spaceName: '유원 (幽園)',
    authorName: '자연의 숨결',
    date: '2026.09.30',
    timeString: '오전 10:20',
    weather: 'mist',
    walkDurationMinutes: 70,
    meditationMinutes: 25,
    emotionBefore: '공허하고 메마름',
    emotionAfter: '마음의 온기 회복',
    mindTemperature: 38.5,
    photoUrl: imgYoowon,
    tags: ['유원', '숲그늘', '휴식', '전통정원', '치유'],
    isPublic: true,
    likesCount: 29,
    isLikedByMe: false,
    comments: [],
    createdAt: Date.now() - 3600000 * 8
  },
  {
    id: 'imp-myeongjeong-1',
    title: '명정의 붉은 벽 사이로 고요를 마주하다',
    content: '승효상 건축가의 명정에 들어서는 순간, 세상의 온갖 소음이 거짓말처럼 멈추었습니다. 붉은 코르텐강 벽 사이에 고인 얕은 물을 가만히 내려다보며 30분간 호흡했습니다. 그동안 안고 있던 수많은 불안들이 바람에 스러지듯 가벼워졌습니다. 사유원이 왜 침묵의 영토인지 온몸으로 느낀 하루였습니다.',
    spaceId: 'myeongjeong',
    spaceName: '명정 (溟亭)',
    authorName: '솔바람 사유자',
    date: '2026.09.30',
    timeString: '오후 1:40',
    weather: 'sunny',
    walkDurationMinutes: 120,
    meditationMinutes: 30,
    emotionBefore: '머릿속이 복잡함',
    emotionAfter: '고요한 평온',
    mindTemperature: 38.6,
    photoUrl: imgMyeongjeong,
    tags: ['명정', '승효상', '침묵', '비움', '수공간'],
    isPublic: true,
    likesCount: 38,
    isLikedByMe: false,
    comments: [
      {
        id: 'c-myeong-1',
        author: '소요객',
        text: '명정의 물소리는 정말 영혼까지 맑게 씻어주는 기분이죠.',
        createdAt: '2026.09.30 14:10'
      }
    ],
    createdAt: Date.now() - 3600000 * 4
  },
  {
    id: 'imp-gagabinbin-1',
    title: '가가빈빈에서 따뜻한 차와 함께 정리한 오늘',
    content: '소대에서 시작해 명정까지 이어진 긴 숲길 산책 끝에 가가빈빈에 앉았습니다. 유리창 너머로 푸른 숲과 연못을 바라보며 따스한 차를 한 모금 넘겼습니다. 오늘 사유원에서 비워낸 자리에 평온과 감사가 조용히 차올랐습니다. 숲이 준 선물을 안고 다시 일상으로 돌아갈 힘을 얻었습니다.',
    spaceId: 'gagabinbin',
    spaceName: '가가빈빈 (嘉嘉彬彬)',
    authorName: '차 한 잔의 쉼',
    date: '2026.09.30',
    timeString: '오후 4:00',
    weather: 'sunset',
    walkDurationMinutes: 150,
    meditationMinutes: 20,
    emotionBefore: '방황과 답답함',
    emotionAfter: '벅찬 감사와 사랑',
    mindTemperature: 39.5,
    photoUrl: imgGagabinbin,
    tags: ['가가빈빈', '티하우스', '차한잔', '사유의마무리', '감사'],
    isPublic: true,
    likesCount: 31,
    isLikedByMe: false,
    comments: [],
    createdAt: Date.now() - 3600000
  }
];
