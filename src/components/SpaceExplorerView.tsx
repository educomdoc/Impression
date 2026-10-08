import React from 'react';
import { Sparkles, MapPin, Compass, ArrowRight, BookOpen, Wind } from 'lucide-react';
import { SAYUWON_SPACES } from '../data/sayuwonSpaces';
import { ForestSpace } from '../types';

interface SpaceExplorerViewProps {
  onSelectSpaceForImpression: (spaceId: string) => void;
  onSelectSpaceForMeditation: (spaceId: string) => void;
}

export const SpaceExplorerView: React.FC<SpaceExplorerViewProps> = ({
  onSelectSpaceForImpression,
  onSelectSpaceForMeditation
}) => {
  return (
    <div className="max-w-md mx-auto px-4 py-4 pb-24 space-y-6">
      {/* Introduction Banner */}
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#ebe4d5] text-[#554a3e] mb-2">
          <Compass className="w-3.5 h-3.5 text-[#3b4c38]" />
          사유원 (思惟園) 공간 안내
        </span>
        <h2 className="text-2xl font-bold font-serif-kr text-[#283226]">침묵과 사색의 영토</h2>
        <p className="text-xs text-[#6e6456] mt-1.5 font-serif-kr leading-relaxed">
          팔공산 자락, 거장 건축가들과 자연이 빚어낸 8개의 성스러운 사유처를 둘러보고 마음에 와닿는 자리에서 소감을 남겨보세요.
        </p>
      </div>

      {/* Spaces List */}
      <div className="space-y-5">
        {SAYUWON_SPACES.map((space) => (
          <div
            key={space.id}
            className="rounded-3xl bg-[#fdfbf7] border border-[#e4dcce] overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col"
          >
            {/* Image Banner */}
            <div className="relative w-full h-48 bg-[#e3dbcd]">
              <img
                src={space.image}
                alt={space.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold font-serif-kr">{space.name}</h3>
                  <span className="text-[18px] px-2 py-0.5 rounded-full bg-white/25 backdrop-blur-xs font-sans-kr">
                    {space.tag}
                  </span>
                </div>
                <div className="text-xs text-white/85 font-serif-kr mt-0.5">
                  {space.subtitle}
                </div>
              </div>
            </div>

            {/* Description & Contemplation Advice */}
            <div className="p-4 space-y-3">
              <p className="text-xs text-[#52483a] font-serif-kr leading-relaxed">
                {space.description}
              </p>

              {/* Architectural Quote */}
              <div className="p-3 rounded-2xl bg-[#f3ede1] border border-[#e5dcce] text-xs font-serif-kr text-[#3c4a39] italic">
                {space.quote}
              </div>

              {/* Meditation Tip */}
              <div className="flex items-start gap-2 text-[18px] text-[#635747] bg-[#fbf8f2] p-2.5 rounded-xl border border-[#ece4d6]">
                <Sparkles className="w-3.5 h-3.5 text-[#8a5b35] flex-shrink-0 mt-0.5" />
                <span>
                  <strong>사유 팁:</strong> {space.meditationTip}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-1 border-t border-[#ede5d8]">
                <button
                  onClick={() => onSelectSpaceForMeditation(space.id)}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#eee7db] text-[#4d4234] text-xs font-semibold hover:bg-[#e2dacb] transition-all flex items-center justify-center gap-1.5"
                >
                  <Wind className="w-3.5 h-3.5" />
                  <span>여기서 명상</span>
                </button>

                <button
                  onClick={() => onSelectSpaceForImpression(space.id)}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#3b4c38] text-white text-xs font-semibold hover:bg-[#303f2e] transition-all flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>소감 기록하기</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
