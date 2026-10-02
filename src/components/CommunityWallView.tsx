import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Search,
  Filter,
  Plus,
  Flame,
  Heart,
  Compass,
  Wind
} from 'lucide-react';
import { Impression } from '../types';
import { SAYUWON_SPACES } from '../data/sayuwonSpaces';
import { ImpressionCard } from './ImpressionCard';

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
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl p-5 overflow-hidden text-white shadow-md pine-gradient">
        {/* Subtle background glow */}
        <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-emerald-600/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-base font-medium bg-white/15 text-[#e5f0e3] backdrop-blur-xs">
            <Wind className="w-3.5 h-3.5 text-emerald-300" />
            <span>사유원 숲체험 &amp; 명상 소감록</span>
          </div>

          <h2 className="text-2xl font-bold font-serif-kr tracking-tight leading-snug">
            숲에 머문 마음,<br />고요한 사유의 방명록
          </h2>

          <p className="text-base text-[#c6d7c4] font-serif-kr leading-relaxed">
            승효상, 알바로 시자의 건축과 300년 모과나무 숲길을 걸은 이들이 남긴 성찰과 온기의 기록입니다.
          </p>

          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={onOpenWriteModal}
              className="py-2.5 px-4 rounded-2xl bg-[#fdfbf7] text-[#242f22] text-base font-bold hover:bg-white inline-flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
            >
              <Plus className="w-4 h-4 text-[#3b4c38]" />
              <span>나도 소감 남기기</span>
            </button>

            <span className="text-[20px] text-[#b8cdb6] pl-2 font-serif-kr">
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
