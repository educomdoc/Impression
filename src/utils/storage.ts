import {
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, testConnection } from '../firebase';
import { Impression, CommentItem } from '../types';
import { INITIAL_IMPRESSIONS } from '../data/sayuwonSpaces';

const LOCAL_STORAGE_KEY = 'sayuwon_impressions_v3';
const MY_RECORDS_KEY = 'sayuwon_my_ids_v1';
const COLLECTION_NAME = 'sayuwon_impressions';

export function getMyRecordIds(): string[] {
  try {
    const raw = localStorage.getItem(MY_RECORDS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addMyRecordId(id: string) {
  try {
    const ids = getMyRecordIds();
    if (!ids.includes(id)) {
      ids.push(id);
      localStorage.setItem(MY_RECORDS_KEY, JSON.stringify(ids));
    }
  } catch (err) {
    console.error('Failed to add my record id', err);
  }
}

export function removeMyRecordId(id: string) {
  try {
    const ids = getMyRecordIds().filter(existingId => existingId !== id);
    localStorage.setItem(MY_RECORDS_KEY, JSON.stringify(ids));
  } catch (err) {
    console.error('Failed to remove my record id', err);
  }
}

export function loadLocalImpressions(): Impression[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_IMPRESSIONS));
      return INITIAL_IMPRESSIONS;
    }
    const parsed = JSON.parse(raw);
    const myIds = getMyRecordIds();
    return parsed.map((item: Impression) => ({
      ...item,
      isMyRecord: myIds.includes(item.id)
    }));
  } catch {
    return INITIAL_IMPRESSIONS;
  }
}

export function saveLocalImpressions(impressions: Impression[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(impressions));
  } catch (err) {
    console.error('Failed to save to local storage', err);
  }
}

/**
 * Real-time Firebase Firestore Listener with Local Fallback
 */
export function subscribeToImpressions(
  onUpdate: (impressions: Impression[]) => void,
  onStatusChange?: (status: { isFirebaseOnline: boolean; error?: string }) => void
): () => void {
  // Initial local render
  const localData = loadLocalImpressions();
  onUpdate(localData);

  testConnection();

  try {
    const colRef = collection(db, COLLECTION_NAME);

    const unsubscribe = onSnapshot(
      colRef,
      async (snapshot) => {
        const myIds = getMyRecordIds();

        if (snapshot.empty) {
          // Seed initial data to Firebase so the cloud collection has rich data
          console.log('Firestore is empty. Seeding initial Sayuwon impressions...');
          try {
            for (const item of INITIAL_IMPRESSIONS) {
              const docRef = doc(db, COLLECTION_NAME, item.id);
              await setDoc(docRef, item);
            }
          } catch (seedErr) {
            console.warn('Could not seed initial data to Firestore (check rules):', seedErr);
          }
          if (onStatusChange) onStatusChange({ isFirebaseOnline: true });
          return;
        }

        const cloudItems: Impression[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as Omit<Impression, 'id'>;
          return {
            ...data,
            id: docSnap.id,
            isMyRecord: myIds.includes(docSnap.id),
          };
        });

        // Sort latest first
        cloudItems.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

        saveLocalImpressions(cloudItems);
        onUpdate(cloudItems);
        if (onStatusChange) onStatusChange({ isFirebaseOnline: true });
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
        if (onStatusChange) {
          onStatusChange({
            isFirebaseOnline: false,
            error: error.message
          });
        }
        // Fallback to local data
        onUpdate(loadLocalImpressions());
      }
    );

    return unsubscribe;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, COLLECTION_NAME);
    if (onStatusChange) {
      onStatusChange({ isFirebaseOnline: false, error: String(err) });
    }
    return () => {};
  }
}

/**
 * Add a new impression to Firebase Firestore & LocalStorage
 */
export async function addImpression(
  newImpression: Omit<Impression, 'id' | 'createdAt' | 'likesCount' | 'isLikedByMe' | 'comments'>
): Promise<Impression> {
  const newId = 'imp-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
  const createdItem: Impression = {
    ...newImpression,
    id: newId,
    likesCount: 0,
    isLikedByMe: false,
    comments: [],
    createdAt: Date.now(),
    isMyRecord: true
  };

  addMyRecordId(newId);

  // Save to local cache first for instant feedback
  const localList = loadLocalImpressions();
  saveLocalImpressions([createdItem, ...localList]);

  // Sync to Firebase Firestore
  try {
    const docRef = doc(db, COLLECTION_NAME, newId);
    await setDoc(docRef, {
      ...createdItem,
      isMyRecord: false // isMyRecord is client-specific
    });
    console.log('Successfully saved impression to Firebase Firestore:', newId);
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `${COLLECTION_NAME}/${newId}`);
  }

  return createdItem;
}

/**
 * Toggle like/resonance on an impression in Firebase Firestore
 */
export async function toggleLike(
  id: string,
  currentImpressions: Impression[]
): Promise<{ likesCount: number; isLikedByMe: boolean }> {
  const target = currentImpressions.find((item) => item.id === id);
  if (!target) return { likesCount: 0, isLikedByMe: false };

  const nextLiked = !target.isLikedByMe;
  const nextCount = nextLiked ? target.likesCount + 1 : Math.max(0, target.likesCount - 1);

  // Update locally
  const updated = currentImpressions.map((item) =>
    item.id === id ? { ...item, likesCount: nextCount, isLikedByMe: nextLiked } : item
  );
  saveLocalImpressions(updated);

  // Sync to Firestore
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      likesCount: nextCount
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${COLLECTION_NAME}/${id}`);
  }

  return { likesCount: nextCount, isLikedByMe: nextLiked };
}

/**
 * Add a comment/warmth in Firebase Firestore
 */
export async function addComment(
  impressionId: string,
  author: string,
  text: string,
  currentImpressions: Impression[]
): Promise<CommentItem | null> {
  const target = currentImpressions.find((item) => item.id === impressionId);
  if (!target) return null;

  const now = new Date();
  const timeFormatted = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const newComment: CommentItem = {
    id: 'c-' + Date.now(),
    author: author.trim() || '사유자',
    text: text.trim(),
    createdAt: timeFormatted
  };

  const nextComments = [newComment, ...(target.comments || [])];

  // Update locally
  const updated = currentImpressions.map((item) =>
    item.id === impressionId ? { ...item, comments: nextComments } : item
  );
  saveLocalImpressions(updated);

  // Sync to Firestore
  try {
    const docRef = doc(db, COLLECTION_NAME, impressionId);
    await updateDoc(docRef, {
      comments: nextComments
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${COLLECTION_NAME}/${impressionId}`);
  }

  return newComment;
}

/**
 * Delete an impression from Firebase Firestore
 */
export async function deleteImpression(id: string, currentImpressions: Impression[]): Promise<void> {
  // Remove from personal IDs
  removeMyRecordId(id);

  // Update locally
  const updated = currentImpressions.filter((item) => item.id !== id);
  saveLocalImpressions(updated);

  // Sync to Firestore
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${COLLECTION_NAME}/${id}`);
  }
}
