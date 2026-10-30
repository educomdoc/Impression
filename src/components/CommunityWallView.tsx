import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Sparkles,
  Search,
  Filter,
  Plus,
  Flame,
  Heart,
  Compass,
  Wind,
  Play,
  Pause,
  Volume2,
  VolumeX
} from 'lucide-react';
import { Impression } from '../types';
import { SAYUWON_SPACES } from '../data/sayuwonSpaces';
import { ImpressionCard } from './ImpressionCard';
import tourVideo from '../assets/images/둘러보기.mp4';

interface CommunityWallViewProps {
  impressions: Impression[];
  onOpenDetail: (impression: Impression) => void;
  onToggleLike: (id: string, e: React.MouseEvent) => void;
  onOpenPostcard: (impression: Impression, e: React.MouseEvent) => void;
  onOpenWriteModal: () => void;
}

export const CommunityWallView: React.FC<CommunityWallViewProps> = ({
  impressions,
  onOpenDetail,
  onToggleLike,
  onOpenPostcard,
  onOpenWriteModal
}) => {
  // --- 💡 [비디오 제어 상태 및 ref 추가] ---
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // 소리 활성화 여부

  // 💡 [핵심] 다른 탭(숲 명상, 공간 탐색, 나의 서랍 등)을 열었을 때 자동으로 정지
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    };
  }, []);

  // 화면을 누르면 재생 / 일시정지 토글
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // 음소거 토글 (선택 사항)
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpaceFilter, setSelectedSpaceFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');

  // Filter & sort
  const filteredImpressions = useMemo(() => {
    return impressions
      .filter((item) => {
        // Public filter
        if (!item.isPublic && !item.isMyRecord) return false;

        // Space filter
        if (selectedSpaceFilter !== 'all' && item.spaceId !== selectedSpaceFilter) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchContent = item.content.toLowerCase().includes(q);
          const matchAuthor = item.authorName.toLowerCase().includes(q);
          const matchSpace = item.spaceName.toLowerCase().includes(q);
          const matchTags = item.tags.some(t => t.toLowerCase().includes(q));
          return matchTitle || matchContent || matchAuthor || matchSpace || matchTags;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') {
          return b.likesCount - a.likesCount;
        }
        return b.createdAt - a.createdAt;
      });
  }, [impressions, selectedSpaceFilter, searchQuery, sortBy]);

  return (
    <div className="max-w-md mx-auto px-4 py-4 pb-24 space-y-5">
     <div 
        onClick={togglePlay}
        className="relative rounded-3xl overflow-hidden shadow-lg bg-black cursor-pointer group select-none aspect-video border border-[#ded5c4]"
        title="화면을 터치하면 영상과 소리가 재생/일시정지됩니다"
      >
        <video
          ref={videoRef}
          src={tourVideo}
          loop
          playsInline
          muted={isMuted}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className="w-full h-full object-cover"
        />

        {/* 상단 라벨 & 음소거 버튼 */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-none">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-black/50 text-white/90 backdrop-blur-md flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            사유원 둘러보기
          </span>

          <button
            type="button"
            onClick={toggleMute}
            className="p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-md pointer-events-auto transition-transform active:scale-95"
            title={isMuted ? "음소거 해제" : "음소거"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* 일시정지 상태일 때 중앙에 표시되는 재생 버튼 오버레이 */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-black/35 backdrop-blur-[1px] flex flex-col items-center justify-center gap-2 z-10 transition-opacity">
            <div className="w-13 h-13 rounded-full bg-white/90 text-[#3b4c38] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Play className="w-6 h-6 fill-current translate-x-0.5" />
            </div>
            <span className="text-xs font-serif-kr text-white/90 drop-shadow-md">
              터치하여 영상 &amp; 소리 재생
            </span>
          </div>
        )}

        {/* 재생 중일 때 하단 힌트 (hover 시 나타남) */}
        {isPlaying && (
          <div className="absolute bottom-2.5 right-3 px-2 py-0.5 rounded-md bg-black/40 text-white/80 text-[10px] backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity">
            터치하여 일시정지
          </div>
        )}
      </div>

      {/* 🌿 2. 기존 Hero Welcome Banner (비디오 아래로 배치) */}
      <div className="relative rounded-3xl p-5 overflow-hidden text-white shadow-md pine-gradient">
        {/* Subtle background glow */}
        <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-emerald-600/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/15 text-[#e5f0e3] backdrop-blur-xs">
            <Wind className="w-3.5 h-3.5 text-emerald-300" />
            <span>사유원 숲체험 &amp; 명상 소감록</span>
          </div>

          <h2 className="text-2xl font-bold font-serif-kr tracking-tight leading-snug">
            숲에 머문 마음,<br />고요한 사유의 방명록
          </h2>

          <p className="text-xs text-[#c6d7c4] font-serif-kr leading-relaxed">
            승효상, 알바로 시자의 건축과 300년 모과나무 숲길을 걸은 이들이 남긴 성찰과 온기의 기록입니다.
          </p>

          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={onOpenWriteModal}
              className="py-2.5 px-4 rounded-2xl bg-[#fdfbf7] text-[#242f22] text-xs font-bold hover:bg-white inline-flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
            >
              <Plus className="w-4 h-4 text-[#3b4c38]" />
              <span>나도 소감 남기기</span>
            </button>

            <span className="text-[11px] text-[#b8cdb6] pl-2 font-serif-kr">
              총 {impressions.length}개의 사유
            </span>
          </div>
        </div>
      </div>


      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#8a7f70] absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="공간명, 키워드(#비움, #물소리), 소감 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#fdfbf7] border border-[#e2d8c7] text-base text-[#2e372a] placeholder:text-[#998f80] focus:outline-none focus:ring-2 focus:ring-[#3b4c38] shadow-2xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-2.5 text-base text-[#8c8171] hover:text-[#332c22]"
          >
            초기화
          </button>
        )}
      </div>

      {/* Filter Row: Space chips & Sort */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-base text-[#6e6353]">
          <span className="font-semibold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[#3b4c38]" />
            공간별 사유 모아보기
          </span>
          {/* Sort toggle */}
          <div className="flex rounded-lg bg-[#eee7db] p-0.5 text-[20px]">
            <button
              onClick={() => setSortBy('latest')}
              className={`px-2 py-0.5 rounded-md transition-all ${
                sortBy === 'latest' ? 'bg-[#3b4c38] text-white font-medium shadow-2xs' : 'text-[#635849]'
              }`}
            >
              최신순
            </button>
            <button
              onClick={() => setSortBy('popular')}
              className={`px-2 py-0.5 rounded-md transition-all ${
                sortBy === 'popular' ? 'bg-[#3b4c38] text-white font-medium shadow-2xs' : 'text-[#635849]'
              }`}
            >
              공감순
            </button>
          </div>
        </div>

        {/* Space Horizontal Chips */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setSelectedSpaceFilter('all')}
            className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-base font-medium transition-all ${
              selectedSpaceFilter === 'all'
                ? 'bg-[#3b4c38] text-white shadow-xs'
                : 'bg-[#eee7da] text-[#554a3d] hover:bg-[#e4dcce]'
            }`}
          >
            전체 사유
          </button>
          {SAYUWON_SPACES.map((space) => {
            const isSelected = selectedSpaceFilter === space.id;
            return (
              <button
                key={space.id}
                onClick={() => setSelectedSpaceFilter(space.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-base font-medium transition-all ${
                  isSelected
                    ? 'bg-[#3b4c38] text-white shadow-xs'
                    : 'bg-[#eee7da] text-[#554a3d] hover:bg-[#e4dcce]'
                }`}
              >
                {space.name.split(' ')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Impressions List */}
      <div className="space-y-4">
        {filteredImpressions.length > 0 ? (
          filteredImpressions.map((impression) => (
            <ImpressionCard
              key={impression.id}
              impression={impression}
              onOpenDetail={onOpenDetail}
              onToggleLike={onToggleLike}
              onOpenPostcard={onOpenPostcard}
            />
          ))
        ) : (
          <div className="p-8 text-center bg-[#fdfbf7] rounded-3xl border border-dashed border-[#ded5c5] space-y-2">
            <Sparkles className="w-8 h-8 text-[#8c673d] mx-auto opacity-70" />
            <h4 className="font-serif-kr font-bold text-sm text-[#3b342a]">
              일치하는 사유가 없습니다
            </h4>
            <p className="text-base text-[#716656] font-serif-kr">
              다른 검색어나 공간 필터를 선택해보세요.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
