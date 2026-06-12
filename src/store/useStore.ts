import { create } from 'zustand';
import type {
  UserProgress,
  MistakeRecord,
  Achievement,
  DailyQuestion,
  Question,
  SceneType,
  RankingItem,
  LevelAttempt,
  DailyStudyRecord,
  DailyStudyLevel,
  DailyStudyMistake,
  DailyStudyExample
} from '@/types';
import { getStorage, setStorage, storageKeys } from '@/utils/storage';
import { getTodayStr, calculateStreak } from '@/utils/progress';
import { questionsData } from '@/data/questions';
import { achievementsData } from '@/data/achievements';

interface StoreState {
  progress: UserProgress;
  mistakes: MistakeRecord[];
  achievements: Achievement[];
  dailyQuestion: DailyQuestion | null;
  dailyStudy: DailyStudyRecord;
  userSettings: {
    remindEnabled: boolean;
    remindTime: string;
    nickname: string;
  };
  rankingList: RankingItem[];

  initStore: () => void;

  recordAnswer: (
    question: Question,
    userAnswer: string,
    isCorrect: boolean,
    timeSpent: number
  ) => void;

  addMistake: (
    question: Question,
    userAnswer: string,
    correctAnswer: string
  ) => void;

  removeMistake: (questionId: string) => void;

  toggleCollectTerm: (termId: string) => void;

  completeLevel: (levelId: string, score: number, requiredScore: number) => boolean;

  recordLevelAttempt: (attempt: LevelAttempt) => void;

  removeMasteredMistakes: (questionIds: string[]) => void;

  removeUserExample: (exampleId: string) => void;

  checkAchievements: () => void;

  getDailyQuestion: () => DailyQuestion;

  answerDailyQuestion: (isCorrect: boolean) => void;

  updateStreak: () => void;

  addUserExample: (termId: string, text: string) => void;

  updateRemindSettings: (enabled?: boolean, time?: string) => void;

  recordDailyLevelAttempt: (level: DailyStudyLevel) => void;

  recordDailyMistakePractice: (mistake: DailyStudyMistake) => void;

  recordDailyExample: (example: DailyStudyExample) => void;

  removeDailyExample: (exampleId: string) => void;

  getTodayStudy: () => DailyStudyRecord;
}

const defaultProgress: UserProgress = {
  totalScore: 0,
  correctCount: 0,
  wrongCount: 0,
  streak: 0,
  lastStudyDate: '',
  masteredTermIds: [],
  collectedTermIds: [],
  completedLevelIds: [],
  levelScores: {},
  sceneProgress: {
    meeting: { total: 0, correct: 0 },
    report: { total: 0, correct: 0 },
    sales: { total: 0, correct: 0 },
    hiring: { total: 0, correct: 0 },
    review: { total: 0, correct: 0 }
  },
  userExamples: [],
  levelAttempts: {}
};

const defaultDailyStudy: DailyStudyRecord = {
  date: '',
  levels: [],
  mistakePractices: [],
  examples: []
};

const defaultSettings = {
  remindEnabled: true,
  remindTime: '20:00',
  nickname: '职场新人'
};

const mockRankingList: RankingItem[] = [
  { rank: 1, userId: 'u1', nickname: '黑话王者', score: 9820, streak: 156, accuracy: 96 },
  { rank: 2, userId: 'u2', nickname: '汇报大师', score: 8450, streak: 89, accuracy: 93 },
  { rank: 3, userId: 'u3', nickname: '面试收割机', score: 7680, streak: 67, accuracy: 91 },
  { rank: 4, userId: 'u4', nickname: '职场老司机', score: 6920, streak: 45, accuracy: 89 },
  { rank: 5, userId: 'u5', nickname: '不背锅的我', score: 6100, streak: 33, accuracy: 87 },
  { rank: 6, userId: 'u6', nickname: '潜台词达人', score: 5830, streak: 28, accuracy: 86 },
  { rank: 7, userId: 'u7', nickname: '会议MVP', score: 5210, streak: 25, accuracy: 84 },
  { rank: 8, userId: 'u8', nickname: '销售冠军', score: 4900, streak: 21, accuracy: 85 },
  { rank: 9, userId: 'u9', nickname: '复盘小能手', score: 4560, streak: 18, accuracy: 83 },
  { rank: 10, userId: 'u10', nickname: '词汇量担当', score: 4120, streak: 15, accuracy: 82 }
];

const getEmptyDailyStudy = (): DailyStudyRecord => ({
  date: getTodayStr(),
  levels: [],
  mistakePractices: [],
  examples: []
});

export const useStore = create<StoreState>((set, get) => ({
  progress: defaultProgress,
  mistakes: [],
  achievements: [...achievementsData],
  dailyQuestion: null,
  dailyStudy: getEmptyDailyStudy(),
  userSettings: defaultSettings,
  rankingList: mockRankingList,

  initStore: () => {
    const savedProgress = getStorage<UserProgress>(storageKeys.PROGRESS, defaultProgress);
    const savedMistakes = getStorage<MistakeRecord[]>(storageKeys.MISTAKES, []);
    const savedAchievements = getStorage<Achievement[]>(storageKeys.ACHIEVEMENTS, achievementsData);
    const savedSettings = getStorage(storageKeys.USER_SETTINGS, defaultSettings);
    const savedDailyStudy = getStorage<DailyStudyRecord>(storageKeys.DAILY_STUDY, getEmptyDailyStudy());
    const today = getTodayStr();
    const dailyStudy = savedDailyStudy.date === today ? savedDailyStudy : getEmptyDailyStudy();

    set({
      progress: { ...defaultProgress, ...savedProgress },
      mistakes: savedMistakes,
      achievements: savedAchievements,
      dailyStudy,
      userSettings: { ...defaultSettings, ...savedSettings }
    });

    console.log('[Store] init complete');
  },

  recordAnswer: (question, userAnswer, isCorrect, timeSpent) => {
    const { progress } = get();
    const sceneKey = question.scene as SceneType;

    const newProgress: UserProgress = {
      ...progress,
      totalScore: progress.totalScore + (isCorrect ? question.points : 0),
      correctCount: progress.correctCount + (isCorrect ? 1 : 0),
      wrongCount: progress.wrongCount + (isCorrect ? 0 : 1),
      sceneProgress: {
        ...progress.sceneProgress,
        [sceneKey]: {
          total: progress.sceneProgress[sceneKey].total + 1,
          correct: progress.sceneProgress[sceneKey].correct + (isCorrect ? 1 : 0)
        }
      },
      lastStudyDate: getTodayStr()
    };

    if (isCorrect && question.relatedTermId) {
      if (!newProgress.masteredTermIds.includes(question.relatedTermId)) {
        newProgress.masteredTermIds.push(question.relatedTermId);
      }
    }

    set({ progress: newProgress });
    setStorage(storageKeys.PROGRESS, newProgress);

    if (!isCorrect) {
      get().addMistake(question, userAnswer, question.answer);
    }

    get().checkAchievements();
    console.log('[Store] answer recorded:', question.id, isCorrect);
  },

  addMistake: (question, userAnswer, correctAnswer) => {
    const { mistakes } = get();
    const existIdx = mistakes.findIndex(m => m.question.id === question.id);
    let newMistakes: MistakeRecord[];

    if (existIdx >= 0) {
      newMistakes = [...mistakes];
      newMistakes[existIdx] = {
        ...newMistakes[existIdx],
        userAnswer,
        correctAnswer,
        wrongCount: newMistakes[existIdx].wrongCount + 1,
        lastWrongAt: Date.now()
      };
    } else {
      newMistakes = [
        {
          question,
          userAnswer,
          correctAnswer,
          wrongCount: 1,
          lastWrongAt: Date.now()
        },
        ...mistakes
      ];
    }

    set({ mistakes: newMistakes });
    setStorage(storageKeys.MISTAKES, newMistakes);
  },

  removeMistake: (questionId) => {
    const { mistakes } = get();
    const newMistakes = mistakes.filter(m => m.question.id !== questionId);
    set({ mistakes: newMistakes });
    setStorage(storageKeys.MISTAKES, newMistakes);
  },

  toggleCollectTerm: (termId) => {
    const { progress } = get();
    const collected = [...progress.collectedTermIds];
    const idx = collected.indexOf(termId);
    if (idx >= 0) {
      collected.splice(idx, 1);
    } else {
      collected.push(termId);
    }
    const newProgress = { ...progress, collectedTermIds: collected };
    set({ progress: newProgress });
    setStorage(storageKeys.PROGRESS, newProgress);
    get().checkAchievements();
  },

  completeLevel: (levelId, score, requiredScore) => {
    const { progress } = get();
    const passed = score >= requiredScore;
    const completed = [...progress.completedLevelIds];
    if (passed && !completed.includes(levelId)) {
      completed.push(levelId);
    }
    const newProgress = {
      ...progress,
      completedLevelIds: completed,
      levelScores: {
        ...progress.levelScores,
        [levelId]: Math.max(progress.levelScores[levelId] || 0, score)
      }
    };
    set({ progress: newProgress });
    setStorage(storageKeys.PROGRESS, newProgress);
    get().checkAchievements();
    console.log('[Store] level attempt:', levelId, score, 'required:', requiredScore, 'passed:', passed);
    return passed;
  },

  recordLevelAttempt: (attempt) => {
    const { progress } = get();
    const newProgress = {
      ...progress,
      levelAttempts: {
        ...progress.levelAttempts,
        [attempt.levelId]: attempt
      }
    };
    set({ progress: newProgress });
    setStorage(storageKeys.PROGRESS, newProgress);
  },

  removeMasteredMistakes: (questionIds) => {
    const { mistakes } = get();
    const newMistakes = mistakes.filter(m => !questionIds.includes(m.question.id));
    set({ mistakes: newMistakes });
    setStorage(storageKeys.MISTAKES, newMistakes);
  },

  removeUserExample: (exampleId) => {
    const { progress, dailyStudy } = get();
    const newExamples = progress.userExamples.filter(e => e.id !== exampleId);
    const newProgress = { ...progress, userExamples: newExamples };
    set({ progress: newProgress });
    setStorage(storageKeys.PROGRESS, newProgress);

    const today = getTodayStr();
    const ds = dailyStudy.date === today ? dailyStudy : getEmptyDailyStudy();
    const newDs: DailyStudyRecord = {
      ...ds,
      examples: ds.examples.filter(e => e.exampleId !== exampleId)
    };
    set({ dailyStudy: newDs });
    setStorage(storageKeys.DAILY_STUDY, newDs);
  },

  recordDailyLevelAttempt: (level) => {
    const { dailyStudy } = get();
    const today = getTodayStr();
    const ds = dailyStudy.date === today ? dailyStudy : getEmptyDailyStudy();
    const newDs: DailyStudyRecord = {
      ...ds,
      levels: [...ds.levels, level]
    };
    set({ dailyStudy: newDs });
    setStorage(storageKeys.DAILY_STUDY, newDs);
  },

  recordDailyMistakePractice: (mistake) => {
    const { dailyStudy } = get();
    const today = getTodayStr();
    const ds = dailyStudy.date === today ? dailyStudy : getEmptyDailyStudy();
    const newDs: DailyStudyRecord = {
      ...ds,
      mistakePractices: [...ds.mistakePractices, mistake]
    };
    set({ dailyStudy: newDs });
    setStorage(storageKeys.DAILY_STUDY, newDs);
  },

  recordDailyExample: (example) => {
    const { dailyStudy } = get();
    const today = getTodayStr();
    const ds = dailyStudy.date === today ? dailyStudy : getEmptyDailyStudy();
    const newDs: DailyStudyRecord = {
      ...ds,
      examples: [...ds.examples, example]
    };
    set({ dailyStudy: newDs });
    setStorage(storageKeys.DAILY_STUDY, newDs);
  },

  removeDailyExample: (exampleId) => {
    const { dailyStudy } = get();
    const today = getTodayStr();
    const ds = dailyStudy.date === today ? dailyStudy : getEmptyDailyStudy();
    const newDs: DailyStudyRecord = {
      ...ds,
      examples: ds.examples.filter(e => e.exampleId !== exampleId)
    };
    set({ dailyStudy: newDs });
    setStorage(storageKeys.DAILY_STUDY, newDs);
  },

  getTodayStudy: () => {
    const { dailyStudy } = get();
    const today = getTodayStr();
    return dailyStudy.date === today ? dailyStudy : getEmptyDailyStudy();
  },

  checkAchievements: () => {
    const { progress, achievements, mistakes } = get();
    const newAchievements = achievements.map(a => {
      let currentProgress = 0;
      switch (a.id) {
        case 'a001':
          currentProgress = progress.correctCount + progress.wrongCount >= 1 ? 1 : 0;
          break;
        case 'a002':
          currentProgress = Math.min(progress.correctCount, 10);
          break;
        case 'a003':
          currentProgress = Math.min(progress.correctCount, 50);
          break;
        case 'a004':
          currentProgress = progress.completedLevelIds.length >= 1 ? 1 : 0;
          break;
        case 'a005':
          currentProgress = Math.min(progress.completedLevelIds.length, 5);
          break;
        case 'a006':
          const meetingLevels = 2;
          const meetingCompleted = progress.completedLevelIds.filter(id => id.startsWith('l_meeting')).length;
          currentProgress = meetingCompleted >= meetingLevels ? 1 : 0;
          break;
        case 'a007':
          const reportLevels = 2;
          const reportCompleted = progress.completedLevelIds.filter(id => id.startsWith('l_report')).length;
          currentProgress = reportCompleted >= reportLevels ? 1 : 0;
          break;
        case 'a008':
          currentProgress = Math.min(progress.streak, 7);
          break;
        case 'a009':
          currentProgress = Math.min(progress.streak, 30);
          break;
        case 'a010':
          currentProgress = Math.min(progress.totalScore, 1000);
          break;
        case 'a011':
          currentProgress = 0;
          break;
        case 'a012':
          currentProgress = Math.min(progress.collectedTermIds.length, 20);
          break;
      }

      const achieved = currentProgress >= a.target;
      return {
        ...a,
        progress: currentProgress,
        achievedAt: achieved && !a.achievedAt ? Date.now() : a.achievedAt
      };
    });

    set({ achievements: newAchievements });
    setStorage(storageKeys.ACHIEVEMENTS, newAchievements);
  },

  getDailyQuestion: () => {
    const today = getTodayStr();
    const savedDaily = getStorage<DailyQuestion | null>(storageKeys.DAILY_QUESTION, null);

    if (savedDaily && savedDaily.date === today) {
      set({ dailyQuestion: savedDaily });
      return savedDaily;
    }

    const randomIdx = Math.floor(Math.random() * questionsData.length);
    const question = questionsData[randomIdx];
    const newDaily: DailyQuestion = {
      date: today,
      question,
      answered: false
    };

    setStorage(storageKeys.DAILY_QUESTION, newDaily);
    set({ dailyQuestion: newDaily });
    return newDaily;
  },

  answerDailyQuestion: (isCorrect) => {
    const { dailyQuestion } = get();
    if (!dailyQuestion) return;

    const newDaily: DailyQuestion = {
      ...dailyQuestion,
      answered: true,
      isCorrect
    };

    setStorage(storageKeys.DAILY_QUESTION, newDaily);
    set({ dailyQuestion: newDaily });
    get().updateStreak();
  },

  updateStreak: () => {
    const { progress } = get();
    const today = getTodayStr();
    let newStreak = progress.streak;

    if (progress.lastStudyDate !== today) {
      const streakCalc = calculateStreak(progress.lastStudyDate);
      if (streakCalc === 0 || progress.streak === 0) {
        newStreak = 1;
      } else {
        newStreak = progress.streak + 1;
      }
    }

    const newProgress = {
      ...progress,
      streak: newStreak,
      lastStudyDate: today
    };
    set({ progress: newProgress });
    setStorage(storageKeys.PROGRESS, newProgress);
    get().checkAchievements();
  },

  addUserExample: (termId, text) => {
    const { progress, dailyStudy } = get();
    const newExample = {
      id: `ue_${Date.now()}`,
      termId,
      text,
      author: progress.masteredTermIds.length > 10 ? '资深学员' : '新锐学员',
      likes: 0,
      createdAt: Date.now()
    };
    const newProgress = {
      ...progress,
      userExamples: [...progress.userExamples, newExample]
    };
    set({ progress: newProgress });
    setStorage(storageKeys.PROGRESS, newProgress);

    const today = getTodayStr();
    const ds = dailyStudy.date === today ? dailyStudy : getEmptyDailyStudy();
    const newDs: DailyStudyRecord = {
      ...ds,
      examples: [...ds.examples, {
        exampleId: newExample.id,
        termId,
        text,
        createdAt: newExample.createdAt
      }]
    };
    set({ dailyStudy: newDs });
    setStorage(storageKeys.DAILY_STUDY, newDs);
  },

  updateRemindSettings: (enabled, time) => {
    const { userSettings } = get();
    const newSettings = {
      ...userSettings,
      remindEnabled: typeof enabled === 'boolean' ? enabled : userSettings.remindEnabled,
      remindTime: time || userSettings.remindTime
    };
    set({ userSettings: newSettings });
    setStorage(storageKeys.USER_SETTINGS, newSettings);
    console.log('[Store] remind settings updated:', newSettings);
  }
}));
