import dayjs from 'dayjs';
import type { SceneType } from '@/types';

export const getTodayStr = (): string => {
  return dayjs().format('YYYY-MM-DD');
};

export const calculateStreak = (lastStudyDate: string): number => {
  if (!lastStudyDate) return 1;
  const today = dayjs();
  const last = dayjs(lastStudyDate);
  const diff = today.diff(last, 'day');
  if (diff === 0) return 1;
  if (diff === 1) return 1;
  return 0;
};

export const getSceneColor = (scene: SceneType): string => {
  const colors: Record<SceneType, string> = {
    meeting: '#3B82F6',
    report: '#06B6D4',
    sales: '#F97316',
    hiring: '#EC4899',
    review: '#84CC16'
  };
  return colors[scene] || '#6366F1';
};

export const getSceneName = (scene: SceneType): string => {
  const names: Record<SceneType, string> = {
    meeting: '会议沟通',
    report: '汇报表达',
    sales: '商务销售',
    hiring: '招聘求职',
    review: '项目复盘'
  };
  return names[scene] || '其他';
};

export const getSceneIcon = (scene: SceneType): string => {
  const icons: Record<SceneType, string> = {
    meeting: '💼',
    report: '📊',
    sales: '🤝',
    hiring: '🎯',
    review: '🔍'
  };
  return icons[scene] || '📝';
};

export const getDifficultyName = (difficulty: 'easy' | 'medium' | 'hard'): string => {
  const names = { easy: '初级', medium: '中级', hard: '高级' };
  return names[difficulty] || '初级';
};

export const getDifficultyColor = (difficulty: 'easy' | 'medium' | 'hard'): string => {
  const colors = { easy: '#10B981', medium: '#F59E0B', hard: '#EF4444' };
  return colors[difficulty] || '#10B981';
};

export const getQuestionTypeName = (type: 'meaning' | 'intent' | 'rewrite'): string => {
  const names = { meaning: '黑话释义', intent: '真实诉求', rewrite: '表达改写' };
  return names[type] || '黑话释义';
};

export const getQuestionTypeIcon = (type: 'meaning' | 'intent' | 'rewrite'): string => {
  const icons = { meaning: '📖', intent: '🤔', rewrite: '✍️' };
  return icons[type] || '📖';
};

export const formatNumber = (num: number): string => {
  if (num >= 10000) return (num / 10000).toFixed(1) + 'w';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num.toString();
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};
