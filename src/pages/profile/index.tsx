import React, { useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { useStore } from '@/store/useStore';
import { scenesData } from '@/data/levels';
import ProgressBar from '@/components/ProgressBar';
import { getSceneColor } from '@/utils/progress';
import dayjs from 'dayjs';

const ProfilePage: React.FC = () => {
  const { progress, achievements, rankingList, userSettings, updateRemindSettings, dailyStudy, getTodayStudy } = useStore();

  const totalQuestions = progress.correctCount + progress.wrongCount;
  const accuracy = totalQuestions > 0
    ? Math.round((progress.correctCount / totalQuestions) * 100)
    : 0;
  const sceneProgress = useMemo(() => {
    return scenesData.map(s => {
      const sp = progress.sceneProgress[s.id];
      const rate = sp.total > 0 ? Math.round((sp.correct / sp.total) * 100) : 0;
      return {
        ...s,
        correct: sp.correct,
        total: sp.total,
        rate
      };
    });
  }, [progress.sceneProgress]);

  const achievedCount = achievements.filter(a => a.progress >= a.target).length;

  const getTitle = () => {
    if (progress.totalScore >= 1000) return '🏆 黑话宗师';
    if (progress.totalScore >= 500) return '🎯 高级玩家';
    if (progress.totalScore >= 200) return '📖 熟练学徒';
    if (progress.totalScore >= 50) return '🌱 入门新人';
    return '🎓 新手上路';
  };

  const myRank = useMemo(() => {
    const myScore = progress.totalScore;
    let rank = 1;
    rankingList.forEach(r => {
      if (r.score > myScore) rank++;
    });
    return rank;
  }, [rankingList, progress.totalScore]);

  const navigateTo = (url) => {
    Taro.navigateTo({ url });
  };

  return (
    <View className={styles.page}>
      <View className='pageContainer'>
        <View className={styles.headerSection}>
          <View className={styles.userRow}>
            <View className={styles.avatarBox}>
              <Text className={styles.avatarText}>
                {userSettings.nickname.charAt(0)}
              </Text>
            </View>
            <View className={styles.userInfo}>
              <Text className={styles.userName}>{userSettings.nickname}</Text>
              <View className={styles.userTitle}>
                {getTitle()} · 连续{progress.streak}天🔥
              </View>
            </View>
          </View>
        </View>

        <View className={styles.statsCard}>
          <View className={styles.statsGrid}>
            <View className={styles.statsItem}>
              <Text className={styles.statsValue} style={{ color: '#6366F1' }}>
                {progress.totalScore}
              </Text>
              <Text className={styles.statsLabel}>总积分</Text>
            </View>
            <View className={styles.statsItem}>
              <Text className={styles.statsValue} style={{ color: '#10B981' }}>
                {progress.correctCount}
              </Text>
              <Text className={styles.statsLabel}>答对数</Text>
            </View>
            <View className={styles.statsItem}>
              <Text className={styles.statsValue} style={{ color: '#F59E0B' }}>
                {accuracy}%
              </Text>
              <Text className={styles.statsLabel}>正确率</Text>
            </View>
            <View className={styles.statsItem}>
              <Text className={styles.statsValue} style={{ color: '#8B5CF6' }}>
                {progress.completedLevelIds.length}
              </Text>
              <Text className={styles.statsLabel}>通关数</Text>
            </View>
          </View>
        </View>

        <View
          className={styles.rankTeaser}
          onClick={() => navigateTo('/pages/ranking/index')}
        >
          <Text className={styles.rankTeaserIcon}>🏆</Text>
          <View className={styles.rankTeaserInfo}>
            <Text className={styles.rankTeaserTitle}>排行榜</Text>
            <Text className={styles.rankTeaserDesc}>
              当前排名第 {myRank} 名，继续加油冲榜！
            </Text>
          </View>
          <Text className={styles.rankTeaserBtn}>去看看 →</Text>
        </View>

        <View
          className={styles.todayReviewCard}
          onClick={() => navigateTo('/pages/today-review/index')}
        >
          <View className={styles.todayReviewLeft}>
            <Text className={styles.todayReviewIcon}>📅</Text>
            <View>
              <Text className={styles.todayReviewTitle}>今日学习复盘</Text>
              <Text className={styles.todayReviewDesc}>
                {dailyStudy.levels.length > 0
                  ? `已挑战 ${dailyStudy.levels.length} 关 · 重练错题 ${dailyStudy.mistakePractices.reduce((s, m) => s + m.totalCount, 0)} 道 · 贡献例句 ${dailyStudy.examples.length} 条`
                  : '今天还没有学习记录哦'}
              </Text>
            </View>
          </View>
          <Text className={styles.todayReviewBtn}>查看 →</Text>
        </View>

        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>
            <Text>🎖️</Text>
            成就徽章
          </Text>
          <Text
            className={styles.sectionAction}
            onClick={() => navigateTo('/pages/achievement/index')}
          >
            全部{achievedCount}/{achievements.length} →
          </Text>
        </View>

        <View className={styles.achievementRow}>
          {achievements.slice(0, 8).map(a => {
            const achieved = a.progress >= a.target;
            return (
              <View
                key={a.id}
                className={classnames(
                  styles.achievementItem,
                  !achieved && styles.achievementItemLocked
                )}
                onClick={() => navigateTo('/pages/achievement/index')}
              >
                <Text className={styles.achievementIcon}>{achieved ? a.icon : '🔒'}</Text>
                <Text className={styles.achievementName}>{a.name}</Text>
                <Text className={styles.achievementProgress}>
                  {a.progress}/{a.target}
                </Text>
              </View>
            );
          })}
        </View>

        <View className={styles.sectionTitle}>
          <Text>📊</Text>
          场景能力分析
        </View>
        <View className={styles.progressCard}>
          {sceneProgress.map(s => (
            <View key={s.id} className={styles.sceneProgressRow}>
              <View
                className={styles.sceneIconBox}
                style={{ backgroundColor: `${s.color}1A` }}
              >
                <Text className={styles.sceneIcon}>{s.icon}</Text>
              </View>
              <View className={styles.sceneInfo}>
                <View className={styles.sceneTop}>
                  <Text className={styles.sceneName}>{s.name}</Text>
                  <Text
                    className={styles.sceneRate}
                    style={{ color: getSceneColor(s.id) }}
                  >
                    {s.total > 0 ? `${s.rate}%` : '未开始'}
                  </Text>
                </View>
                <ProgressBar
                  percent={s.rate}
                  height={10}
                  color={`linear-gradient(90deg, ${s.color} 0%, ${s.color}99 100%)`}
                />
              </View>
            </View>
          ))}
        </View>

        <View className={styles.sectionTitle}>
          <Text>⚙️</Text>
          学习工具
        </View>
        <View className={styles.menuList}>
          <View
            className={styles.menuItem}
            onClick={() => navigateTo('/pages/ranking/index')}
          >
            <View className={styles.menuIcon} style={{ background: 'rgba(245,158,11,0.12)' }}>
              <Text className={styles.menuIconText}>🏆</Text>
            </View>
            <View className={styles.menuInfo}>
              <Text className={styles.menuLabel}>排行榜</Text>
              <Text className={styles.menuDesc}>查看学习积分排名</Text>
            </View>
            <Text className={styles.menuExtra}>第{myRank}名</Text>
            <Text className={styles.menuArrow}>›</Text>
          </View>

          <View
            className={styles.menuItem}
            onClick={() => Taro.switchTab({ url: '/pages/mistakes/index' })}
          >
            <View className={styles.menuIcon} style={{ background: 'rgba(239,68,68,0.12)' }}>
              <Text className={styles.menuIconText}>📝</Text>
            </View>
            <View className={styles.menuInfo}>
              <Text className={styles.menuLabel}>错题本</Text>
              <Text className={styles.menuDesc}>错题收集与重练</Text>
            </View>
            <Text className={styles.menuExtra}>
              {progress.wrongCount > 0 ? `${progress.wrongCount}道待复习` : '暂无错题'}
            </Text>
            <Text className={styles.menuArrow}>›</Text>
          </View>

          <View
            className={styles.menuItem}
            onClick={() => Taro.showToast({ title: '收藏词条在词条广场哦', icon: 'none' })}
          >
            <View className={styles.menuIcon} style={{ background: 'rgba(16,185,129,0.12)' }}>
              <Text className={styles.menuIconText}>⭐</Text>
            </View>
            <View className={styles.menuInfo}>
              <Text className={styles.menuLabel}>我的收藏</Text>
              <Text className={styles.menuDesc}>收藏的重点词条</Text>
            </View>
            <Text className={styles.menuExtra}>
              {progress.collectedTermIds.length}条
            </Text>
            <Text className={styles.menuArrow}>›</Text>
          </View>

          <View
            className={styles.menuItem}
            onClick={() => navigateTo('/pages/achievement/index')}
          >
            <View className={styles.menuIcon} style={{ background: 'rgba(139,92,246,0.12)' }}>
              <Text className={styles.menuIconText}>🎖️</Text>
            </View>
            <View className={styles.menuInfo}>
              <Text className={styles.menuLabel}>成就中心</Text>
              <Text className={styles.menuDesc}>查看全部成就与解锁进度</Text>
            </View>
            <Text className={styles.menuExtra}>
              {achievedCount}个已解锁
            </Text>
            <Text className={styles.menuArrow}>›</Text>
          </View>

          <View
            className={styles.menuItem}
            onClick={() => navigateTo('/pages/user-examples/index')}
          >
            <View className={styles.menuIcon} style={{ background: 'rgba(236,72,153,0.12)' }}>
              <Text className={styles.menuIconText}>✏️</Text>
            </View>
            <View className={styles.menuInfo}>
              <Text className={styles.menuLabel}>我的例句贡献</Text>
              <Text className={styles.menuDesc}>查看和管理你补充的职场黑话例句</Text>
            </View>
            <Text className={styles.menuExtra}>
              {progress.userExamples.length}条
            </Text>
            <Text className={styles.menuArrow}>›</Text>
          </View>

          <View
            className={styles.menuItem}
            onClick={() => {
              const showTimePicker = (afterEnable = false) => {
                Taro.showActionSheet({
                  itemList: ['20:00（推荐晚间复习）', '09:00（早晨开工前）', '12:30（午休充电）', '18:00（下班路上）', '取消'],
                  success: (res) => {
                    const times = ['20:00', '09:00', '12:30', '18:00'];
                    if (res.tapIndex >= 0 && res.tapIndex < times.length) {
                      updateRemindSettings(true, times[res.tapIndex]);
                      Taro.showToast({
                        title: afterEnable
                          ? `已开启 ${times[res.tapIndex]} 提醒`
                          : `已改为 ${times[res.tapIndex]} 提醒`,
                        icon: 'success'
                      });
                    }
                  }
                });
              };

              Taro.showActionSheet({
                itemList: userSettings.remindEnabled
                  ? ['关闭提醒', '换成 20:00 提醒', '换成 09:00 提醒', '换成 12:30 提醒', '换成 18:00 提醒', '取消']
                  : ['开启提醒（20:00）', '开启提醒（09:00）', '开启提醒（12:30）', '开启提醒（18:00）', '取消'],
                success: (res) => {
                  if (userSettings.remindEnabled) {
                    if (res.tapIndex === 0) {
                      updateRemindSettings(false);
                      Taro.showToast({ title: '已关闭学习提醒', icon: 'success' });
                    } else {
                      const times = ['', '20:00', '09:00', '12:30', '18:00'];
                      if (res.tapIndex >= 1 && res.tapIndex <= 4) {
                        updateRemindSettings(true, times[res.tapIndex]);
                        Taro.showToast({ title: `已改为 ${times[res.tapIndex]} 提醒`, icon: 'success' });
                      }
                    }
                  } else {
                    const times = ['20:00', '09:00', '12:30', '18:00'];
                    if (res.tapIndex >= 0 && res.tapIndex < times.length) {
                      updateRemindSettings(true, times[res.tapIndex]);
                      Taro.showToast({ title: `已开启 ${times[res.tapIndex]} 提醒`, icon: 'success' });
                    }
                  }
                }
              });
            }}
          >
            <View className={styles.menuIcon} style={{ background: 'rgba(6,182,212,0.12)' }}>
              <Text className={styles.menuIconText}>🔔</Text>
            </View>
            <View className={styles.menuInfo}>
              <Text className={styles.menuLabel}>学习提醒</Text>
              <Text className={styles.menuDesc}>每日定时提醒学习打卡</Text>
            </View>
            <Text className={styles.menuExtra}>
              {userSettings.remindEnabled ? `${userSettings.remindTime} · 已开` : '已关闭'}
            </Text>
            <Text className={styles.menuArrow}>›</Text>
          </View>
        </View>

        <View style={{
          textAlign: 'center',
          padding: '32rpx 0',
          fontSize: 22,
          color: '#94A3B8'
        }}>
          黑话闯关 v1.0.0 · 让职场沟通不再有障碍
        </View>
      </View>
    </View>
  );
};

export default ProfilePage;
