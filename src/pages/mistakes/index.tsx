import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { useStore } from '@/store/useStore';
import SceneTag from '@/components/SceneTag';
import EmptyState from '@/components/EmptyState';
import { getSceneColor } from '@/utils/progress';
import dayjs from 'dayjs';
import type { SceneType } from '@/types';

const MistakesPage: React.FC = () => {
  const { mistakes, removeMistake, updateStreak } = useStore();
  const [activeScene, setActiveScene] = useState<SceneType | 'all'>('all');

  const filteredMistakes = useMemo(() => {
    if (activeScene === 'all') return mistakes;
    return mistakes.filter(m => m.question.scene === activeScene);
  }, [mistakes, activeScene]);

  const totalWrongCount = mistakes.reduce((sum, m) => sum + m.wrongCount, 0);
  const sceneStats = useMemo(() => {
    const stats: Record<string, number> = { all: mistakes.length };
    mistakes.forEach(m => {
      stats[m.question.scene] = (stats[m.question.scene] || 0) + 1;
    });
    return stats;
  }, [mistakes]);

  const sceneFilters = [
    { id: 'all', name: '全部' },
    { id: 'meeting', name: '会议' },
    { id: 'report', name: '汇报' },
    { id: 'sales', name: '销售' },
    { id: 'hiring', name: '招聘' },
    { id: 'review', name: '复盘' }
  ];

  const getOptionText = (question, key) => {
    const opt = question.options.find(o => o.key === key);
    return opt ? `${key}. ${opt.text}` : key;
  };

  const handlePractice = (questionId?: string) => {
    updateStreak();
    if (questionId) {
      Taro.navigateTo({
        url: `/pages/quiz/index?source=mistake&questionId=${questionId}`
      });
    } else {
      const ids = filteredMistakes.map(m => m.question.id).join(',');
      Taro.navigateTo({
        url: `/pages/quiz/index?source=mistakePractice&ids=${ids}`
      });
    }
  };

  const handleRemove = (questionId, title) => {
    Taro.showModal({
      title: '确认移除',
      content: `确定要从错题本中移除「${title.slice(0, 20)}...」吗？`,
      confirmColor: '#EF4444',
      success: (res) => {
        if (res.confirm) {
          removeMistake(questionId);
          Taro.showToast({ title: '已移除', icon: 'success' });
        }
      }
    });
  };

  return (
    <View className={styles.page}>
      <View className='pageContainer'>
        <View className={styles.statsRow}>
          <View className={styles.statCard}>
            <Text className={styles.statValue} style={{ color: '#EF4444' }}>
              {mistakes.length}
            </Text>
            <Text className={styles.statLabel}>错题数</Text>
          </View>
          <View className={styles.statCard}>
            <Text className={styles.statValue} style={{ color: '#F59E0B' }}>
              {totalWrongCount}
            </Text>
            <Text className={styles.statLabel}>累计错误</Text>
          </View>
          <View className={styles.statCard}>
            <Text className={styles.statValue} style={{ color: '#10B981' }}>
              {mistakes.length > 0 ? Math.round((1 - mistakes.length / 40) * 100) : 100}%
            </Text>
            <Text className={styles.statLabel}>掌握率</Text>
          </View>
        </View>

        <View className={styles.filterRow}>
          <ScrollView scrollX enhanced showScrollbar={false} style={{ whiteSpace: 'nowrap' }}>
            {sceneFilters.map(f => (
              <View
                key={f.id}
                className={classnames(
                  styles.filterItem,
                  activeScene === f.id && styles.filterItemActive
                )}
                onClick={() => setActiveScene(f.id as any)}
                style={{ display: 'inline-block', marginRight: 16 }}
              >
                <Text
                  className={classnames(
                    styles.filterText,
                    activeScene === f.id && styles.filterTextActive
                  )}
                >
                  {f.name}
                  {sceneStats[f.id] !== undefined && ` (${sceneStats[f.id]})`}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View className={styles.actionBar}>
          <Text className={styles.actionTitle}>
            <Text>📝</Text>
            错题列表
          </Text>
        </View>

        {filteredMistakes.length === 0 ? (
          <View className={styles.emptyWrap}>
            <EmptyState
              icon='🎉'
              title='暂无错题'
              description={mistakes.length === 0
                ? '太棒了！暂时没有错题，继续保持！'
                : '当前分类暂无错题，换个分类看看吧'}
              actionText='去刷题'
              onAction={() => Taro.switchTab({ url: '/pages/scenario/index' })}
            />
          </View>
        ) : (
          <View className={styles.mistakeList}>
            {filteredMistakes.map(m => {
              const sceneColor = getSceneColor(m.question.scene);
              return (
                <View key={m.question.id} className={styles.mistakeCard}>
                  <View className={styles.mcHeader}>
                    <View className={styles.mcTags}>
                      <SceneTag scene={m.question.scene} size='small' />
                      <SceneTag difficulty={m.question.difficulty} size='small' showIcon={false} />
                      <SceneTag questionType={m.question.type} size='small' />
                    </View>
                    <View className={styles.mcCount}>
                      错{m.wrongCount}次
                    </View>
                  </View>

                  <Text className={styles.mcTitle}>{m.question.title}</Text>

                  <View className={styles.mcCompare}>
                    <View className={classnames(styles.mcBox, styles.mcBoxWrong)}>
                      <Text className={styles.mcBoxLabel} style={{ color: '#EF4444' }}>
                        ❌ 你的选择
                      </Text>
                      <Text className={styles.mcBoxText}>
                        {getOptionText(m.question, m.userAnswer)}
                      </Text>
                    </View>
                    <View className={classnames(styles.mcBox, styles.mcBoxRight)}>
                      <Text className={styles.mcBoxLabel} style={{ color: '#10B981' }}>
                        ✅ 正确答案
                      </Text>
                      <Text className={styles.mcBoxText}>
                        {getOptionText(m.question, m.correctAnswer)}
                      </Text>
                    </View>
                  </View>

                  <View className={styles.mcFooter}>
                    <View className={styles.mcMeta}>
                      <View className={styles.mcMetaItem}>
                        <Text>⏰</Text>
                        <Text>{dayjs(m.lastWrongAt).fromNow()}</Text>
                      </View>
                    </View>
                    <View className={styles.mcActions}>
                      <Text
                        className={classnames(styles.mcActionBtn, styles.mcActionBtnRemove)}
                        onClick={() => handleRemove(m.question.id, m.question.title)}
                      >
                        移除
                      </Text>
                      <Text
                        className={classnames(styles.mcActionBtn, styles.mcActionBtnPractice)}
                        style={{ backgroundColor: `${sceneColor}14`, color: sceneColor }}
                        onClick={() => handlePractice(m.question.id)}
                      >
                        再练一次
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {filteredMistakes.length >= 3 && (
          <View className={styles.practiceBar} onClick={() => handlePractice()}>
            <Text className={styles.practiceBarText}>
              还有 {filteredMistakes.length} 道错题等待攻克
            </Text>
            <Text className={styles.practiceBarBtn}>
              一键重练 →
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default MistakesPage;
