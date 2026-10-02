import React from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Sparkles,
  Sun,
  CloudFog,
  Wind,
  CloudRain,
  Sunset,
  ArrowRight,
  Flame,
  Download
} from 'lucide-react';
import { Impression, WeatherType } from '../types';

interface ImpressionCardProps {
  impression: Impression;
  onOpenDetail: (impression: Impression) => void;
  onToggleLike: (id: string, e: React.MouseEvent) => void;
  onOpenPostcard: (impression: Impression, e: React.MouseEvent) => void;
}

export const ImpressionCard: React.FC<ImpressionCardProps> = ({
  impression,
  onOpenDetail,
  onToggleLike,
  onOpenPostcard
}) => {
  const getWeatherIcon = (w: WeatherType) => {
    switch (w) {
      case 'sunny':
        return <Sun className="w-3 h-3 text-amber-500" />;
      case 'mist':
        return <CloudFog className="w-3 h-3 text-slate-500" />;
      case 'wind':
        return <Wind className="w-3 h-3 text-emerald-600" />;
      case 'rain':
        return <CloudRain className="w-3 h-3 text-blue-500" />;
      case 'sunset':
        return <Sunset className="w-3 h-3 text-orange-500" />;
      default:
        return <Sun className="w-3 h-3 text-amber-500" />;
    }
  };

  return (
    <article
      onClick={() => onOpenDetail(impression)}
      className="group relative bg-[#fdfbf7] rounded-3xl p-4.5 border border-[#e5dcce] shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between"
    >
      {/* Top Meta Header */}
      <div>
        <div className="flex items-center justify-between text-xs mb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="font-serif-kr font-semibold text-[#3b4c38] px-2.5 py-0.5 rounded-full bg-[#e8efe6] border border-[#d2e2d0]">
              {impression.spaceName}
            </span>
            <span className="flex items-center gap-1 text-[#786d5e] text-[20px]">
              {getWeatherIcon(impression.weather)}
              <span>{impression.date}</span>
            </span>
          </div>

          {/* Mind Temperature Badge */}
          <div className="flex items-center gap-1 text-[20px] font-bold text-[#b54629] px-2 py-0.5 rounded-full bg-[#faede8]">
            <Flame className="w-3 h-3" />
            <span>{impression.mindTemperature.toFixed(1)}°C</span>
          </div>
        </div>

        {/* Optional Photo */}
        {impression.photoUrl && (
          <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-3 bg-[#e8e2d5]">
            <img
              src={impression.photoUrl}
              alt={impression.title}
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[20px] text-white/90">
              <span className="font-serif-kr truncate drop-shadow-xs">
                산책 {impression.walkDurationMinutes}분 · 명상 {impression.meditationMinutes}분
              </span>
            </div>
          </div>
        )}

        {/* Emotion Shift Banner */}
        <div className="flex items-center gap-1.5 text-xs text-[#52483a] bg-[#f2ecdf] px-3 py-1.5 rounded-xl mb-3">
          <span className="font-medium text-[#736858] truncate">{impression.emotionBefore}</span>
          <ArrowRight className="w-3 h-3 text-[#3b4c38] flex-shrink-0" />
          <span className="font-bold text-[#2d3a2b] truncate">{impression.emotionAfter}</span>
        </div>

        {/* Title */}
        <h3 className="font-serif-kr font-bold text-base text-[#242b20] leading-snug mb-2 group-hover:text-[#3b4c38] transition-colors line-clamp-2">
          {impression.title}
        </h3>

        {/* Excerpt */}
        <p className="font-serif-kr text-xs text-[#544d41] leading-relaxed line-clamp-3 mb-3">
          {impression.content}
        </p>
      </div>

      {/* Footer Tags & Actions */}
      <div className="pt-2 border-t border-[#ede5d8]">
        {/* Tags */}
        {impression.tags && impression.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2.5">
            {impression.tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="text-[18px] text-[#6d7967] bg-[#edf2eb] px-2 py-0.5 rounded-md"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-[#716757]">
          <span className="font-serif-kr font-medium text-[#3b342a]">
            {impression.authorName}
          </span>

          <div className="flex items-center gap-1">
            {/* Download Postcard Button */}
            <button
              onClick={(e) => onOpenPostcard(impression, e)}
              className="p-1.5 rounded-full hover:bg-[#ede5d6] text-[#6b6051] transition-colors"
              title="사유 엽서로 저장"
            >
              <Download className="w-3.5 h-3.5" />
            </button>

            {/* Comments Counter */}
            <span className="flex items-center gap-1 px-1.5 py-1 text-[20px] text-[#786c5c]">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{impression.comments?.length || 0}</span>
            </span>

            {/* Like / Resonance button */}
            <button
              onClick={(e) => onToggleLike(impression.id, e)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[20px] font-semibold transition-all ${
                impression.isLikedByMe
                  ? 'bg-rose-100 text-rose-700 ring-1 ring-rose-300'
                  : 'bg-[#ede5d6] text-[#554b3d] hover:bg-[#e4dcce]'
              }`}
            >
              <Heart
                className={`w-3.5 h-3.5 ${
                  impression.isLikedByMe ? 'fill-rose-500 text-rose-500' : 'text-[#685d4f]'
                }`}
              />
              <span>{impression.likesCount}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
