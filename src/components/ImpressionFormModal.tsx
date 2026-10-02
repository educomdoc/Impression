import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Camera,
  MapPin,
  Clock,
  Sun,
  CloudFog,
  Wind,
  CloudRain,
  Sunset,
  Tag,
  Heart,
  ChevronRight,
  Info,
  Check,
  Flame,
  HelpCircle,
  Upload
} from 'lucide-react';
import { SAYUWON_SPACES, EMOTIONS_BEFORE, EMOTIONS_AFTER, NATURE_STAMPS } from '../data/sayuwonSpaces';
import { WeatherType, Impression } from '../types';

interface ImpressionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (impressionData: Omit<Impression, 'id' | 'createdAt' | 'likesCount' | 'isLikedByMe' | 'comments'>) => void;
  initialSpaceId?: string;
  initialMeditationMinutes?: number;
}

export const ImpressionFormModal: React.FC<ImpressionFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialSpaceId,
  initialMeditationMinutes
}) => {
  const [selectedSpaceId, setSelectedSpaceId] = useState<string>(initialSpaceId || 'sodae');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState('사유자');
  const [weather, setWeather] = useState<WeatherType>('sunny');
  const [walkDuration, setWalkDuration] = useState<number>(60);
  const [meditationMinutes, setMeditationMinutes] = useState<number>(initialMeditationMinutes || 15);
  const [emotionBefore, setEmotionBefore] = useState<string>('머릿속이 복잡함');
  const [emotionAfter, setEmotionAfter] = useState<string>('고요한 평온');
  const [mindTemp, setMindTemp] = useState<number>(38.2);
  const [tagsInput, setTagsInput] = useState<string>('사유원, 비움, 평온');
  const [photoUrl, setPhotoUrl] = useState<string>(NATURE_STAMPS[0].url);
  const [isCustomPhoto, setIsCustomPhoto] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [errorMessage, setErrorMessage] = useState('');

  React.useEffect(() => {
    if (initialSpaceId) {
      setSelectedSpaceId(initialSpaceId);
      const spaceObj = SAYUWON_SPACES.find(s => s.id === initialSpaceId);
      if (spaceObj && !isCustomPhoto) {
        setPhotoUrl(spaceObj.image);
      }
    }
  }, [initialSpaceId, isCustomPhoto]);

  React.useEffect(() => {
    if (initialMeditationMinutes) {
      setMeditationMinutes(initialMeditationMinutes);
    }
  }, [initialMeditationMinutes]);

  if (!isOpen) return null;

  const currentSpace = SAYUWON_SPACES.find(s => s.id === selectedSpaceId) || SAYUWON_SPACES[0];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPhotoUrl(event.target.result as string);
        setIsCustomPhoto(true);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleInsertPrompt = (promptText: string) => {
    setContent(prev => (prev ? `${prev}\n\n${promptText}` : promptText));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('소감의 제목이나 마음에 남은 한 줄을 적어주세요.');
      setActiveStep(2);
      return;
    }
    if (!content.trim()) {
      setErrorMessage('머물렀던 사유와 소감을 적어주세요.');
      setActiveStep(2);
      return;
    }

    const today = new Date();
    const dateFormatted = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;
    const hours = today.getHours();
    const timeFormatted = `${hours >= 12 ? '오후' : '오전'} ${hours % 12 || 12}:${String(today.getMinutes()).padStart(2, '0')}`;

    const tagsArray = tagsInput
      .split(/[,#\s]+/)
      .map(t => t.trim())
      .filter(t => t.length > 0);

    onSubmit({
      title: title.trim(),
      content: content.trim(),
      spaceId: selectedSpaceId,
      spaceName: currentSpace.name,
      authorName: authorName.trim() || '익명의 사유자',
      date: dateFormatted,
      timeString: timeFormatted,
      weather,
      walkDurationMinutes: walkDuration,
      meditationMinutes: meditationMinutes,
      emotionBefore,
      emotionAfter,
      mindTemperature: mindTemp,
      photoUrl: photoUrl || currentSpace.image,
      tags: tagsArray.length > 0 ? tagsArray : ['사유원', '숲체험'],
      isPublic
    });

    onClose();
  };

  const weatherOptions: { type: WeatherType; label: string; icon: React.ReactNode }[] = [
    { type: 'sunny', label: '맑은 숲빛', icon: <Sun className="w-3.5 h-3.5 text-amber-500" /> },
    { type: 'mist', label: '새벽 안개', icon: <CloudFog className="w-3.5 h-3.5 text-slate-500" /> },
    { type: 'wind', label: '솔바람', icon: <Wind className="w-3.5 h-3.5 text-emerald-600" /> },
    { type: 'rain', label: '비 갠 숲', icon: <CloudRain className="w-3.5 h-3.5 text-blue-500" /> },
    { type: 'sunset', label: '황혼 노을', icon: <Sunset className="w-3.5 h-3.5 text-orange-500" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[92vh] flex flex-col bg-[#fbf9f4] rounded-3xl shadow-2xl border border-[#ded5c5] overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#e7decfa0] flex items-center justify-between bg-[#f4ede0]/80">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#8c5737]"></span>
            <h3 className="font-serif-kr font-bold text-lg text-[#2a3427]">사유의 소감 남기기</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#e4dcce] text-[#6d6353] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-3 px-4 pt-3 pb-2 gap-2 border-b border-[#ece4d6] text-center text-base">
          <button
            onClick={() => setActiveStep(1)}
            className={`py-1.5 rounded-xl transition-all font-medium ${
              activeStep === 1
                ? 'bg-[#3b4c38] text-white shadow-xs'
                : 'bg-[#eee7db] text-[#6b6051]'
            }`}
          >
            1. 공간과 시간
          </button>
          <button
            onClick={() => setActiveStep(2)}
            className={`py-1.5 rounded-xl transition-all font-medium ${
              activeStep === 2
                ? 'bg-[#3b4c38] text-white shadow-xs'
                : 'bg-[#eee7db] text-[#6b6051]'
            }`}
          >
            2. 마음과 소감
          </button>
          <button
            onClick={() => setActiveStep(3)}
            className={`py-1.5 rounded-xl transition-all font-medium ${
              activeStep === 3
                ? 'bg-[#3b4c38] text-white shadow-xs'
                : 'bg-[#eee7db] text-[#6b6051]'
            }`}
          >
            3. 사진과 서명
          </button>
        </div>

        {errorMessage && (
          <div className="mx-4 mt-3 px-3 py-2 rounded-xl bg-rose-50 text-rose-800 text-base border border-rose-200">
            {errorMessage}
          </div>
        )}

        {/* Form Body - Scrollable */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {/* STEP 1: SPACE & TIME */}
          {activeStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Space Selection */}
              <div>
                <label className="block text-base font-semibold text-[#41392e] mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#3b4c38]" />
                  머무른 사유원의 공간
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {SAYUWON_SPACES.map((space) => {
                    const isSelected = space.id === selectedSpaceId;
                    return (
                      <button
                        type="button"
                        key={space.id}
                        onClick={() => {
                          setSelectedSpaceId(space.id);
                          if (!isCustomPhoto) {
                            setPhotoUrl(space.image);
                          }
                        }}
                        className={`text-left p-2.5 rounded-2xl border transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[#3b4c38] text-white border-[#3b4c38] shadow-sm'
                            : 'bg-white/70 text-[#3b342b] border-[#e0d6c5] hover:bg-white'
                        }`}
                      >
                        <div>
                          <div className="font-serif-kr font-bold text-sm leading-tight">
                            {space.name}
                          </div>
                          <div className={`text-[18px] mt-0.5 ${isSelected ? 'text-[#c7dac4]' : 'text-[#7e7464]'}`}>
                            {space.architect || space.tag}
                          </div>
                        </div>
                        <div className={`text-[18px] mt-2 font-medium px-2 py-0.5 rounded-full inline-block self-start ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-[#eee7da] text-[#554b3e]'
                        }`}>
                          {space.tag}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Weather selection */}
              <div>
                <label className="block text-base font-semibold text-[#41392e] mb-2">
                  숲의 날씨
                </label>
                <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
                  {weatherOptions.map((opt) => (
                    <button
                      type="button"
                      key={opt.type}
                      onClick={() => setWeather(opt.type)}
                      className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-base flex items-center gap-1.5 border transition-all ${
                        weather === opt.type
                          ? 'bg-[#ede5d6] text-[#2c3529] border-[#b0a28f] font-semibold shadow-xs'
                          : 'bg-white/60 text-[#6d6353] border-[#e4dcce] hover:bg-white'
                      }`}
                    >
                      {opt.icon}
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Walking & Meditation Duration */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-[#f2ecdf]/70 border border-[#e2d8c7]">
                <div>
                  <label className="block text-[20px] font-medium text-[#5c5243] mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#3e503c]" />
                    산책 시간
                  </label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="10"
                      max="360"
                      step="10"
                      value={walkDuration}
                      onChange={(e) => setWalkDuration(Number(e.target.value))}
                      className="w-16 px-2 py-1.5 rounded-lg bg-white border border-[#ded5c5] text-base font-bold text-center text-[#2b3529]"
                    />
                    <span className="text-base text-[#63594a]">분 산책</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[20px] font-medium text-[#5c5243] mb-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#8a5b35]" />
                    명상/사색 시간
                  </label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      max="180"
                      step="5"
                      value={meditationMinutes}
                      onChange={(e) => setMeditationMinutes(Number(e.target.value))}
                      className="w-16 px-2 py-1.5 rounded-lg bg-white border border-[#ded5c5] text-base font-bold text-center text-[#2b3529]"
                    />
                    <span className="text-base text-[#63594a]">분 머묾</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="w-full py-3 rounded-2xl bg-[#3b4c38] text-white text-base font-medium flex items-center justify-center gap-1.5 shadow-sm hover:bg-[#32412f]"
                >
                  <span>다음: 마음과 소감 적기</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: MIND TRANSITION & IMPRESSION */}
          {activeStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Emotion Shift Section */}
              <div className="p-3.5 rounded-2xl bg-[#f2ecdf]/70 border border-[#e2d8c7] space-y-3">
                <div>
                  <label className="block text-base font-semibold text-[#483f33] mb-1.5">
                    숲에 오기 전 내 마음 (Before)
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {EMOTIONS_BEFORE.map((emo) => (
                      <button
                        type="button"
                        key={emo.id}
                        onClick={() => setEmotionBefore(emo.label)}
                        className={`px-2.5 py-1 rounded-lg text-base transition-all ${
                          emotionBefore === emo.label
                            ? 'bg-[#554b3e] text-white font-medium ring-2 ring-[#776957]'
                            : 'bg-white/80 text-[#5c5243] hover:bg-white border border-[#ded5c5]'
                        }`}
                      >
                        {emo.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-[#ded5c5] pt-2.5">
                  <label className="block text-base font-semibold text-[#30412e] mb-1.5">
                    숲을 걷고 명상한 후 (After)
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {EMOTIONS_AFTER.map((emo) => (
                      <button
                        type="button"
                        key={emo.id}
                        onClick={() => setEmotionAfter(emo.label)}
                        className={`px-2.5 py-1 rounded-lg text-base transition-all ${
                          emotionAfter === emo.label
                            ? 'bg-[#3b4c38] text-white font-medium ring-2 ring-[#273425]'
                            : 'bg-white/80 text-[#3b4c38] hover:bg-white border border-[#ded5c5]'
                        }`}
                      >
                        {emo.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mind Temperature Slider */}
                <div className="border-t border-[#ded5c5] pt-2.5">
                  <div className="flex items-center justify-between text-base mb-1">
                    <span className="font-semibold text-[#4b4033] flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-[#b34729]" />
                      마음의 온도 (따스한 온기)
                    </span>
                    <span className="font-bold text-[#b34729] font-mono text-sm">{mindTemp.toFixed(1)}°C</span>
                  </div>
                  <input
                    type="range"
                    min="36.0"
                    max="40.5"
                    step="0.1"
                    value={mindTemp}
                    onChange={(e) => setMindTemp(Number(e.target.value))}
                    className="w-full accent-[#b34729] h-2 bg-[#dfd6c7] rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[18px] text-[#837868] mt-0.5">
                    <span>차분한 36.5°</span>
                    <span>포근한 38.0°</span>
                    <span>가슴 벅찬 40.0°+</span>
                  </div>
                </div>
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-base font-semibold text-[#41392e] mb-1.5">
                  오늘 숲이 건넨 한마디 (소감 제목) *
                </label>
                <input
                  type="text"
                  placeholder="예: 명정의 물소리에 찌든 생각을 씻어내다"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={50}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#ded5c5] text-sm text-[#2a3327] placeholder:text-[#9c9180] focus:outline-none focus:ring-2 focus:ring-[#3b4c38]"
                />
              </div>

              {/* Prompts Inspiration Pills */}
              <div>
                <div className="flex items-center gap-1 text-[20px] text-[#716656] mb-1.5 font-medium">
                  <HelpCircle className="w-3 h-3 text-[#3b4c38]" />
                  <span>사유를 돕는 영감의 질문 (클릭 시 본문에 추가)</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    '가장 오래 발길이 멈춘 자리는?',
                    '숲에 버리고 온 생각은 무엇인가요?',
                    '나무와 바람에게서 배운 것은?',
                    '집으로 돌아가는 발걸음에 담긴 다짐은?'
                  ].map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleInsertPrompt(`[ ${p} ]\n`)}
                      className="text-[20px] px-2.5 py-1 rounded-lg bg-[#eee8db] text-[#554a3d] hover:bg-[#e4dcce] transition-colors"
                    >
                      + {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Textarea */}
              <div>
                <label className="block text-base font-semibold text-[#41392e] mb-1.5">
                  깊은 소감과 머문 사유 (본문) *
                </label>
                <textarea
                  rows={5}
                  placeholder="사유원 숲길을 걸으며, 고요한 공간 속에서 느낀 감정과 마주한 깨달음을 편안하게 적어보세요..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-3.5 rounded-2xl bg-white border border-[#ded5c5] text-sm text-[#2a3327] font-serif-kr placeholder:text-[#9c9180] focus:outline-none focus:ring-2 focus:ring-[#3b4c38] leading-relaxed"
                />
                <div className="text-right text-[20px] text-[#8e8372] mt-1">
                  {content.length} 자
                </div>
              </div>

              {/* Tags Input */}
              <div>
                <label className="block text-base font-semibold text-[#41392e] mb-1.5 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-[#3b4c38]" />
                  키워드 태그 (쉼표로 구분)
                </label>
                <input
                  type="text"
                  placeholder="명정, 승효상, 물소리, 비움, 치유"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#ded5c5] text-base text-[#2a3327]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveStep(1)}
                  className="flex-1 py-3 rounded-2xl bg-[#eee7db] text-[#53493e] text-base font-medium hover:bg-[#e3d9cc]"
                >
                  이전
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep(3)}
                  className="flex-2 py-3 rounded-2xl bg-[#3b4c38] text-white text-base font-medium flex items-center justify-center gap-1.5 shadow-sm hover:bg-[#32412f]"
                >
                  <span>다음: 사진과 서명</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PHOTO & SIGNATURE */}
          {activeStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Photo preview & stamps */}
              <div>
                <label className="block text-base font-semibold text-[#41392e] mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Camera className="w-3.5 h-3.5 text-[#3b4c38]" />
                    사유의 사진 / 숲 엽서 선택
                  </span>
                  <span className="text-[20px] text-[#7d7262]">직접 업로드 또는 감성 엽서 선택</span>
                </label>

                {/* Selected Photo Preview */}
                <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-[#ded5c5] mb-3 bg-[#e8e2d4]">
                  <img
                    src={photoUrl || currentSpace.image}
                    alt="소감 사진"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
                    <span className="text-white text-base font-serif-kr">
                      {currentSpace.name} - {currentSpace.quote}
                    </span>
                  </div>
                </div>

                {/* Custom File Upload Button */}
                <div className="flex items-center gap-2 mb-3">
                  <label className="cursor-pointer flex-1 py-2 px-3 rounded-xl bg-white border border-[#ded5c5] text-base font-medium text-[#463d32] hover:bg-[#faf7f2] flex items-center justify-center gap-1.5 shadow-2xs">
                    <Upload className="w-3.5 h-3.5 text-[#3b4c38]" />
                    <span>내 폰에서 사진 올리기</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Preset Nature Stamps */}
                <div className="text-[20px] text-[#6d6353] font-medium mb-1.5">
                  사유원 힐링 포토 스탬프에서 고르기:
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {NATURE_STAMPS.map((stamp) => {
                    const isSelected = photoUrl === stamp.url;
                    return (
                      <button
                        type="button"
                        key={stamp.id}
                        onClick={() => {
                          setPhotoUrl(stamp.url);
                          setIsCustomPhoto(false);
                        }}
                        className={`relative rounded-xl overflow-hidden aspect-4/3 border-2 transition-all ${
                          isSelected ? 'border-[#3b4c38] ring-2 ring-[#3b4c38]/40 scale-102' : 'border-transparent opacity-80 hover:opacity-100'
                        }`}
                      >
                        <img src={stamp.url} alt={stamp.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <span className="text-[18px] text-white font-medium text-center px-1 leading-tight">
                            {stamp.name}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#3b4c38] text-white flex items-center justify-center">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Author Signature & Nickname */}
              <div className="p-3.5 rounded-2xl bg-[#f2ecdf]/70 border border-[#e2d8c7] space-y-3">
                <div>
                  <label className="block text-base font-semibold text-[#483e32] mb-1">
                    사유자 서명 (닉네임)
                  </label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="예: 솔바람 님, 숲의 벗, 침묵의 여행자"
                    maxLength={20}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#ded5c5] text-base font-medium text-[#2d362a]"
                  />
                </div>

                {/* Public vs Private */}
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <div className="text-base font-semibold text-[#322c23]">
                      사유의 숲 방명록에 함께 나누기
                    </div>
                    <div className="text-[20px] text-[#736858]">
                      {isPublic ? '다른 방문객들과 온기를 공유합니다.' : '나만의 서랍에 비공개로 간직합니다.'}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPublic(!isPublic)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isPublic ? 'bg-[#3b4c38]' : 'bg-[#ded6c7]'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isPublic ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="flex-1 py-3 rounded-2xl bg-[#eee7db] text-[#53493e] text-base font-medium hover:bg-[#e3d9cc]"
                >
                  이전
                </button>
                <button
                  type="submit"
                  className="flex-2 py-3 rounded-2xl bg-[#3b4c38] text-white text-base font-bold flex items-center justify-center gap-1.5 shadow-md hover:bg-[#303f2e] transition-all"
                >
                  <Sparkles className="w-4 h-4 text-emerald-300" />
                  <span>소감록에 남기기</span>
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
