import React, { useEffect, useState } from 'react';
import { X, Download, Share2, Check, Sparkles } from 'lucide-react';
import { Impression } from '../types';
import { generatePostcardImage } from '../utils/postcardGenerator';

interface PostcardPreviewModalProps {
  impression: Impression | null;
  onClose: () => void;
}

export const PostcardPreviewModal: React.FC<PostcardPreviewModalProps> = ({
  impression,
  onClose
}) => {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(true);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!impression) {
      setDataUrl(null);
      return;
    }
    let isCancelled = false;
    setIsGenerating(true);

    generatePostcardImage(impression)
      .then((url) => {
        if (!isCancelled) {
          setDataUrl(url);
          setIsGenerating(false);
        }
      })
      .catch((err) => {
        console.error('Failed to generate postcard', err);
        if (!isCancelled) setIsGenerating(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [impression]);

  if (!impression) return null;

  const handleDownload = () => {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `사유원_사유엽서_${impression.authorName}_${Date.now()}.png`;
    a.click();
  };

  const handleShare = async () => {
    if (navigator.share && dataUrl) {
      try {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], 'sayuwon_postcard.png', { type: 'image/png' });
        await navigator.share({
          title: `사유원 사유 엽서 - ${impression.title}`,
          text: `"${impression.title}" - 사유원 숲체험 & 명상 소감`,
          files: [file]
        });
      } catch {
        // Fallback copy
        copyLink();
      }
    } else {
      copyLink();
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm flex flex-col bg-[#fdfbf7] rounded-3xl shadow-2xl border border-[#ded5c5] overflow-hidden">
        
        {/* Header */}
        <div className="px-4 py-3 border-b border-[#ece4d6] flex items-center justify-between bg-[#f4ede0]">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#8a5b35]" />
            <h3 className="font-serif-kr font-bold text-sm text-[#2b3529]">
              사유원 전통 사유 엽서
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[#e4dcce] text-[#6d6353]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Postcard Body Preview */}
        <div className="p-4 flex flex-col items-center justify-center max-h-[70vh] overflow-y-auto">
          {isGenerating ? (
            <div className="py-20 flex flex-col items-center gap-3 text-xs text-[#786c5c] font-serif-kr">
              <div className="w-8 h-8 rounded-full border-2 border-[#3b4c38] border-t-transparent animate-spin" />
              <span>정갈한 엽서를 빚는 중입니다...</span>
            </div>
          ) : dataUrl ? (
            <div className="rounded-2xl overflow-hidden shadow-lg border border-[#d9cebc]">
              <img
                src={dataUrl}
                alt="사유 엽서"
                className="w-full h-auto object-contain max-h-[55vh]"
              />
            </div>
          ) : (
            <div className="py-12 text-xs text-rose-700">엽서 생성에 실패했습니다.</div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#ece4d6] bg-[#f7f2e7] flex gap-2">
          <button
            onClick={handleDownload}
            disabled={!dataUrl}
            className="flex-1 py-2.5 px-3 rounded-xl bg-[#3b4c38] text-white text-xs font-semibold hover:bg-[#2f3f2d] flex items-center justify-center gap-1.5 shadow-xs transition-all disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>이미지 저장</span>
          </button>

          <button
            onClick={handleShare}
            className="py-2.5 px-3.5 rounded-xl bg-[#eee7da] text-[#4d4234] text-xs font-semibold hover:bg-[#e2dacb] flex items-center justify-center gap-1.5 transition-all"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            <span>{isCopied ? '복사됨' : '공유'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
