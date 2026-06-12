import React, { useMemo, useState } from 'react';
import { View, Text, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { termsData } from '@/data/terms';
import { scenesData } from '@/data/levels';
import SceneTag from '@/components/SceneTag';
import EmptyState from '@/components/EmptyState';
import { useStore } from '@/store/useStore';
import type { SceneType, DifficultyLevel } from '@/types';

const TermsPage: React.FC = () => {
  const { progress, toggleCollectTerm } = useStore();
  const [keyword, setKeyword] = useState('');
  const [activeScene, setActiveScene] = useState<SceneType | 'all' | 'collected'>('all');
  const [activeDifficulty, setActiveDifficulty] = useState<DifficultyLevel | 'all'>('all');

  const sceneFilters = [
    { id: 'all', name: '全部', icon: '📚', count: termsData.length },
    { id: 'collected', name: '我的收藏', icon: '⭐', count: progress.collectedTermIds.length },
    ...scenesData.map(s => ({
      id: s.id,
      name: s.name,
      icon: s.icon,
      count: termsData.filter(t => t.scenes.includes(s.id as SceneType)).length
    }))
  ];

  const filteredTerms = useMemo(() => {
    return termsData.filter(t => {
      if (keyword) {
        const kw = keyword.toLowerCase();
        if (!t.word.toLowerCase().includes(kw)
          && !t.meaning.toLowerCase().includes(kw)
          && !t.synonyms.some(s => s.toLowerCase().includes(kw))) {
          return false;
        }
      }
      if (activeScene === 'collected') {
        if (!progress.collectedTermIds.includes(t.id)) return false;
      } else if (activeScene !== 'all') {
        if (!t.scenes.includes(activeScene as SceneType)) return false;
      }
      if (activeDifficulty !== 'all') {
        if (t.difficulty !== activeDifficulty) return false;
      }
      return true;
    });
  }, [keyword, activeScene, activeDifficulty, progress.collectedTermIds]);

  const handleTermClick = (termId: string) => {
    Taro.navigateTo({
      url: `/pages/term-detail/index?termId=${termId}`
    });
  };

  const handleCollect = (e, termId) => {
    e.stopPropagation?.();
    toggleCollectTerm(termId);
    const isCollected = progress.collectedTermIds.includes(termId);
    Taro.showToast({
      title: isCollected ? '已取消收藏' : '已加入收藏',
      icon: 'none'
    });
  };

  return (
    <View className={styles.page}>
      <View className='pageContainer'>
        <View className={styles.searchBar}>
          <View className={styles.searchBox}>
            <Text className={styles.searchIcon}>🔍</Text>
            <Input
              className={styles.searchInput}
              placeholder='搜索黑话、释义、同义词'
              placeholderClass={styles.searchPlaceholder}
              value={keyword}
              onInput={(e) => setKeyword(e.detail.value)}
              confirmType='search'
            />
            {keyword && (
              <Text style={{ color: '#94A3B8', fontSize: 28 }} onClick={() => setKeyword('')}>✕</Text>
            )}
          </View>

          <View className={styles.tabsRow}>
            {sceneFilters.map(f => (
              <View
                key={f.id}
                className={classnames(
                  styles.tabItem,
                  activeScene === f.id && styles.tabItemActive
                )}
                onClick={() => setActiveScene(f.id as any)}
              >
                <Text>{f.icon}</Text>
                <Text>{f.name}</Text>
                <Text className={styles.tabCount}>({f.count})</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
          {(['all', 'easy', 'medium', 'hard'] as const).map(d => (
            <SceneTag
              key={d}
              size='small'
              customText={d === 'all' ? '全部难度' : d === 'easy' ? '初级' : d === 'medium' ? '中级' : '高级'}
              customColor={d === 'all' ? '#6366F1' : d === 'easy' ? '#10B981' : d === 'medium' ? '#F59E0B' : '#EF4444'}
              outline={activeDifficulty !== d}
              showIcon={false}
              onClick={() => setActiveDifficulty(d)}
            />
          ))}
        </View>

        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>
            <Text>📖</Text>
            词条列表
          </Text>
          <Text className={styles.sectionAction}>共 {filteredTerms.length} 条</Text>
        </View>

        {filteredTerms.length === 0 ? (
          <View className={styles.emptyWrap}>
            <EmptyState
              icon='🔍'
              title={activeScene === 'collected' ? '还没有收藏词条' : '没有找到相关词条'}
              description={activeScene === 'collected'
                ? '看到有价值的词条，点击⭐收藏吧'
                : '试试换个关键词或调整筛选条件'}
            />
          </View>
        ) : (
          <View className={styles.termList}>
            {filteredTerms.map(term => {
              const isCollected = progress.collectedTermIds.includes(term.id);
              const isMastered = progress.masteredTermIds.includes(term.id);
              return (
                <View
                  key={term.id}
                  className={styles.termCard}
                  onClick={() => handleTermClick(term.id)}
                >
                  <View className={styles.tcHeader}>
                    <View className={styles.tcInfo}>
                      <View style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                        <Text className={styles.tcWord}>{term.word}</Text>
                        {isMastered && (
                          <Text style={{
                            fontSize: 22,
                            color: '#10B981',
                            background: 'rgba(16,185,129,0.1)',
                            padding: '4rpx 16rpx',
                            borderRadius: 999
                          }}>已掌握 ✓</Text>
                        )}
                      </View>
                      <View className={styles.tcTags}>
                        {term.scenes.map(s => (
                          <SceneTag key={s} scene={s} size='small' />
                        ))}
                        <SceneTag difficulty={term.difficulty} size='small' showIcon={false} />
                      </View>
                    </View>
                    <View
                      className={classnames(
                        styles.tcCollect,
                        isCollected && styles.tcCollectActive
                      )}
                      style={{ background: isCollected ? 'rgba(245,158,11,0.15)' : 'rgba(148,163,184,0.1)' }}
                      onClick={(e) => handleCollect(e, term.id)}
                    >
                      <Text className={styles.tcCollectIcon}>
                        {isCollected ? '⭐' : '☆'}
                      </Text>
                    </View>
                  </View>

                  {term.synonyms.length > 0 && (
                    <View className={styles.synonymRow}>
                      <Text className={styles.synonymLabel}>同义词：</Text>
                      {term.synonyms.slice(0, 4).map(s => (
                        <View key={s} className={styles.synonymTag}>{s}</View>
                      ))}
                      {term.synonyms.length > 4 && (
                        <View className={styles.synonymTag}>+{term.synonyms.length - 4}</View>
                      )}
                    </View>
                  )}

                  <Text className={styles.tcMeaning}>{term.meaning}</Text>

                  <View className={styles.tcFooter}>
                    {term.examples.length > 0 && (
                      <Text className={styles.tcExample}>
                        「{term.examples[0].text}」
                      </Text>
                    )}
                    <Text className={styles.tcDetailBtn}>查看详情 →</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
};

export default TermsPage;
