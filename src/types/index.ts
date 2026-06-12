export type SceneType = 'meeting' | 'report' | 'sales' | 'hiring' | 'review';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type QuestionType = 'meaning' | 'intent' | 'rewrite';

export interface Scene {
  id: SceneType;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface Example {
  id: string;
  text: string;
  author?: string;
  likes: number;
  createdAt: number;
}

export interface Term {
  id: string;
  word: string;
  pinyin?: string;
  meaning: string;
  deepMeaning: string;
  scenes: SceneType[];
  difficulty: DifficultyLevel;
  synonyms: string[];
  examples: Example[];
  usageNote?: string;
  origin?: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  scene: SceneType;
  difficulty: DifficultyLevel;
  title: string;
  context?: string;
  options: {
    key: string;
    text: string;
  }[];
  answer: string;
  explanation: string;
  relatedTermId?: string;
  timeLimit: number;
  points: number;
}

export interface Level {
  id: string;
  scene: SceneType;
  name: string;
  description: string;
  difficulty: DifficultyLevel;
  questionIds: string[];
  requiredScore: number;
  unlocked: boolean;
  order: number;
}

export interface UserAnswer {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
  answeredAt: number;
}

export interface MistakeRecord {
  question: Question;
  userAnswer: string;
  correctAnswer: string;
  wrongCount: number;
  lastWrongAt: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
  achievedAt?: number;
  progress: number;
  target: number;
}

export interface UserProgress {
  totalScore: number;
  correctCount: number;
  wrongCount: number;
  streak: number;
  lastStudyDate: string;
  masteredTermIds: string[];
  collectedTermIds: string[];
  completedLevelIds: string[];
  levelScores: Record<string, number>;
  sceneProgress: Record<SceneType, { total: number; correct: number }>;
  userExamples: Example[];
}

export interface DailyQuestion {
  date: string;
  question: Question;
  answered: boolean;
  isCorrect?: boolean;
}

export interface RankingItem {
  rank: number;
  userId: string;
  nickname: string;
  avatar?: string;
  score: number;
  streak: number;
  accuracy: number;
}

export interface StageTestResult {
  scene: SceneType;
  totalQuestions: number;
  correctCount: number;
  score: number;
  accuracy: number;
  timeSpent: number;
  weakPoints: string[];
  passed: boolean;
}
