import React, { useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useStore } from '@/store/useStore';
import { levelsData } from '@/data/levels';
import { termsData } from '@/data/terms';
import { getSceneColor, getQuestionTypeName } from '@/utils/progress';
import dayjs from 'dayjs';
import type { SceneType } from '@/types';
import EmptyState from '@/components/EmptyState';

const TodayReviewPage: React.FC = () => {
  const { progress, mistakes, dailyStudy } = useStore();

  const stats = useMemo(() => {
    const levelScore = dailyStudy.levels.reduce((sum, l) => sum + l.score, 0);
    const levelsPassed = dailyStudy.levels.filter(l => l.passed).length;
    const levelsAttempted = dailyStudy.levels.length;
    const mistakesPracticed = dailyStudy.mistakePractices.reduce((sum, m) => sum + m.totalCount, 0);
    const mistakesMastered = dailyStudy.mistakePractices.reduce((sum, m) => sum + m.correctCount, 0);
    const examplesAdded = dailyStudy.examples.length;
    const totalActivities = levelsAttempted + dailyStudy.mistakePractices.length + examplesAdded;

    return {
      levelScore,
      levelsPassed,
      levelsAttempted,
      mistakesPracticed,
      mistakesMastered,
      examplesAdded,
      totalActivities
    };
  }, [dailyStudy]);

  const hasAnyActivity = stats.totalActivities > 0 || mistakes.length > 0;

  const pendingMistakes = mistakes.length;
  const suggestedMistakes = useMemo(() => {
    if (mistakes.length === 0) return [];
    return [...mistakes].sort((a, b) => {
      const scoreA = a.wrongCount * 3 + (Date.now() - a.lastWrongAt < 24 * 3600 * 1000 ? 2 : 0);
      const scoreB = b.wrongCount * 3 + (Date.now() - b.lastWrongAt < 24 * 3600 * 1000 ? 2 : 0);
      return scoreB - scoreA;
    }).slice(0, 3);
  }, [mistakes]);

  const handleGoLevel = (levelId: string) => {
    Taro.navigateTo({ url: `/pages/level-detail/index?levelId=${levelId}` });
  };

  const handleGoTerm = (termId?: string) => {
    if (!termId) return;
    Taro.navigateTo({ url: `/pages/term-detail/index?id=${termId}` });
  };

  const handlePracticeMistakes = (questionIds?: string[]) => {
    if (questionIds?.length) {
      const ids = questionIds.join(',');
      Taro.navigateTo({ url: `/pages/quiz/index?source=mistakes&questionIds=${ids}` });
    } else {
      Taro.switchTab({ url: '/pages/mistakes/index' });
    }
  };

  const handlePracticeSuggested = () => {
    if (suggestedMistakes.length === 0) return;
    const ids = suggestedMistakes.map(m => m.question.id).join(',');
    Taro.navigateTo({ url: `/pages/quiz/index?source=mistakes&questionIds=${ids}` });
  };

  return (
    <View className={styles.page}>
      <View className='pageContainer'>
        <View className={styles.headerCard}>
          <Text className={styles.headerIcon}>📅</Text>
          <Text className={styles.headerTitle}>今日学习复盘</Text>
          <Text className={styles.headerDate}>
            {dayjs().format('YYYY 年 M 月 D 日')}
          </Text>
        </View>

        <View className={styles.statsRow}>
          <View className={styles.statCard}>
            <Text className={styles.statValue} style={{ color: '#6366F1' }}>
              {stats.levelScore}
            </Text>
            <Text className={styles.statLabel}>今日获得积分</Text>
          </View>
          <View className={styles.statCard}>
            <Text className={styles.statValue} style={{ color: '#10B981' }}>
              {stats.levelsPassed}/{stats.levelsAttempted}
            </Text>
            <Text className={styles.statLabel}>关卡通关</Text>
          </View>
          <View className={styles.statCard}>
            <Text className={styles.statValue} style={{ color: '#F59E0B' }}>
              {stats.mistakesMastered}
            </Text>
            <Text className={styles.statLabel}>错题掌握</Text>
          </View>
          <View className={styles.statCard}>
            <Text className={styles.statValue} style={{ color: '#EC4899' }}>
              {stats.examplesAdded}
            </Text>
            <Text className={styles.statLabel}>例句贡献</Text>
          </View>
        </View>

        {!hasAnyActivity ? (
          <View className={styles.emptyWrap}>
            <EmptyState
              icon='🚀'
              title='今天还没有开始学习哦'
              description='挑一道错题练一练，或者挑战一个新关卡吧'
              actionText='去首页看看'
              onAction={() => Taro.switchTab({ url: '/pages/home/index' })}
            />
          </View>
        ) : (
          <ScrollView scrollY className={styles.contentArea}>
            {dailyStudy.levels.length > 0 && (
              <View className={styles.section}>
                <View className={styles.sectionHeader}>
                  <Text className={styles.sectionIcon}>🏆</Text>
                  <Text className={styles.sectionTitle}>关卡挑战（{dailyStudy.levels.length}）</Text>
                </View>
                <View className={styles.itemList}>
                  {dailyStudy.levels.slice().reverse().map(level => {
                    const levelData = levelsData.find(l => l.id === level.levelId);
                    const sceneColor = levelData?.scene ? getSceneColor(levelData.scene as SceneType) : '#6366F1';
                    return (
                      <View
                        key={`${level.levelId}-${level.attemptedAt}`}
                        className={styles.levelItem}
                        onClick={() => handleGoLevel(level.levelId)}
                      >
                        <View className={styles.levelLeft}>
                          <Text
                            className={styles.levelBadge}
                            style={{
                              background: level.passed ? '#D1FAE5' : '#FEE2E2',
                              color: level.passed ? '#065F46' : '#991B1B'
                            }}
                          >
                            {level.passed ? '✓ 通关' : '✗ 未通关'}
                          </Text>
                          <Text className={styles.levelTitle}>
                            {levelData?.title || level.levelId}
                          </Text>
                          <Text className={styles.levelTime}>
                            {dayjs(level.attemptedAt).format('HH:mm')}
                          </Text>
                        </View>
                        <View className={styles.levelRight}>
                          <Text className={styles.levelScore} style={{ color: sceneColor }}>
                            {level.score} 分
                          </Text>
                          <Text className={styles.levelArrow}>›</Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

            {dailyStudy.mistakePractices.length > 0 && (
              <View className={styles.section}>
                <View className={styles.sectionHeader}>
                  <Text className={styles.sectionIcon}>📝</Text>
                  <Text className={styles.sectionTitle}>错题重练（{dailyStudy.mistakePractices.length} 次）</Text>
                </View>
                <View className={styles.itemList}>
                  {dailyStudy.mistakePractices.slice().reverse().map((practice, idx) => {
                    const acc = practice.totalCount > 0
                      ? Math.round((practice.correctCount / practice.totalCount) * 100)
                      : 0;
                    const accColor = acc >= 60 ? '#10B981' : '#EF4444';
                    return (
                      <View
                        key={`practice-${idx}-${practice.completedAt}`}
                        className={styles.practiceItem}
                        onClick={() => handlePracticeMistakes(practice.questionIds)}
                      >
                        <View className={styles.practiceLeft}>
                          <Text className={styles.practiceTitle}>
                            错题重练 · {practice.totalCount} 道
                          </Text>
                          <Text className={styles.practiceTime}>
                            {dayjs(practice.completedAt).format('HH:mm')}
                          </Text>
                        </View>
                        <View className={styles.practiceRight}>
                          <Text className={styles.practiceAcc} style={{ color: accColor }}>
                            正确率 {acc}%
                          </Text>
                          <Text className={styles.practiceSub}>
                            对 {practice.correctCount} / 错 {practice.totalCount - practice.correctCount}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

            {dailyStudy.examples.length > 0 && (
              <View className={styles.section}>
                <View className={styles.sectionHeader}>
                  <Text className={styles.sectionIcon}>✏️</Text>
                  <Text className={styles.sectionTitle}>例句贡献（{dailyStudy.examples.length}）</Text>
                </View>
                <View className={styles.itemList}>
                  {dailyStudy.examples.slice().reverse().map(ex => {
                    const term = termsData.find(t => t.id === ex.termId);
                    const sceneColor = term?.scenes[0] ? getSceneColor(term.scenes[0] as SceneType) : '#EC4899';
                    return (
                      <View
                        key={ex.exampleId}
                        className={styles.exampleItem}
                        onClick={() => handleGoTerm(ex.termId)}
                      >
                        <Text className={styles.exampleTerm} style={{ color: sceneColor }}>
                          {term?.word || '未知词条'}
                        </Text>
                        <Text className={styles.exampleText} numberOfLines={2}>
                          "{ex.text}"
                        </Text>
                        <Text className={styles.exampleTime}>
                          {dayjs(ex.createdAt).format('HH:mm')}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

            {pendingMistakes > 0 && (
              <View className={styles.suggestCard}>
                <View className={styles.suggestHeader}>
                  <View>
                    <Text className={styles.suggestTitle}>🎯 还可以继续</Text>
                    <Text className={styles.suggestSub}>
                      还有 {pendingMistakes} 道错题等待攻克
                    </Text>
                  </View>
                </View>

                {suggestedMistakes.length > 0 && (
                  <View className={styles.suggestList}>
                    {suggestedMistakes.map((m, idx) => (
                      <View
                        key={m.question.id}
                        className={styles.suggestItem}
                        onClick={() => handlePracticeMistakes([m.question.id])}
                      >
                        <Text className={styles.suggestRank}>#{idx + 1}</Text>
                        <Text className={styles.suggestQtitle} numberOfLines={1}>
                          {m.question.title}
                        </Text>
                        <Text className={styles.suggestType}>
                          {getQuestionTypeName(m.question.type)}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                <View className={styles.suggestActions}>
                  <Text
                    className={styles.suggestBtnSecondary}
                    onClick={() => Taro.switchTab({ url: '/pages/mistakes/index' })}
                  >
                    查看全部错题
                  </Text>
                  <Text
                    className={styles.suggestBtnPrimary}
                    onClick={handlePracticeSuggested}
                  >
                    开始攻克 Top {suggestedMistakes.length}
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

export default TodayReviewPage;
