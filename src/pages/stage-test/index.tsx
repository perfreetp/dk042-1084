import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import { scenesData } from '@/data/levels';
import { questionsData } from '@/data/questions';
import { useStore } from '@/store/useStore';
import { getSceneColor, getSceneIcon, getSceneName, shuffleArray } from '@/utils/progress';
import ProgressBar from '@/components/ProgressBar';
import SceneTag from '@/components/SceneTag';
import classnames from 'classnames';
import type { SceneType, DifficultyLevel, QuestionType } from '@/types';

type DifficultyOption = 'all' | DifficultyLevel;
type TypeOption = 'all' | QuestionType;

const StageTestPage: React.FC = () => {
  const router = useRouter();
  const { scene = 'meeting' } = router.params;
  const sceneKey = scene as SceneType;

  const { progress } = useStore();

  const [difficulty, setDifficulty] = useState<DifficultyOption>('all');
  const [questionType, setQuestionType] = useState<TypeOption>('all');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [timedMode, setTimedMode] = useState(true);

  const sceneData = useMemo(() => {
    return scenesData.find(s => s.id === sceneKey) || scenesData[0];
  }, [sceneKey]);

  const sceneColor = getSceneColor(sceneKey);
  const sceneIcon = getSceneIcon(sceneKey);

  const sceneQuestions = useMemo(() => {
    return questionsData.filter(q => q.scene === sceneKey);
  }, [sceneKey]);

  const filteredQuestions = useMemo(() => {
    let list = [...sceneQuestions];
    if (difficulty !== 'all') {
      list = list.filter(q => q.difficulty === difficulty);
    }
    if (questionType !== 'all') {
      list = list.filter(q => q.type === questionType);
    }
    return shuffleArray(list).slice(0, Math.min(questionCount, list.length));
  }, [sceneQuestions, difficulty, questionType, questionCount]);

  const sp = progress.sceneProgress[sceneKey];
  const sceneAccuracy = sp.total > 0 ? Math.round((sp.correct / sp.total) * 100) : 0;
  const sceneLevels = useMemo(() => {
    const { levelsData } = require('@/data/levels');
    return levelsData.filter((l: any) => l.scene === sceneKey);
  }, [sceneKey]);
  const completedLevels = sceneLevels.filter((l: any) =>
    progress.completedLevelIds.includes(l.id)
  ).length;
  const overallPercent = sceneLevels.length > 0
    ? Math.round((completedLevels / sceneLevels.length) * 100)
    : 0;

  const canStart = filteredQuestions.length >= 1;

  const countOptions = [
    { value: 3, label: '3', sub: '快速测试' },
    { value: 5, label: '5', sub: '标准测试' },
    { value: 10, label: '10', sub: '深度测试' }
  ];

  const difficultyOptions: { value: DifficultyOption; label: string; icon: string }[] = [
    { value: 'all', label: '全部', icon: '🎲' },
    { value: 'easy', label: '初级', icon: '🌱' },
    { value: 'medium', label: '中级', icon: '🔥' },
    { value: 'hard', label: '高级', icon: '⚡' }
  ];

  const typeOptions: { value: TypeOption; label: string; icon: string }[] = [
    { value: 'all', label: '全部', icon: '🎯' },
    { value: 'meaning', label: '释义', icon: '📖' },
    { value: 'intent', label: '诉求', icon: '🤔' },
    { value: 'rewrite', label: '改写', icon: '✍️' }
  ];

  const handleStartTest = () => {
    if (!canStart) {
      Taro.showToast({ title: '当前筛选条件下没有题目', icon: 'none' });
      return;
    }
    const ids = filteredQuestions.map(q => q.id).join(',');
    Taro.navigateTo({
      url: `/pages/quiz/index?source=scenario&scene=${sceneKey}&questionIds=${ids}&timed=${timedMode ? 1 : 0}`
    });
  };

  return (
    <View className={styles.page}>
      <View className={styles.testHeader}>
        <Text className={styles.testTitle}>🧪 阶段测试</Text>
        <Text className={styles.testSubtitle}>检验你在这个场景的学习成果</Text>
      </View>

      <View className={styles.sceneInfoCard}>
        <View className={styles.sceneMainInfo}>
          <View
            className={styles.sceneIconBox}
            style={{ background: `${sceneColor}1A` }}
          >
            {sceneIcon}
          </View>
          <View className={styles.sceneTextInfo}>
            <Text className={styles.sceneName}>{sceneData.name}</Text>
            <Text className={styles.sceneDesc}>{sceneData.description}</Text>
          </View>
        </View>
        <View className={styles.testStats}>
          <View className={styles.statItem}>
            <Text className={styles.statValue} style={{ color: sceneColor }}>
              {sceneQuestions.length}
            </Text>
            <Text className={styles.statLabel}>题库总量</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue} style={{ color: '#10B981' }}>
              {sp.total}
            </Text>
            <Text className={styles.statLabel}>已做题</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue} style={{ color: '#F59E0B' }}>
              {sceneAccuracy}%
            </Text>
            <Text className={styles.statLabel}>正确率</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue} style={{ color: '#8B5CF6' }}>
              {completedLevels}/{sceneLevels.length}
            </Text>
            <Text className={styles.statLabel}>通关关</Text>
          </View>
        </View>
      </View>

      <View className={styles.progressCard}>
        <View className={styles.progressHeader}>
          <Text className={styles.progressTitle}>
            <Text>📊</Text> 场景整体进度
          </Text>
          <Text className={styles.progressPercent}>{overallPercent}%</Text>
        </View>
        <ProgressBar percent={overallPercent} color={sceneColor} height='16rpx' />
        <View className={styles.progressInfo}>
          <View
            className={`${styles.infoChip} ${
              overallPercent >= 80
                ? styles.infoGood
                : overallPercent >= 50
                ? styles.infoWarning
                : overallPercent > 0
                ? styles.infoBad
                : styles.infoNeutral
            }`}
          >
            {overallPercent >= 80
              ? '🎉 已精通'
              : overallPercent >= 50
              ? '💪 正在进阶'
              : overallPercent > 0
              ? '🚀 入门阶段'
              : '🌱 尚未开始'}
          </View>
          {sceneAccuracy >= 80 && (
            <View className={`${styles.infoChip} ${styles.infoGood}`}>
              🎯 高准确率 {sceneAccuracy}%
            </View>
          )}
          <View className={`${styles.infoChip} ${styles.infoNeutral}`}>
            🏆 {completedLevels} 关已通关
          </View>
        </View>
      </View>

      <View className={styles.setupCard}>
        <Text className={styles.setupTitle}>
          <Text>⚙️</Text> 测试设置
        </Text>

        <Text
          style={{
            fontSize: 24,
            color: '#64748B',
            marginBottom: 16,
            fontWeight: 600
          }}
        >
          题目数量
        </Text>
        <View className={styles.optionGrid}>
          {countOptions.map(opt => (
            <View
              key={opt.value}
              className={classnames(styles.optionItem, {
                [styles.optionItemActive]: questionCount === opt.value
              })}
              onClick={() => setQuestionCount(opt.value)}
            >
              <Text
                className={classnames(styles.optionValue, {
                  [styles.optionValueActive]: questionCount === opt.value
                })}
              >
                {opt.label}
              </Text>
              <Text className={styles.optionLabel}>{opt.sub}</Text>
            </View>
          ))}
        </View>

        <Text
          style={{
            fontSize: 24,
            color: '#64748B',
            marginBottom: 16,
            fontWeight: 600
          }}
        >
          难度筛选
        </Text>
        <View className={styles.optionGrid} style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {difficultyOptions.map(opt => (
            <View
              key={opt.value}
              className={classnames(styles.optionItem, {
                [styles.optionItemActive]: difficulty === opt.value
              })}
              onClick={() => setDifficulty(opt.value)}
              style={{ padding: '16rpx 8rpx' }}
            >
              <Text style={{ fontSize: 32 }}>{opt.icon}</Text>
              <Text
                className={classnames(styles.optionLabel, {
                  [styles.optionValueActive]: difficulty === opt.value
                })}
                style={{ marginTop: 8, fontSize: 22, fontWeight: difficulty === opt.value ? 700 : 500 }}
              >
                {opt.label}
              </Text>
            </View>
          ))}
        </View>

        <View style={{ height: 24 }} />

        <Text
          style={{
            fontSize: 24,
            color: '#64748B',
            marginBottom: 16,
            fontWeight: 600
          }}
        >
          题型筛选
        </Text>
        <View className={styles.optionGrid} style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {typeOptions.map(opt => (
            <View
              key={opt.value}
              className={classnames(styles.optionItem, {
                [styles.optionItemActive]: questionType === opt.value
              })}
              onClick={() => setQuestionType(opt.value)}
              style={{ padding: '16rpx 8rpx' }}
            >
              <Text style={{ fontSize: 32 }}>{opt.icon}</Text>
              <Text
                className={classnames(styles.optionLabel, {
                  [styles.optionValueActive]: questionType === opt.value
                })}
                style={{ marginTop: 8, fontSize: 22, fontWeight: questionType === opt.value ? 700 : 500 }}
              >
                {opt.label}
              </Text>
            </View>
          ))}
        </View>

        <View style={{ height: 20, marginTop: 12, borderTop: '1rpx solid #F1F5F9', paddingTop: 24 }}>
          <View className={styles.switchRow}>
            <View className={styles.switchLabel}>
              <Text>⏱</Text>
              <Text>限时挑战模式</Text>
            </View>
            <View
              className={classnames(styles.switchBox, {
                [styles.switchBoxOn]: timedMode
              })}
              onClick={() => setTimedMode(!timedMode)}
            >
              <View className={styles.switchDot} />
            </View>
          </View>
        </View>
      </View>

      <View className={styles.previewCard}>
        <Text className={styles.previewTitle}>
          <Text>📋</Text> 本次测试预览
        </Text>
        <View className={styles.previewList}>
          <View
            className={styles.previewTag}
            style={{ background: '#EEF2FF', color: '#4338CA' }}
          >
            {filteredQuestions.length} 道题
          </View>
          <View
            className={styles.previewTag}
            style={{ background: '#FEF3C7', color: '#B45309' }}
          >
            总分 {filteredQuestions.reduce((s, q) => s + q.points, 0)}
          </View>
          {timedMode && (
            <View
              className={styles.previewTag}
              style={{ background: '#FEE2E2', color: '#DC2626' }}
            >
              ⏱ 限时模式
            </View>
          )}
          <SceneTag scene={sceneKey} size='small' />
          {difficulty !== 'all' && (
            <SceneTag difficulty={difficulty} size='small' showIcon />
          )}
          {questionType !== 'all' && (
            <SceneTag questionType={questionType} size='small' />
          )}
        </View>
      </View>

      <View className={styles.tipsCard}>
        <Text className={styles.tipsTitle}>
          <Text>💡</Text> 测试说明
        </Text>
        <View className={styles.tipsItem}>
          <Text className={styles.tipsItemIcon}>•</Text>
          <Text className={styles.tipsItemText}>
            测试从该场景题库中随机抽取题目，每次顺序不同
          </Text>
        </View>
        <View className={styles.tipsItem}>
          <Text className={styles.tipsItemIcon}>•</Text>
          <Text className={styles.tipsItemText}>
            开启限时模式后，每道题有倒计时，超时自动判错
          </Text>
        </View>
        <View className={styles.tipsItem}>
          <Text className={styles.tipsItemIcon}>•</Text>
          <Text className={styles.tipsItemText}>
            错题会自动加入错题本，方便后续重练巩固
          </Text>
        </View>
        <View className={styles.tipsItem}>
          <Text className={styles.tipsItemIcon}>•</Text>
          <Text className={styles.tipsItemText}>
            正确率 80% 以上视为通过，可获得额外积分奖励
          </Text>
        </View>
      </View>

      <View className={styles.paddingBottom} />

      <View className={styles.bottomBar}>
        <Button
          className={styles.btnSecondary}
          onClick={() => Taro.navigateBack()}
        >
          返回
        </Button>
        <Button
          className={`${styles.btnStart} ${!canStart ? styles.btnStartDisabled : ''}`}
          onClick={handleStartTest}
        >
          {canStart
            ? `🚀 开始测试（${filteredQuestions.length} 题）`
            : '暂无匹配题目'}
        </Button>
      </View>
    </View>
  );
};

export default StageTestPage;
