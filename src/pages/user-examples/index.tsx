import React, { useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useStore } from '@/store/useStore';
import { termsData } from '@/data/terms';
import { getSceneColor } from '@/utils/progress';
import dayjs from 'dayjs';
import type { SceneType } from '@/types';
import EmptyState from '@/components/EmptyState';

const UserExamplesPage: React.FC = () => {
  const { progress, removeUserExample } = useStore();

  const examplesWithTerms = useMemo(() => {
    return progress.userExamples.map(ex => {
      const term = ex.termId ? termsData.find(t => t.id === ex.termId) : undefined;
      return { ex, term };
    }).sort((a, b) => b.ex.createdAt - a.ex.createdAt);
  }, [progress.userExamples]);

  const totalContributions = progress.userExamples.length;

  const handleDelete = (exampleId: string, text: string) => {
    Taro.showModal({
      title: '删除例句',
      content: `确定删除「${text.slice(0, 20)}...」吗？`,
      confirmColor: '#EF4444',
      success: (res) => {
        if (res.confirm) {
          removeUserExample(exampleId);
          Taro.showToast({ title: '已删除', icon: 'success' });
        }
      }
    });
  };

  const handleGoTerm = (termId?: string) => {
    if (!termId) return;
    Taro.navigateTo({ url: `/pages/term-detail/index?id=${termId}` });
  };

  return (
    <View className={styles.page}>
      <View className='pageContainer'>
        <View className={styles.headerCard}>
          <Text className={styles.headerIcon}>✏️</Text>
          <Text className={styles.headerTitle}>我的例句贡献</Text>
          <Text className={styles.headerSub}>
            共贡献了 <Text className={styles.headerNum}>{totalContributions}</Text> 条真实职场例句
          </Text>
        </View>

        {examplesWithTerms.length === 0 ? (
          <View className={styles.emptyWrap}>
            <EmptyState
              icon='💬'
              title='还没有贡献过例句'
              description='在词条详情页可以补充你见过的真实职场黑话例句'
              actionText='去词条广场看看'
              onAction={() => Taro.switchTab({ url: '/pages/terms/index' })}
            />
          </View>
        ) : (
          <ScrollView scrollY className={styles.listArea}>
            {examplesWithTerms.map(({ ex, term }) => {
              const sceneColor = term && term.scenes[0] ? getSceneColor(term.scenes[0] as SceneType) : '#6366F1';
              return (
                <View key={ex.id} className={styles.exampleCard}>
                  <View className={styles.cardHeader}>
                    {term ? (
                      <View className={styles.termLink} onClick={() => handleGoTerm(term.id)}>
                        <Text className={styles.termWord} style={{ color: sceneColor }}>
                          {term.word}
                        </Text>
                        <Text className={styles.termArrow}>→</Text>
                      </View>
                    ) : (
                      <Text className={styles.termWord}>未知词条</Text>
                    )}
                    <Text className={styles.createTime}>
                      {dayjs(ex.createdAt).format('YYYY-MM-DD')}
                    </Text>
                  </View>
                  <Text className={styles.exampleText}>"{ex.text}"</Text>
                  <View className={styles.cardFooter}>
                    <View className={styles.authorInfo}>
                      <Text>👤</Text>
                      <Text>{ex.author || '用户贡献'}</Text>
                      <Text className={styles.likesCount}>👍 {ex.likes}</Text>
                    </View>
                    <Text className={styles.deleteBtn} onClick={() => handleDelete(ex.id, ex.text)}>
                      🗑 删除
                    </Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

export default UserExamplesPage;
