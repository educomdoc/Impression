import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { SAYUWON_SPACES } from '../data/sayuwonSpaces';
import { ForestSpace } from '../types';

interface MeditationTimerProps {
  onCompleteToJournal: (minutes: number, spaceId: string) => void;
}

export const MeditationTimer: React.FC<MeditationTimerProps> = ({ onCompleteToJournal }) => {
  const [selectedMinutes, setSelectedMinutes] = useState<number>(5);
  const [timeLeft, setTimeLeft] = useState<number>(5 * 60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [selectedSpace, setSelectedSpace] = useState<ForestSpace>(SAYUWON_SPACES[0]); // default to 명정
  
  // 4-phase box breathing cycle: 들숨(4s) -> 머뭄(4s) -> 날숨(4s) -> 비움(2s)
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const [breathText, setBreathText] = useState('천천히 들이마십니다 (들숨)');
  const [breathProgress, setBreathProgress] = useState(0); // 0 to 1

  const timerRef = useRef<number | null>(null);
  const breathAnimRef = useRef<number | null>(null);

  // Set initial time when minutes change
  const handleSelectMinutes = (mins: number) => {
    if (isActive) return;
    setSelectedMinutes(mins);
    setTimeLeft(mins * 60);
    setIsCompleted(false);
  };

  // Breathing animation loop
  useEffect(() => {
    if (!isActive) {
      setBreathText('편안한 자세로 호흡을 고르세요');
      setBreathProgress(0.2);
      return;
    }

    const cycleDuration = 14000; // 4 + 4 + 4 + 2 = 14s
    const startTime = performance.now();

    const loop = (now: number) => {
      const elapsed = (now - startTime) % cycleDuration;
      
      if (elapsed < 4000) {
        setBreathPhase('inhale');
        setBreathText('맑은 숲 공기를 깊게 들이쉽니다 (들숨)');
        setBreathProgress(elapsed / 4000);
      } else if (elapsed < 8000) {
        setBreathPhase('hold');
        setBreathText('가슴에 평온을 머금습니다 (멈춤)');
        setBreathProgress(1.0);
      } else if (elapsed < 12000) {
        setBreathPhase('exhale');
        setBreathText('마음의 찌꺼기를 길게 비워냅니다 (날숨)');
        setBreathProgress(1.0 - (elapsed - 8000) / 4000);
      } else {
        setBreathPhase('rest');
        setBreathText('텅 빈 고요를 온전히 바라봅니다 (비움)');
        setBreathProgress(0.05);
      }

      breathAnimRef.current = requestAnimationFrame(loop);
    };

    breathAnimRef.current = requestAnimationFrame(loop);

    return () => {
      if (breathAnimRef.current) cancelAnimationFrame(breathAnimRef.current);
    };
  }, [isActive]);

  // Main countdown
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const handleStart = () => {
    setIsActive(true);
    setIsCompleted(false);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(selectedMinutes * 60);
    setIsCompleted(false);
  };

  const handleComplete = () => {
    setIsActive(false);
    setIsCompleted(true);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="max-w-md mx-auto px-4 py-4 pb-24">
      {/* Title Header */}
      <div className="text-center mb-5">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#ebe4d5] text-[#554a3e] mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#8c673d]" />
          사유원 숲의 고요
        </span>
        <h2 className="text-2xl font-bold font-serif-kr text-[#283226]">숲길 명상실</h2>
        <p className="text-xs text-[#6e6456] mt-1 font-sans-kr">
          사유원의 공간에 마음을 두고, 호흡의 파동에 집중해 봅니다.
        </p>
      </div>

      {/* Space Selector Card */}
      <div className="mb-5 p-3.5 rounded-2xl bg-[#eee8db]/80 border border-[#ded5c4] shadow-xs">
        <div className="flex items-center justify-between text-xs text-[#6b6151] mb-2 font-medium">
          <span>명상할 사유원의 공간 선택</span>
          <span className="text-[#3b4c38]">{selectedSpace.tag}</span>
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {SAYUWON_SPACES.map((space) => {
            const isSelected = space.id === selectedSpace.id;
            return (
              <button
                key={space.id}
                onClick={() => setSelectedSpace(space)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#3b4b39] text-white font-medium shadow-sm'
                    : 'bg-[#faf7f0] text-[#53493e] hover:bg-white border border-[#dfd7c8]'
                }`}
              >
                <span>{space.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
        <p className="text-[18px] text-[#6d7968] mt-2 font-serif-kr italic">
          💡 {selectedSpace.meditationTip}
        </p>
      </div>

      {/* Breathing Visualizer Center */}
      <div className="relative flex flex-col items-center justify-center my-6">
        {/* Pulsing Breathing Ring */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          {/* Subtle Outer Glow Wave */}
          <div
            className="absolute rounded-full transition-transform duration-700 ease-out bg-radial from-[#8da887]/30 to-transparent"
            style={{
              width: '100%',
              height: '100%',
              transform: `scale(${1 + breathProgress * 0.35})`,
              opacity: isActive ? 0.7 + breathProgress * 0.3 : 0.3,
            }}
          />

          {/* Middle Ring */}
          <div
            className="absolute rounded-full border-2 border-[#546b51]/30 transition-transform duration-700 ease-out"
            style={{
              width: '85%',
              height: '85%',
              transform: `scale(${0.85 + breathProgress * 0.25})`,
            }}
          />

          {/* Central Sphere */}
          <div className="w-48 h-48 rounded-full bg-gradient-to-br from-[#455743] via-[#354533] to-[#253223] text-white flex flex-col items-center justify-center shadow-xl border-4 border-[#e9e3d5]/40 z-10 px-4 text-center">
            <span className="text-3xl font-bold font-mono tracking-wider text-[#e8f1e5]">
              {formatTime(timeLeft)}
            </span>
            <span className="text-[18px] text-[#b8cdb5] mt-1 font-serif-kr">
              {isActive ? breathPhase.toUpperCase() : '준비'}
            </span>
          </div>
        </div>

        {/* Breathing Guide Text */}
        <div className="mt-4 text-center px-4">
          <p className="text-sm font-medium text-[#3b4c38] font-serif-kr min-h-[28px] transition-all">
            {breathText}
          </p>
        </div>
      </div>

      {/* Duration Selector (Only active when stopped) */}
      {!isActive && !isCompleted && (
        <div className="flex justify-center gap-2 mb-6">
          {[3, 5, 10, 15, 20].map((mins) => (
            <button
              key={mins}
              onClick={() => handleSelectMinutes(mins)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedMinutes === mins
                  ? 'bg-[#3b4b39] text-white shadow-xs'
                  : 'bg-[#eee7da] text-[#554b3e] hover:bg-[#e2dacb]'
              }`}
            >
              {mins}분
            </button>
          ))}
        </div>
      )}

      {/* Main Action Buttons */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <button
          onClick={handleReset}
          className="p-3 rounded-full bg-[#eee7db] text-[#5a5043] hover:bg-[#e3dacf] transition-colors"
          title="처음으로 되돌리기"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        {isActive ? (
          <button
            onClick={handlePause}
            className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#8c5633] text-white font-semibold text-sm shadow-md hover:bg-[#7b4929] transition-transform active:scale-95"
          >
            <Pause className="w-4 h-4 fill-current" />
            <span>잠시 멈춤</span>
          </button>
        ) : (
          <button
            onClick={handleStart}
            className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#3b4c38] text-white font-semibold text-sm shadow-md hover:bg-[#32422f] transition-transform active:scale-95"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{timeLeft < selectedMinutes * 60 ? '이어하기' : '명상 시작'}</span>
          </button>
        )}
      </div>

      {/* Completed Banner */}
      {isCompleted && (
        <div className="p-4 rounded-2xl bg-[#e5ece3] border border-[#c3d6c0] text-[#253523] text-center animate-in fade-in zoom-in-95 duration-300">
          <div className="flex items-center justify-center gap-2 text-emerald-800 font-bold text-sm mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>{selectedMinutes}분간의 평온한 사유가 끝났습니다</span>
          </div>
          <p className="text-xs text-[#4b5e49] font-serif-kr mb-3">
            맑게 갠 마음에 남은 생각과 감정을 지금 바로 소감록에 적어보세요.
          </p>
          <button
            onClick={() => onCompleteToJournal(selectedMinutes, selectedSpace.id)}
            className="w-full py-2.5 px-4 rounded-xl bg-[#3b4c38] text-white font-medium text-xs flex items-center justify-center gap-2 shadow-xs hover:bg-[#2f3f2d] transition-all"
          >
            <span>이 여운으로 소감 남기기</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
