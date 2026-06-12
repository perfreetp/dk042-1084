import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import styles from './index.module.scss';
import { useStore } from '@/store/useStore';
import { formatNumber } from '@/utils/progress';
import classnames from 'classnames';

type TabType = 'score' | 'streak' | 'accuracy';

const RankingPage: React.FC = () => {
  const { rankingList, progress, userSettings } = useStore();
  const [tab, setTab] = useState<TabType>('score');

  const sortedList = useMemo(() => {
    const list = [...rankingList];
    if (tab === 'score') {
      list.sort((a, b) => b.score - a.score);
    } else if (tab === 'streak') {
      list.sort((a, b) => b.streak - a.streak);
    } else {
      list.sort((a, b) => b.accuracy - a.accuracy);
    }
    return list.map((item, idx) => ({ ...item, rank: idx + 1 }));
  }, [rankingList, tab]);

  const topThree = sortedList.slice(0, 3);
  const remaining = sortedList.slice(3);

  const myRank = useMemo(() => {
    let myData;
    if (tab === 'score') {
      myData = { score: progress.totalScore, streak: progress.streak, accuracy: 0 };
    } else if (tab === 'streak') {
      myData = { score: progress.totalScore, streak: progress.streak, accuracy: 0 };
    } else {
      const total = progress.correctCount + progress.wrongCount;
      myData = {
        score: progress.totalScore,
        streak: progress.streak,
        accuracy: total > 0 ? Math.round((progress.correctCount / total) * 100) : 0
      };
    }

    const rank = [...rankingList, {
      rank: 999, userId: 'me', nickname: userSettings.nickname,
      score: myData.score, streak: myData.streak, accuracy: myData.accuracy
    }];

    if (tab === 'score') rank.sort((a, b) => b.score - a.score);
    else if (tab === 'streak') rank.sort((a, b) => b.streak - a.streak);
    else rank.sort((a, b) => b.accuracy - a.accuracy);

    const myIdx = rank.findIndex(r => r.userId === 'me');
    return {
      rank: myIdx + 1,
      score: myData.score,
      streak: myData.streak,
      accuracy: myData.accuracy
    };
  }, [progress, userSettings, rankingList, tab]);

  const getAvatarEmoji = (idx: number, nickname: string) => {
    const emojis = ['👨‍💼', '👩‍💼', '🧑‍💻', '👨‍🎓', '👩‍🎓', '🧑‍💼', '🦸‍♂️', '🦸‍♀️', '🥷', '🧙'];
    const base = nickname.charCodeAt(0) || idx;
    return emojis[base % emojis.length];
  };

  const renderPodium = (idx: number, item: typeof topThree[0]) => {
    const podiumClass = idx === 0 ? styles.podium1 : idx === 1 ? styles.podium2 : styles.podium3;
    const badgeClass = idx === 0 ? styles.rankBadge1 : idx === 1 ? styles.rankBadge2 : styles.rankBadge3;
    const badgeNum = idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉';

    return (
      <View key={item.userId} className={`${styles.podium} ${podiumClass}`}>
        <View className={`${styles.rankBadge} ${badgeClass}`}>
          {badgeNum}
        </View>
        <View className={`${styles.avatarBox} ${idx === 0 ? styles.avatarBox1 : ''}`}>
          {getAvatarEmoji(item.rank, item.nickname)}
        </View>
        <Text className={styles.nickname}>{item.nickname}</Text>
        <Text className={styles.scoreText}>
          {tab === 'score' ? formatNumber(item.score) : tab === 'streak' ? `${item.streak}天` : `${item.accuracy}%`}
        </Text>
        <Text className={styles.scoreLabel}>
          {tab === 'score' ? '积分' : tab === 'streak' ? '连续打卡' : '正确率'}
        </Text>
        <View className={styles.extraInfo}>
          <View className={styles.extraChip}>🔥 {item.streak}</View>
          <View className={styles.extraChip}>🎯 {item.accuracy}%</View>
        </View>
      </View>
    );
  };

  return (
    <View className={styles.page}>
      <ScrollView scrollY>
        <View className={styles.rankHeader}>
          <Text className={styles.rankHeaderTitle}>🏆 黑话达人榜</Text>
          <Text className={styles.rankHeaderSub}>和 {rankingList.length} 位职场人一起比拼</Text>
        </View>

        <View className={styles.tabRow}>
          {[
            { key: 'score' as TabType, label: '⚡ 积分榜' },
            { key: 'streak' as TabType, label: '🔥 打卡榜' },
            { key: 'accuracy' as TabType, label: '🎯 正确率' }
          ].map(t => (
            <View
              key={t.key}
              className={classnames(styles.tabChip, {
                [styles.tabChipActive]: tab === t.key
              })}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </View>
          ))}
        </View>

        <View className={styles.topThree}>
          {topThree[1] && renderPodium(1, topThree[1])}
          {topThree[0] && renderPodium(0, topThree[0])}
          {topThree[2] && renderPodium(2, topThree[2])}
        </View>

        <View className={styles.myRankCard}>
          <View className={styles.myRankRow}>
            <Text className={styles.myRankNum}>#{myRank.rank}</Text>
            <View className={styles.myAvatar}>
              {getAvatarEmoji(0, userSettings.nickname)}
            </View>
            <View className={styles.myInfo}>
              <Text className={styles.myName}>{userSettings.nickname}</Text>
              <View className={styles.myMeta}>
                <View className={styles.myMetaChip}>🔥 {myRank.streak}天</View>
                <View className={styles.myMetaChip}>🎯 {myRank.accuracy}%</View>
              </View>
            </View>
            <View className={styles.myScore}>
              <Text className={styles.myScoreValue}>
                {tab === 'score' ? formatNumber(myRank.score) : tab === 'streak' ? `${myRank.streak}天` : `${myRank.accuracy}%`}
              </Text>
              <Text className={styles.myScoreLabel}>
                {tab === 'score' ? '我的积分' : tab === 'streak' ? '连续打卡' : '正确率'}
              </Text>
            </View>
          </View>
        </View>

        <View className={styles.remainingList}>
          <View className={styles.listHeader}>
            <Text className={styles.listHeaderTitle}>
              <Text>📋</Text> 第 4 - {sortedList.length} 名
            </Text>
            <Text className={styles.listHeaderCount}>共 {remaining.length} 位</Text>
          </View>

          {remaining.map(item => (
            <View key={item.userId} className={styles.listItem}>
              <Text className={styles.listRank}>{item.rank}</Text>
              <View className={styles.listAvatar}>
                {getAvatarEmoji(item.rank, item.nickname)}
              </View>
              <View className={styles.listInfo}>
                <Text className={styles.listName}>{item.nickname}</Text>
                <View className={styles.listMeta}>
                  <View className={`${styles.listMetaChip} ${styles.chipStreak}`}>
                    🔥 {item.streak}
                  </View>
                  <View className={`${styles.listMetaChip} ${styles.chipAccuracy}`}>
                    🎯 {item.accuracy}%
                  </View>
                </View>
              </View>
              <View className={styles.listScore}>
                <Text className={styles.listScoreValue}>
                  {tab === 'score' ? formatNumber(item.score) : tab === 'streak' ? `${item.streak}天` : `${item.accuracy}%`}
                </Text>
                <Text className={styles.listScoreLabel}>
                  {tab === 'score' ? '积分' : tab === 'streak' ? '打卡' : '正确率'}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View className={styles.paddingBottom} />
      </ScrollView>
    </View>
  );
};

export default RankingPage;
