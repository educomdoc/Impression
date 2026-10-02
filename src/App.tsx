import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Sparkles,
  Compass,
  Plus,
  Heart,
  Wind,
  Layers,
  User,
  Home,
  Cloud
} from 'lucide-react';
import { ViewTab, Impression } from './types';
import {
  subscribeToImpressions,
  addImpression,
  toggleLike,
  addComment,
  deleteImpression
} from './utils/storage';
import { CommunityWallView } from './components/CommunityWallView';
import { MeditationTimer } from './components/MeditationTimer';
import { SpaceExplorerView } from './components/SpaceExplorerView';
import { MyJournalView } from './components/MyJournalView';
import { ImpressionFormModal } from './components/ImpressionFormModal';
import { ImpressionDetailModal } from './components/ImpressionDetailModal';
import { PostcardPreviewModal } from './components/PostcardPreviewModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ViewTab>('wall');
  const [impressions, setImpressions] = useState<Impression[]>([]);
  const [firebaseStatus, setFirebaseStatus] = useState<{ isFirebaseOnline: boolean; error?: string }>({
    isFirebaseOnline: true
  });
  
  // Modals
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [writeInitialSpaceId, setWriteInitialSpaceId] = useState<string | undefined>();
  const [writeInitialMeditationMins, setWriteInitialMeditationMins] = useState<number | undefined>();

  const [selectedDetailImpression, setSelectedDetailImpression] = useState<Impression | null>(null);
  const [postcardImpression, setPostcardImpression] = useState<Impression | null>(null);

  // Subscribe to real-time Firebase Firestore updates
  useEffect(() => {
    const unsubscribe = subscribeToImpressions(
      (data) => {
        setImpressions(data);
      },
      (status) => {
        setFirebaseStatus(status);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  // Handlers
  const handleOpenWriteModal = (spaceId?: string, meditationMinutes?: number) => {
    setWriteInitialSpaceId(spaceId);
    setWriteInitialMeditationMins(meditationMinutes);
    setIsWriteModalOpen(true);
  };

  const handleCreateImpression = async (
    impressionData: Omit<Impression, 'id' | 'createdAt' | 'likesCount' | 'isLikedByMe' | 'comments'>
  ) => {
    const created = await addImpression(impressionData);
    setPostcardImpression(created);
  };

  const handleToggleLike = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const result = await toggleLike(id, impressions);
    setImpressions(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, likesCount: result.likesCount, isLikedByMe: result.isLikedByMe }
          : item
      )
    );
    if (selectedDetailImpression?.id === id) {
      setSelectedDetailImpression(prev =>
        prev ? { ...prev, likesCount: result.likesCount, isLikedByMe: result.isLikedByMe } : null
      );
    }
  };

  const handleAddComment = async (impressionId: string, author: string, text: string) => {
    const comment = await addComment(impressionId, author, text, impressions);
    if (comment) {
      if (selectedDetailImpression?.id === impressionId) {
        setSelectedDetailImpression(prev =>
          prev ? { ...prev, comments: [comment, ...(prev.comments || [])] } : null
        );
      }
    }
  };

  const handleDeleteRecord = async (id: string) => {
    setImpressions(prev => prev.filter(item => item.id !== id));
    if (selectedDetailImpression?.id === id) {
      setSelectedDetailImpression(null);
    }
    await deleteImpression(id, impressions);
  };

  const handleOpenPostcard = (impression: Impression, e: React.MouseEvent) => {
    e.stopPropagation();
    setPostcardImpression(impression);
  };

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-[#2b3329] flex flex-col font-sans-kr relative selection:bg-[#43533e]/20">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-[#f7f5f0]/90 backdrop-blur-md border-b border-[#e6decf] px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          {/* Logo & Subtitle */}
          <div
            onClick={() => setActiveTab('wall')}
            className="cursor-pointer flex items-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-full bg-[#3b4c38] text-white flex items-center justify-center font-serif-kr text-xs font-bold shadow-xs group-hover:bg-[#2f3e2c] transition-colors">
              思惟
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif-kr font-bold text-base text-[#242c20] leading-none tracking-tight">
                  사유원
                </span>
                <span className="inline-flex items-center gap-0.5 text-[15px] px-1.5 py-0.5 rounded-full bg-emerald-100/90 text-emerald-800 font-medium">
                  <Cloud className="w-2.5 h-2.5 text-emerald-600" />
                  Firebase
                </span>
              </div>
              <div className="text-[18px] text-[#786c5c] font-sans-kr leading-tight mt-0.5">
                숲체험 &amp; 명상 소감록
              </div>
            </div>
          </div>

          {/* Quick Write Impression Action */}
          <button
            onClick={() => handleOpenWriteModal()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#3b4c38] text-white hover:bg-[#2d3a2b] shadow-2xs transition-all active:scale-95"
            title="새 소감 남기기"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>소감 쓰기</span>
          </button>
        </div>
      </header>

      {/* Main Content Area based on Tab */}
      <main className="flex-1 w-full">
        {activeTab === 'wall' && (
          <CommunityWallView
            impressions={impressions}
            onOpenDetail={(imp) => setSelectedDetailImpression(imp)}
            onToggleLike={handleToggleLike}
            onOpenPostcard={handleOpenPostcard}
            onOpenWriteModal={() => handleOpenWriteModal()}
          />
        )}

        {activeTab === 'meditation' && (
          <MeditationTimer
            onCompleteToJournal={(mins, spaceId) => {
              handleOpenWriteModal(spaceId, mins);
            }}
          />
        )}

        {activeTab === 'spaces' && (
          <SpaceExplorerView
            onSelectSpaceForImpression={(spaceId) => handleOpenWriteModal(spaceId)}
            onSelectSpaceForMeditation={(spaceId) => {
              setActiveTab('meditation');
            }}
          />
        )}

        {activeTab === 'journal' && (
          <MyJournalView
            impressions={impressions}
            onOpenDetail={(imp) => setSelectedDetailImpression(imp)}
            onToggleLike={handleToggleLike}
            onOpenPostcard={handleOpenPostcard}
            onOpenWriteModal={() => handleOpenWriteModal()}
            onDeleteRecord={handleDeleteRecord}
          />
        )}
      </main>

      {/* Bottom Mobile Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#fbf9f4]/95 backdrop-blur-md border-t border-[#e5dcce] pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-1.5 shadow-lg">
        <div className="max-w-md mx-auto px-4 flex items-center justify-around">
          {/* Tab 1: Wall */}
          <button
            onClick={() => setActiveTab('wall')}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
              activeTab === 'wall' ? 'text-[#3b4c38] font-bold' : 'text-[#7e7362] hover:text-[#332c22]'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[18px]">사유 방명록</span>
          </button>

          {/* Tab 2: Meditation */}
          <button
            onClick={() => setActiveTab('meditation')}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
              activeTab === 'meditation' ? 'text-[#3b4c38] font-bold' : 'text-[#7e7362] hover:text-[#332c22]'
            }`}
          >
            <Wind className="w-5 h-5" />
            <span className="text-[18px]">숲 명상</span>
          </button>

          {/* Central Action: Write Impression Floating Button */}
          <button
            onClick={() => handleOpenWriteModal()}
            className="relative -top-3 flex flex-col items-center group"
          >
            <div className="w-13 h-13 rounded-full bg-[#3b4c38] text-white flex items-center justify-center shadow-lg group-hover:bg-[#2d3a2b] transition-transform active:scale-95 group-hover:scale-105 border-4 border-[#fbf9f4]">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-[18px] font-bold text-[#3b4c38] mt-0.5">소감 쓰기</span>
          </button>

          {/* Tab 4: Spaces */}
          <button
            onClick={() => setActiveTab('spaces')}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
              activeTab === 'spaces' ? 'text-[#3b4c38] font-bold' : 'text-[#7e7362] hover:text-[#332c22]'
            }`}
          >
            <Compass className="w-5 h-5" />
            <span className="text-[18px]">공간 탐색</span>
          </button>

          {/* Tab 5: My Drawer */}
          <button
            onClick={() => setActiveTab('journal')}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
              activeTab === 'journal' ? 'text-[#3b4c38] font-bold' : 'text-[#7e7362] hover:text-[#332c22]'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[18px]">나의 서랍</span>
          </button>
        </div>
      </nav>

      {/* Write Impression Modal */}
      <ImpressionFormModal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        onSubmit={handleCreateImpression}
        initialSpaceId={writeInitialSpaceId}
        initialMeditationMinutes={writeInitialMeditationMins}
      />

      {/* Impression Detail Modal */}
      <ImpressionDetailModal
        impression={selectedDetailImpression}
        onClose={() => setSelectedDetailImpression(null)}
        onToggleLike={handleToggleLike}
        onAddComment={handleAddComment}
      />

      {/* Postcard Preview / Download Modal */}
      <PostcardPreviewModal
        impression={postcardImpression}
        onClose={() => setPostcardImpression(null)}
      />
    </div>
  );
}
