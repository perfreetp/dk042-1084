import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Button } from '@tarojs/components';
import classnames from 'classnames';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import { levelsData, scenesData } from '@/data/levels';
import { questionsData } from '@/data/questions';
import { termsData } from '@/data/terms';
import { useStore } from '@/store/useStore';
import { getSceneColor, getSceneIcon, getSceneName, getQuestionTypeName } from '@/utils/progress';
import SceneTag from '@/components/SceneTag';
import ProgressBar from '@/components/ProgressBar';
import dayjs from 'dayjs';

const LevelDetailPage: React.FC = () => {
  const router = useRouter();
  const { levelId } = router.params;
  const { progress, completeLevel } = useStore();

  const [isUnlocked, setIsUnlocked] = useState(true);

  const level = useMemo(() => {
    return levelsData.find(l => l.id === levelId);
  }, [levelId]);

  const scene = useMemo(() => {
    if (!level) return null;
    return scenesData.find(s => s.id === level.scene);
  }, [level]);

  const questions = useMemo(() => {
    if (!level) return [];
    return level.questionIds
      .map(qid => questionsData.find(q => q.id === qid))
      .filter(Boolean);
  }, [level]);

  const currentScore = progress.levelScores[levelId || ''] || 0;
  const isCompleted = progress.completedLevelIds.includes(levelId || '');
  const lastAttempt = levelId ? progress.levelAttempts[levelId] : undefined;
  const sceneColor = scene ? getSceneColor(scene.id) : '#6366F1';
  const sceneIcon = scene ? getSceneIcon(scene.id) : '📝';
  const totalPoints = questions.reduce((sum, q) => sum + (q?.points || 0), 0);

  const lastAttemptTerms = useMemo(() => {
    if (!lastAttempt?.weakTermIds?.length) return [];
    return lastAttempt.weakTermIds.map(id => termsData.find(t => t.id === id)).filter(Boolean).slice(0, 3);
  }, [lastAttempt]);

  useEffect(() => {
    if (!level) return;

    const sceneLevels = levelsData
      .filter(l => l.scene === level.scene)
      .sort((a, b) => a.order - b.order);
    const idx = sceneLevels.findIndex(l => l.id === level.id);

    if (idx <= 0) {
      setIsUnlocked(true);
    } else {
      const prevLevel = sceneLevels[idx - 1];
      setIsUnlocked(progress.completedLevelIds.includes(prevLevel.id));
    }
  }, [level, progress.completedLevelIds]);

  const handleStartQuiz = () => {
    if (!isUnlocked) {
      Taro.showToast({ title: '请先完成前置关卡', icon: 'none' });
      return;
    }
    Taro.navigateTo({
      url: `/pages/quiz/index?source=level&levelId=${levelId}&questionIds=${level?.questionIds.join(',')}`
    });
  };

  if (!level || !scene) {
    return (
      <View className={styles.page}>
        <View className='pageContainer'>
          <Text>关卡不存在</Text>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.page}>
      <View className={styles.levelHeader} style={{ background: `linear-gradient(135deg, ${sceneColor} 0%, #8B5CF6 100%)` }}>
        <View className={styles.levelTitleRow}>
          <View className={styles.levelIconBox}>{sceneIcon}</View>
          <View className={styles.levelTitleInfo}>
            <Text className={styles.levelName}>{level.name}</Text>
            <Text className={styles.levelDesc}>{level.description}</Text>
          </View>
        </View>

        <View className={styles.tagRow}>
          <SceneTag scene={level.scene} size='medium' />
          <SceneTag difficulty={level.difficulty} size='medium' showIcon />
          <View style={{
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '24rpx',
            padding: '8rpx 20rpx',
            fontSize: '24rpx',
            color: '#fff',
            lineHeight: 1.6
          }}>
            {questions.length} 道题
          </View>
        </View>

        <View className={styles.statRow}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{totalPoints}</Text>
            <Text className={styles.statLabel}>总积分</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{level.requiredScore}</Text>
            <Text className={styles.statLabel}>通关分</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>
              {questions.reduce((sum, q) => sum + (q?.timeLimit || 0), 0)}s
            </Text>
            <Text className={styles.statLabel}>限时总计</Text>
          </View>
        </View>
      </View>

      <View className={styles.progressCard}>
        <View className={styles.progressHeader}>
          <Text className={styles.progressTitle}>通关进度</Text>
          <Text className={styles.progressPercent}>
            {totalPoints > 0 ? Math.min(100, Math.round((currentScore / totalPoints) * 100)) : 0}%
          </Text>
        </View>
        <ProgressBar
          percent={totalPoints > 0 ? Math.min(100, Math.round((currentScore / totalPoints) * 100)) : 0}
          color={sceneColor}
          height='16rpx'
        />
        <View className={styles.progressInfo}>
          <View className={`${styles.infoChip} ${styles.infoRequired}`}>
            通关要求：{level.requiredScore} 分
          </View>
          <View className={`${styles.infoChip} ${styles.infoCurrent}`}>
            当前得分：{currentScore} 分
          </View>
          {isCompleted && (
            <View className={styles.infoChip} style={{ background: '#EDE9FE', color: '#6D28D9' }}>
              ✅ 已通关
            </View>
          )}
        </View>
      </View>

      {lastAttempt && (
        <View className={styles.attemptCard}>
          <View className={styles.attemptHeader}>
            <Text className={styles.attemptTitle}>
              <Text>📊</Text> 最近一次挑战
            </Text>
            <View className={classnames(
              styles.attemptBadge,
              lastAttempt.passed ? styles.attemptBadgePassed : styles.attemptBadgeFailed
            )}>
              {lastAttempt.passed ? '已通关' : '未通关'}
            </View>
          </View>
          <Text className={styles.attemptTime}>
            {dayjs(lastAttempt.attemptedAt).format('YYYY-MM-DD HH:mm')}
          </Text>
          <View className={styles.attemptStats}>
            <View className={styles.attemptStatItem}>
              <Text className={styles.attemptStatValue} style={{ color: sceneColor }}>
                {lastAttempt.score}
              </Text>
              <Text className={styles.attemptStatLabel}>得分</Text>
            </View>
            <View className={styles.attemptStatItem}>
              <Text className={styles.attemptStatValue} style={{ color: '#10B981' }}>
                {lastAttempt.correctCount}/{lastAttempt.totalQuestions}
              </Text>
              <Text className={styles.attemptStatLabel}>正确/总数</Text>
            </View>
            <View className={styles.attemptStatItem}>
              <Text className={styles.attemptStatValue} style={{ color: '#6366F1' }}>
                {lastAttempt.accuracy}%
              </Text>
              <Text className={styles.attemptStatLabel}>正确率</Text>
            </View>
          </View>
          {lastAttempt.weakTypes?.length > 0 && (
            <View className={styles.attemptWeak}>
              <Text className={styles.attemptWeakLabel}>薄弱题型：</Text>
              <View style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {lastAttempt.weakTypes.map(t => (
                  <SceneTag key={t} questionType={t} size='small' />
                ))}
              </View>
            </View>
          )}
          {lastAttemptTerms.length > 0 && (
            <View className={styles.attemptWeak}>
              <Text className={styles.attemptWeakLabel}>需巩固词条：</Text>
              <View style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {lastAttemptTerms.map(t => (
                  <Text
                    key={t?.id}
                    className={styles.attemptTermTag}
                    onClick={() => Taro.navigateTo({ url: `/pages/term-detail/index?id=${t?.id}` })}
                  >
                    {t?.word}
                  </Text>
                ))}
              </View>
            </View>
          )}
        </View>
      )}

      <View className={styles.contentCard}>
        <Text className={styles.sectionTitle}>
          <Text>📋</Text> 题目预览
        </Text>
        <View className={styles.questionList}>
          {questions.map((q, idx) => (
            <View
              key={q?.id}
              className={styles.questionItem}
              onClick={() => {
                Taro.navigateTo({
                  url: `/pages/quiz/index?source=single&questionId=${q?.id}`
                });
              }}
            >
              <View className={styles.questionIndex}>{idx + 1}</View>
              <View className={styles.questionContent}>
                <Text className={styles.questionText}>{q?.title}</Text>
                <View className={styles.questionMeta}>
                  <SceneTag questionType={q?.type} size='small' />
                  <View className={styles.pointsBadge}>+{q?.points}分</View>
                  <View className={styles.timeBadge}>⏱ {q?.timeLimit}s</View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.paddingBottom} />

      <View className={styles.bottomBar}>
        <Button
          className={`${styles.btnStart} ${!isUnlocked ? styles.btnStartDisabled : ''}`}
          onClick={handleStartQuiz}
        >
          {!isUnlocked
            ? '🔒 关卡未解锁'
            : isCompleted
            ? `🔄 再次挑战（最高 ${currentScore} 分）`
            : `🚀 开始闯关（${questions.length} 题）`}
        </Button>
      </View>
    </View>
  );
};

export default LevelDetailPage;
