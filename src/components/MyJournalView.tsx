import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  Clock,
  MapPin,
  Calendar,
  Flame,
  Plus,
  Trash2,
  Download,
  AlertTriangle
} from 'lucide-react';
import { Impression } from '../types';
import { ImpressionCard } from './ImpressionCard';

interface MyJournalViewProps {
  impressions: Impression[];
  onOpenDetail: (impression: Impression) => void;
  onToggleLike: (id: string, e: React.MouseEvent) => void;
  onOpenPostcard: (impression: Impression, e: React.MouseEvent) => void;
  onOpenWriteModal: () => void;
  onDeleteRecord: (id: string) => void;
}

export const MyJournalView: React.FC<MyJournalViewProps> = ({
  impressions,
  onOpenDetail,
  onToggleLike,
  onOpenPostcard,
  onOpenWriteModal,
  onDeleteRecord
}) => {
  const [recordToDelete, setRecordToDelete] = useState<Impression | null>(null);

  const myImpressions = impressions.filter(i => i.isMyRecord);

  // Statistics calculation
  const totalMeditationMinutes = myImpressions.reduce((acc, curr) => acc + (curr.meditationMinutes || 0), 0);
  const totalWalkMinutes = myImpressions.reduce((acc, curr) => acc + (curr.walkDurationMinutes || 0), 0);
  const averageTemp = myImpressions.length > 0
    ? (myImpressions.reduce((acc, curr) => acc + curr.mindTemperature, 0) / myImpressions.length).toFixed(1)
    : '36.5';

  const confirmDelete = () => {
    if (recordToDelete) {
      onDeleteRecord(recordToDelete.id);
      setRecordToDelete(null);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-4 pb-24 space-y-6">
      {/* Header */}
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#ebe4d5] text-[#554a3e] mb-2">
          <BookOpen className="w-3.5 h-3.5 text-[#3b4c38]" />
          나의 사유 서랍
        </span>
        <h2 className="text-2xl font-bold font-serif-kr text-[#283226]">머물렀던 숲의 흔적</h2>
        <p className="text-xs text-[#6e6456] mt-1 font-serif-kr">
          사유원에서 비워내고 채워 넣은 나만의 고요한 기록들입니다.
        </p>
      </div>

      {/* Stats Summary Card */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-[#3b4c38] to-[#253223] text-white shadow-md space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-white/15">
          <span className="text-xs font-serif-kr text-[#c8d8c6]">나의 숲 명상 누적 기록</span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/15 text-[#e5f0e3]">
            {myImpressions.length}편의 사유
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center pt-1">
          <div>
            <div className="text-xl font-bold font-mono text-[#e4f1e2]">{totalMeditationMinutes}분</div>
            <div className="text-[10px] text-[#a9bca7] mt-0.5">명상 사색 시간</div>
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-[#e4f1e2]">{totalWalkMinutes}분</div>
            <div className="text-[10px] text-[#a9bca7] mt-0.5">숲길 산책 시간</div>
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-[#fcd9cf] flex items-center justify-center gap-0.5">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              {averageTemp}°C
            </div>
            <div className="text-[10px] text-[#a9bca7] mt-0.5">평균 마음 온도</div>
          </div>
        </div>
      </div>

      {/* Record List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-serif-kr font-bold text-sm text-[#3b342a]">
            기록한 소감 목록 ({myImpressions.length})
          </h3>
          <button
            onClick={onOpenWriteModal}
            className="flex items-center gap-1 text-xs text-[#3b4c38] font-bold hover:underline"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>새 소감 쓰기</span>
          </button>
        </div>

        {myImpressions.length > 0 ? (
          <div className="space-y-4">
            {myImpressions.map((impression) => (
              <div key={impression.id} className="relative group">
                <ImpressionCard
                  impression={impression}
                  onOpenDetail={onOpenDetail}
                  onToggleLike={onToggleLike}
                  onOpenPostcard={onOpenPostcard}
                />
                
                {/* Delete button (fixed reliable click handler, no window.confirm) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setRecordToDelete(impression);
                  }}
                  className="absolute top-3.5 right-3.5 p-2 rounded-full bg-white/95 hover:bg-rose-50 text-[#887b6d] hover:text-rose-600 transition-all shadow-sm border border-[#e2d8c7] z-20 active:scale-90"
                  title="기록 삭제"
                  aria-label="소감 기록 삭제"
                >
                  <Trash2 className="w-4 h-4 text-rose-500" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-[#fdfbf7] rounded-3xl border border-dashed border-[#d8cdbc] space-y-3">
            <Sparkles className="w-8 h-8 text-[#8c673d] mx-auto opacity-70" />
            <h4 className="font-serif-kr font-bold text-base text-[#343d32]">
              아직 남겨진 소감이 없습니다
            </h4>
            <p className="text-xs text-[#6e6456] font-serif-kr max-w-xs mx-auto leading-relaxed">
              사유원 숲길을 걷거나 명상을 마친 후, 마음에 피어난 감정과 생각을 기록해보세요.
            </p>
            <button
              onClick={onOpenWriteModal}
              className="py-2.5 px-5 rounded-2xl bg-[#3b4c38] text-white text-xs font-semibold hover:bg-[#303f2e] inline-flex items-center gap-1.5 shadow-xs transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>첫 소감 남기기</span>
            </button>
          </div>
        )}
      </div>

      {/* In-App Deletion Confirmation Modal (Works 100% reliably in iFrames) */}
      {recordToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xs bg-[#fdfbf7] rounded-3xl p-5 border border-[#ded5c5] shadow-2xl text-center space-y-3 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            
            <div>
              <h4 className="font-serif-kr font-bold text-base text-[#2c3328]">
                소감 기록 삭제
              </h4>
              <p className="text-xs text-[#665a4c] font-serif-kr mt-1.5 leading-relaxed px-2">
                &ldquo;<span className="font-semibold text-[#2b3329]">{recordToDelete.title}</span>&rdquo;<br />
                기록을 나의 서랍에서 삭제하시겠습니까?
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRecordToDelete(null)}
                className="flex-1 py-2.5 rounded-xl bg-[#eee7da] text-[#554a3d] text-xs font-semibold hover:bg-[#e4dcce] transition-colors"
              >
                취소
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow-xs transition-colors"
              >
                삭제하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
