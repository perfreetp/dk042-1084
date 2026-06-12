import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import styles from './index.module.scss';
import { useStore } from '@/store/useStore';
import ProgressBar from '@/components/ProgressBar';
import classnames from 'classnames';
import dayjs from 'dayjs';

type FilterType = 'all' | 'achieved' | 'locked';

const AchievementPage: React.FC = () => {
  const { achievements, progress } = useStore();
  const [filter, setFilter] = useState<FilterType>('all');

  const achievedCount = useMemo(
    () => achievements.filter(a => a.progress >= a.target).length,
    [achievements]
  );
  const totalCount = achievements.length;
  const achievementPercent = totalCount > 0
    ? Math.round((achievedCount / totalCount) * 100)
    : 0;

  const filteredAchievements = useMemo(() => {
    if (filter === 'all') return achievements;
    if (filter === 'achieved')
      return achievements.filter(a => a.progress >= a.target);
    return achievements.filter(a => a.progress < a.target);
  }, [achievements, filter]);

  const totalPoints = achievements
    .filter(a => a.progress >= a.target)
    .reduce(() => 0, 0);

  const filterOptions: { value: FilterType; label: string; count: number }[] = [
    { value: 'all', label: '全部', count: totalCount },
    { value: 'achieved', label: '已解锁', count: achievedCount },
    { value: 'locked', label: '未解锁', count: totalCount - achievedCount }
  ];

  const formatDate = (ts?: number) => {
    if (!ts) return '';
    return dayjs(ts).format('YYYY.MM.DD');
  };

  const getProgressColor = (percent: number) => {
    if (percent >= 100) return 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)';
    if (percent >= 60) return 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)';
    if (percent >= 30) return '#94A3B8';
    return '#CBD5E1';
  };

  return (
    <View className={styles.page}>
      <ScrollView scrollY>
        <View className={styles.achHeader}>
          <Text className={styles.achTitle}>🏆 成就中心</Text>
          <Text className={styles.achSubtitle}>每一次努力都值得被记录</Text>

          <View className={styles.achProgressBar}>
            <ProgressBar
              percent={achievementPercent}
              color='linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%)'
              height='20rpx'
            />
          </View>

          <View className={styles.achProgressInfo}>
            <Text>进度 {achievedCount}/{totalCount}</Text>
            <Text>{achievementPercent}%</Text>
          </View>
        </View>

        <View className={styles.statsCard}>
          <View className={styles.statBox}>
            <Text className={`${styles.statNum} ${styles.statNumGold}`}>
              {achievedCount}
            </Text>
            <Text className={styles.statLabel}>已解锁成就</Text>
          </View>
          <View className={styles.statBox}>
            <Text className={`${styles.statNum} ${styles.statNumGray}`}>
              {totalCount - achievedCount}
            </Text>
            <Text className={styles.statLabel}>待解锁</Text>
          </View>
          <View className={styles.statBox}>
            <Text className={`${styles.statNum} ${styles.statNumColor}`}>
              {achievementPercent}%
            </Text>
            <Text className={styles.statLabel}>完成度</Text>
          </View>
        </View>

        <ScrollView scrollX className={styles.tabsRow}>
          {filterOptions.map(opt => (
            <View
              key={opt.value}
              className={classnames(styles.tabChip, {
                [styles.tabChipActive]: filter === opt.value
              })}
              onClick={() => setFilter(opt.value)}
            >
              {opt.label}（{opt.count}）
            </View>
          ))}
        </ScrollView>

        <View className={styles.achList}>
          {filteredAchievements.length === 0 ? (
            <View className={styles.emptyBox}>
              <View className={styles.emptyIcon}>🎖️</View>
              <Text className={styles.emptyText}>
                {filter === 'achieved'
                  ? '暂无已解锁成就\n快去刷题解锁吧！'
                  : '恭喜你解锁了全部成就！'}
              </Text>
            </View>
          ) : (
            filteredAchievements.map(ach => {
              const percent = Math.min(100, Math.round((ach.progress / ach.target) * 100));
              const achieved = ach.progress >= ach.target;

              return (
                <View
                  key={ach.id}
                  className={classnames(styles.achCard, {
                    [styles.achCardAchieved]: achieved
                  })}
                >
                  {achieved && (
                    <View className={styles.achRibbon}>
                      <Text>✅</Text>
                      <Text>已达成</Text>
                    </View>
                  )}
                  <View
                    className={classnames(styles.achIconBox, {
                      [styles.achIconBoxAchieved]: achieved
                    })}
                    style={{ opacity: achieved ? 1 : 0.7 }}
                  >
                    <Text style={{ filter: achieved ? 'none' : 'grayscale(60%)' }}>
                      {ach.icon}
                    </Text>
                  </View>
                  <View className={styles.achInfo}>
                    <View className={styles.achName}>
                      <Text>{ach.name}</Text>
                    </View>
                    <Text className={styles.achDesc}>{ach.description}</Text>
                    <View className={styles.achMeta}>
                      <Text className={styles.achCondition}>
                        条件：{ach.condition}
                      </Text>
                    </View>
                    {achieved ? (
                      <>
                        <View style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 16 }}>
                          <View style={{ flex: 1 }}>
                            <ProgressBar
                              percent={100}
                              color='linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%)'
                              height='12rpx'
                            />
                          </View>
                          <Text
                            className={`${styles.achProgressText} ${styles.achProgressTextGold}`}
                          >
                            已完成
                          </Text>
                        </View>
                        {ach.achievedAt && (
                          <Text className={styles.achDate}>
                            <Text>📅</Text>
                            <Text>解锁于 {formatDate(ach.achievedAt)}</Text>
                          </Text>
                        )}
                      </>
                    ) : (
                      <View style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 16 }}>
                        <View style={{ flex: 1 }}>
                          <ProgressBar
                            percent={percent}
                            color={getProgressColor(percent)}
                            height='12rpx'
                          />
                        </View>
                        <Text className={styles.achProgressText}>
                          {ach.progress}/{ach.target}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              );
            })
          )}
        </View>

        <View className={styles.paddingBottom} />
      </ScrollView>
    </View>
  );
};

export default AchievementPage;
