import React, { useState } from 'react';
import {
  X,
  Heart,
  MessageCircle,
  Download,
  Share2,
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  Flame,
  Send,
  Sparkles,
  Check
} from 'lucide-react';
import { Impression } from '../types';
import { generatePostcardImage } from '../utils/postcardGenerator';

interface ImpressionDetailModalProps {
  impression: Impression | null;
  onClose: () => void;
  onToggleLike: (id: string, e: React.MouseEvent) => void;
  onAddComment: (impressionId: string, author: string, text: string) => void;
}

export const ImpressionDetailModal: React.FC<ImpressionDetailModalProps> = ({
  impression,
  onClose,
  onToggleLike,
  onAddComment
}) => {
  const [commentText, setCommentText] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [isGeneratingPostcard, setIsGeneratingPostcard] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!impression) return null;

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(impression.id, commentAuthor.trim() || '사유자', commentText.trim());
    setCommentText('');
  };

  const handleDownloadPostcard = async () => {
    try {
      setIsGeneratingPostcard(true);
      const dataUrl = await generatePostcardImage(impression);
      const link = document.createElement('a');
      link.download = `sayuwon_postcard_${impression.spaceId}_${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Postcard generation failed', err);
    } finally {
      setIsGeneratingPostcard(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[92vh] flex flex-col bg-[#fcfaf5] rounded-3xl shadow-2xl border border-[#ded5c5] overflow-hidden">
        
        {/* Header Bar */}
        <div className="px-5 py-3.5 border-b border-[#e7decfa0] flex items-center justify-between bg-[#f4ede0]/80">
          <div className="flex items-center gap-2">
            <span className="font-serif-kr font-bold text-sm text-[#3b4c38] px-2.5 py-0.5 rounded-full bg-[#e8efe6]">
              {impression.spaceName}
            </span>
            <span className="text-xs text-[#7d7261]">
              {impression.date} {impression.timeString || ''}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleDownloadPostcard}
              disabled={isGeneratingPostcard}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#3b4c38] text-white text-xs font-medium hover:bg-[#30402d] transition-all shadow-2xs"
              title="사유 엽서 다운로드"
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>저장 완료</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>{isGeneratingPostcard ? '엽서 굽는 중...' : '사유 엽서'}</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[#e4dcce] text-[#6d6353] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Story View */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          {/* Main Photo */}
          {impression.photoUrl && (
            <div className="relative w-full h-56 rounded-2xl overflow-hidden border border-[#ded5c5] bg-[#e6dfd2]">
              <img
                src={impression.photoUrl}
                alt={impression.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
                <span className="font-serif-kr drop-shadow-sm">사유원 사유의 숲</span>
                <span className="px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-xs text-[20px]">
                  온기 {impression.mindTemperature.toFixed(1)}°C
                </span>
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <h2 className="font-serif-kr font-bold text-xl text-[#22291f] leading-snug">
              {impression.title}
            </h2>
            <div className="flex items-center justify-between text-xs text-[#716757] mt-1.5 pb-3 border-b border-[#ece4d6]">
              <span className="font-serif-kr font-semibold text-[#3b342a]">
                사유자 {impression.authorName} 남김
              </span>
              <span>
                산책 {impression.walkDurationMinutes}분 · 명상 {impression.meditationMinutes}분
              </span>
            </div>
          </div>

          {/* Mind Journey Block */}
          <div className="p-4 rounded-2xl bg-[#f2ecdf]/80 border border-[#e2d8c7] flex items-center justify-between">
            <div className="flex-1 text-center pr-2">
              <span className="block text-[20px] text-[#7d7161] font-medium mb-0.5">숲에 오기 전</span>
              <span className="font-bold text-xs text-[#4b4134]">{impression.emotionBefore}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-[#3b4c38] flex-shrink-0" />
            <div className="flex-1 text-center pl-2">
              <span className="block text-[20px] text-[#3b4c38] font-medium mb-0.5">명상과 산책 후</span>
              <span className="font-bold text-xs text-[#283726]">{impression.emotionAfter}</span>
            </div>
            <div className="pl-3 border-l border-[#ded5c5] flex flex-col items-center">
              <span className="flex items-center gap-0.5 text-[#b54629] font-bold text-xs">
                <Flame className="w-3.5 h-3.5" />
                {impression.mindTemperature.toFixed(1)}°C
              </span>
              <span className="text-[20px] text-[#867a6a]">마음의 온기</span>
            </div>
          </div>

          {/* Full Contemplation Story Content */}
          <div className="prose prose-stone max-w-none">
            <p className="font-serif-kr text-[#30382e] text-sm leading-relaxed whitespace-pre-line">
              {impression.content}
            </p>
          </div>

          {/* Tags */}
          {impression.tags && impression.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {impression.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs text-[#475743] bg-[#eaf0e8] px-2.5 py-1 rounded-lg border border-[#d6e3d4]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Postcard callout banner */}
          <div className="p-3.5 rounded-2xl bg-[#eee7da]/80 border border-[#ded4c2] flex items-center justify-between">
            <div>
              <div className="font-serif-kr font-bold text-xs text-[#31291f]">
                이 소감을 사유 엽서로 소장해보세요
              </div>
              <div className="text-[20px] text-[#6d6353]">
                사유원의 전통 낙관이 찍힌 엽서 이미지로 저장됩니다.
              </div>
            </div>
            <button
              onClick={handleDownloadPostcard}
              disabled={isGeneratingPostcard}
              className="px-3 py-1.5 rounded-xl bg-[#524536] text-white text-xs font-medium hover:bg-[#43382b] flex items-center gap-1 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>다운로드</span>
            </button>
          </div>

          {/* Resonance / Like row */}
          <div className="flex items-center justify-between pt-3 border-t border-[#ece4d6]">
            <span className="text-xs text-[#6e6353] font-medium flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#8a5b35]" />
              이 사유에 공감과 온기 보내기
            </span>
            <button
              onClick={(e) => onToggleLike(impression.id, e)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                impression.isLikedByMe
                  ? 'bg-rose-100 text-rose-700 ring-2 ring-rose-400'
                  : 'bg-[#eee7da] text-[#53493d] hover:bg-[#e4dcce]'
              }`}
            >
              <Heart
                className={`w-4 h-4 ${
                  impression.isLikedByMe ? 'fill-rose-500 text-rose-500' : 'text-[#615546]'
                }`}
              />
              <span>마음 공감 {impression.likesCount}</span>
            </button>
          </div>

          {/* Comments / Warmth Section */}
          <div className="pt-2 space-y-3">
            <h4 className="font-serif-kr font-bold text-sm text-[#2c3529] flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4 text-[#3b4c38]" />
              <span>사유 나눔의 말 ({impression.comments?.length || 0})</span>
            </h4>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="이름 (닉네임)"
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  maxLength={15}
                  className="w-28 px-3 py-2 rounded-xl bg-white border border-[#ded5c5] text-xs text-[#2b3529]"
                />
                <input
                  type="text"
                  placeholder="따뜻한 사유의 한 줄을 남겨주세요..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-white border border-[#ded5c5] text-xs text-[#2b3529]"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="p-2 rounded-xl bg-[#3b4c38] text-white hover:bg-[#2f3f2d] disabled:opacity-50 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-2 pt-1">
              {impression.comments && impression.comments.length > 0 ? (
                impression.comments.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 rounded-2xl bg-white/70 border border-[#e5dcce] text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-[#7d7161]">
                      <span className="font-serif-kr font-bold text-[#353e32]">{c.author}</span>
                      <span className="text-[20px]">{c.createdAt}</span>
                    </div>
                    <p className="text-[#453f36] font-serif-kr leading-relaxed">{c.text}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-xs text-[#8c8171] font-serif-kr bg-[#f7f2e8] rounded-2xl">
                  아직 남겨진 이야기가 없습니다. 첫 번째 온기를 전해보세요.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
