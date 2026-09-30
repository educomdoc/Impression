export type WeatherType = 'sunny' | 'mist' | 'wind' | 'rain' | 'sunset';

export interface ForestSpace {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  architect?: string;
  tag: string;
  image: string;
  meditationTip: string;
  quote: string;
}

export interface EmotionTag {
  id: string;
  label: string;
  category: 'before' | 'after';
  color: string;
}

export interface CommentItem {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface Impression {
  id: string;
  title: string;
  content: string;
  spaceId: string;
  spaceName: string;
  authorName: string;
  date: string;
  timeString?: string;
  weather: WeatherType;
  walkDurationMinutes: number;
  meditationMinutes: number;
  emotionBefore: string;
  emotionAfter: string;
  mindTemperature: number; // 35.0 ~ 42.0°C (온기)
  photoUrl?: string;
  tags: string[];
  isPublic: boolean;
  likesCount: number;
  isLikedByMe?: boolean;
  comments: CommentItem[];
  createdAt: number;
  isMyRecord?: boolean;
}

export type ViewTab = 'wall' | 'write' | 'meditation' | 'spaces' | 'journal';
