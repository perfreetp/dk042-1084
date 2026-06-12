import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useStore } from '@/store/useStore';
import { scenesData, levelsData } from '@/data/levels';
import LevelCard from '@/components/LevelCard';
import { getSceneColor } from '@/utils/progress';
import type { SceneType } from '@/types';
import SceneTag from '@/components/SceneTag';

const HomePage: React.FC = () => {
  const {
    progress,
    userSettings,
    initStore,
    getDailyQuestion,
    dailyQuestion
  } = useStore();

  const [greetingText, setGreetingText] = useState('');
  const [localDaily, setLocalDaily] = useState(dailyQuestion);

  useEffect(() => {
    initStore();
    const dq = getDailyQuestion();
    setLocalDaily(dq);

    const hour = new Date().getHours();
    if (hour < 6) setGreetingText('夜深了，注意休息~');
    else if (hour < 12) setGreetingText('早上好，今天也要加油！');
    else if (hour < 14) setGreetingText('中午好，记得午休哦');
    else if (hour < 18) setGreetingText('下午好，冲杯咖啡继续干');
    else setGreetingText('晚上好，来练练黑话吧');

    console.log('[Home] mounted, totalScore:', progress.totalScore);
  }, []);

  useEffect(() => {
    setLocalDaily(dailyQuestion);
  }, [dailyQuestion]);

  const totalQuestions = progress.correctCount + progress.wrongCount;
  const accuracy = totalQuestions > 0
    ? Math.round((progress.correctCount / totalQuestions) * 100)
    : 0;

  const handleStartDaily = () => {
    if (localDaily?.answered) {
      Taro.showToast({ title: '今日已完成，明天再来~', icon: 'none' });
      return;
    }
    Taro.navigateTo({
      url: `/pages/quiz/index?source=daily&questionId=${localDaily?.question.id}`
    });
  };

  const handleLevelClick = (levelId: string) => {
    Taro.navigateTo({
      url: `/pages/level-detail/index?levelId=${levelId}`
    });
  };

  const getSceneLevelsWithState = (scene: SceneType) => {
    const sceneLevels = levelsData
      .filter(l => l.scene === scene)
      .sort((a, b) => a.order - b.order);

    return sceneLevels.map((level, idx) => {
      const prevLevel = idx > 0 ? sceneLevels[idx - 1] : null;
      const prevCompleted = prevLevel
        ? progress.completedLevelIds.includes(prevLevel.id)
        : true;

      return {
        ...level,
        unlocked: level.unlocked || prevCompleted,
        completed: progress.completedLevelIds.includes(level.id),
        score: progress.levelScores[level.id] || 0
      };
    });
  };

  const getSceneStats = (scene: SceneType) => {
    const sp = progress.sceneProgress[scene];
    const sceneLevels = levelsData.filter(l => l.scene === scene);
    const completedLevels = sceneLevels.filter(l =>
      progress.completedLevelIds.includes(l.id)
    ).length;
    const accuracy = sp.total > 0
      ? Math.round((sp.correct / sp.total) * 100)
      : 0;
    return {
      total: sp.total,
      correct: sp.correct,
      accuracy,
      completedLevels,
      totalLevels: sceneLevels.length
    };
  };

  return (
    <View className={styles.page}>
      <View className='pageContainer'>
        <View className={styles.heroSection}>
          <View className={styles.greetingRow}>
            <View className={styles.greetingInfo}>
              <Text className={styles.greetingTitle}>
                你好，{userSettings.nickname}
              </Text>
              <Text className={styles.greetingSub}>{greetingText}</Text>
            </View>
            <View className={styles.streakBadge}>
              <Text className={styles.streakIcon}>🔥</Text>
              <Text className={styles.streakText}>
                {progress.streak > 0 ? `${progress.streak}天` : '0天'}
              </Text>
            </View>
          </View>

          <View className={styles.heroStats}>
            <View className={styles.statItem}>
              <Text className={styles.statValue}>{progress.totalScore}</Text>
              <Text className={styles.statLabel}>总积分</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statValue}>{progress.correctCount}</Text>
              <Text className={styles.statLabel}>答对题</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statValue}>{accuracy}%</Text>
              <Text className={styles.statLabel}>正确率</Text>
            </View>
          </View>
        </View>

        {localDaily && (
          <View className={styles.dailyCard}>
            <View className={styles.dailyLabel}>
              <Text className={styles.dailyLabelText}>📅 每日一题</Text>
              <View className={styles.dailyBadge}>
                {localDaily.answered
                  ? (localDaily.isCorrect ? '已答对 +15' : '已完成')
                  : `${localDaily.question.points}积分`}
              </View>
            </View>
            <Text className={styles.dailyContent}>
              {localDaily.question.title}
            </Text>
            <View style={{ display: 'flex', gap: '16rpx', marginBottom: '24rpx', flexWrap: 'wrap' }}>
              <SceneTag scene={localDaily.question.scene} size="small" />
              <SceneTag difficulty={localDaily.question.difficulty} size="small" showIcon={false} />
              <SceneTag questionType={localDaily.question.type} size="small" />
            </View>
            <View className={styles.dailyAction}>
              <Text className={styles.dailyMetaMeta}>
                答题时间 {localDaily.question.timeLimit}秒
              </Text>
              <Button className={styles.dailyBtn} onClick={handleStartDaily}>
                {localDaily.answered ? '查看解析' : '立即答题 →'}
              </Button>
            </View>
          </View>
        )}

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.sectionTitleIcon}>🎯</Text>
              场景闯关
            </Text>
          </View>
          <Text className={styles.sectionDesc}>
            从日常职场场景切入，循序渐进，让黑话不再是你的阅读障碍
          </Text>

          <View className={styles.sceneList}>
            {scenesData.map(scene => {
              const sceneColor = getSceneColor(scene.id);
              const levels = getSceneLevelsWithState(scene.id);
              const stats = getSceneStats(scene.id);
              const progressPercent = stats.totalLevels > 0
                ? Math.round((stats.completedLevels / stats.totalLevels) * 100)
                : 0;

              return (
                <View
                  key={scene.id}
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: '16rpx',
                    padding: '32rpx',
                    boxShadow: '0 2rpx 12rpx rgba(0,0,0,0.06)',
                    marginBottom: '24rpx'
                  }}
                >
                  <View className={styles.sceneHeader}
                    style={{
                      backgroundColor: `${sceneColor}10`,
                      marginBottom: '24rpx'
                    }}
                  >
                    <View className={styles.sceneIconBox}
                      style={{ backgroundColor: `${sceneColor}1A` }}
                    >
                      <Text className={styles.sceneIcon}>{scene.icon}</Text>
                    </View>
                    <View className={styles.sceneInfo}>
                      <Text className={styles.sceneName}>{scene.name}</Text>
                      <Text className={styles.sceneDesc}>{scene.description}</Text>
                    </View>
                    <View style={{
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      flexShrink: 0
                    }}>
                      <Text style={{
                        fontSize: '36rpx',
                        fontWeight: 700,
                        color: sceneColor,
                        lineHeight: 1.2
                      }}>
                        {progressPercent}%
                      </Text>
                      <Text style={{
                        fontSize: '22rpx',
                        color: '#94A3B8'
                      }}>
                        {stats.completedLevels}/{stats.totalLevels}关
                      </Text>
                    </View>
                  </View>

                  {levels.map(level => (
                    <LevelCard
                      key={level.id}
                      level={level}
                      completed={level.completed}
                      score={level.score}
                      onClick={() => handleLevelClick(level.id)}
                    />
                  ))}

                  <View className={styles.sceneProgressInfo}>
                    <View className={styles.rateBox}>
                      <Text className={styles.rateValue} style={{ color: sceneColor }}>
                        {stats.total}
                      </Text>
                      <Text className={styles.rateLabel}>做题数</Text>
                    </View>
                    <View className={styles.rateBox}>
                      <Text className={styles.rateValue} style={{ color: '#10B981' }}>
                        {stats.accuracy}%
                      </Text>
                      <Text className={styles.rateLabel}>正确率</Text>
                    </View>
                    <View className={styles.rateBox}>
                      <Text className={styles.rateValue} style={{ color: '#8B5CF6' }}>
                        {stats.correct}
                      </Text>
                      <Text className={styles.rateLabel}>答对</Text>
                    </View>
                  </View>

                  <View className={styles.sceneMetaRow}>
                    <View className={styles.metaItem}>
                      <Text style={{ fontSize: '22rpx' }}>📊</Text>
                      <Text className={styles.metaItemText}>阶段测试</Text>
                    </View>
                    <View
                      className={styles.metaItemBtn}
                      onClick={() => {
                        Taro.navigateTo({
                          url: `/pages/stage-test/index?scene=${scene.id}`
                        });
                      }}
                    >
                      去测试 →
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
};

export default HomePage;
