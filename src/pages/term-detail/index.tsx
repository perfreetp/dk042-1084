import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, Textarea } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import { termsData } from '@/data/terms';
import { questionsData } from '@/data/questions';
import { useStore } from '@/store/useStore';
import { getSceneColor } from '@/utils/progress';
import SceneTag from '@/components/SceneTag';
import classnames from 'classnames';
import type { SceneType } from '@/types';

const TermDetailPage: React.FC = () => {
  const router = useRouter();
  const { termId } = router.params;
  const { progress, toggleCollectTerm, addUserExample } = useStore();

  const [showInput, setShowInput] = useState(false);
  const [exampleText, setExampleText] = useState('');

  const term = useMemo(() => {
    return termsData.find(t => t.id === termId);
  }, [termId]);

  const relatedQuestions = useMemo(() => {
    if (!term) return [];
    return questionsData.filter(q => q.relatedTermId === term.id).slice(0, 3);
  }, [term]);

  const isCollected = progress.collectedTermIds.includes(termId || '');
  const isMastered = progress.masteredTermIds.includes(termId || '');
  const sceneColor = term && term.scenes[0] ? getSceneColor(term.scenes[0] as SceneType) : '#6366F1';

  const allExamples = useMemo(() => {
    if (!term) return [];
    const userExamples = progress.userExamples.map(ue => ({
      ...ue,
      isUser: true
    }));
    return [...term.examples, ...userExamples];
  }, [term, progress.userExamples]);

  const handleCollect = () => {
    if (!term) return;
    toggleCollectTerm(term.id);
    Taro.showToast({
      title: isCollected ? '已取消收藏' : '已加入收藏 ⭐',
      icon: 'none'
    });
  };

  const handleSubmitExample = () => {
    if (!exampleText.trim()) {
      Taro.showToast({ title: '请输入例句内容', icon: 'none' });
      return;
    }
    if (!term) return;
    addUserExample(term.id, exampleText.trim());
    Taro.showToast({ title: '感谢分享，已收录！', icon: 'success' });
    setExampleText('');
    setShowInput(false);
  };

  const goQuiz = (qid: string) => {
    Taro.navigateTo({
      url: `/pages/quiz/index?source=single&questionId=${qid}`
    });
  };

  if (!term) {
    return (
      <View className={styles.page}>
        <View className='pageContainer' style={{ padding: 64, textAlign: 'center' }}>
          <Text>词条不存在</Text>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.page}>
      <ScrollView scrollY>
        <View className={styles.termHeader} style={{ background: `linear-gradient(135deg, ${sceneColor} 0%, #8B5CF6 100%)` }}>
          <View className={styles.termTitleRow}>
            <View className={styles.termMainInfo}>
              <Text className={styles.termWord}>{term.word}</Text>
              {term.pinyin && (
                <Text className={styles.termPinyin}>{term.pinyin}</Text>
              )}
              {isMastered && (
                <View className={styles.masteredBadge}>
                  <Text>✅</Text>
                  <Text>已掌握</Text>
                </View>
              )}
            </View>
            <View
              className={classnames(styles.collectBtn, {
                [styles.collectBtnCollected]: isCollected
              })}
              onClick={handleCollect}
            >
              <Text className={styles.collectIcon}>
                {isCollected ? '⭐' : '☆'}
              </Text>
            </View>
          </View>

          <View className={styles.tagRow}>
            {term.scenes.map(s => (
              <SceneTag key={s} scene={s} size='medium' />
            ))}
            <SceneTag difficulty={term.difficulty} size='medium' showIcon />
          </View>

          <View className={styles.quickStats}>
            <View className={styles.quickStatItem}>
              <Text className={styles.quickStatValue}>{term.synonyms.length}</Text>
              <Text className={styles.quickStatLabel}>同义词</Text>
            </View>
            <View className={styles.quickStatItem}>
              <Text className={styles.quickStatValue}>{term.examples.length + progress.userExamples.length}</Text>
              <Text className={styles.quickStatLabel}>例句</Text>
            </View>
            <View className={styles.quickStatItem}>
              <Text className={styles.quickStatValue}>{relatedQuestions.length}</Text>
              <Text className={styles.quickStatLabel}>关联题</Text>
            </View>
          </View>
        </View>

        <View className={styles.contentArea}>
          <View className={styles.card}>
            <View className={styles.cardHeader}>
              <View className={styles.cardIcon} style={{ background: '#EEF2FF' }}>📖</View>
              <Text className={styles.cardTitle}>基本释义</Text>
            </View>
            <Text className={styles.meaningText}>{term.meaning}</Text>
          </View>

          <View className={styles.card}>
            <View className={styles.cardHeader}>
              <View className={styles.cardIcon} style={{ background: '#ECFDF5' }}>🔍</View>
              <Text className={styles.cardTitle}>深层含义</Text>
            </View>
            <View className={styles.deepMeaningBox}>
              <Text className={styles.deepMeaningLabel}>
                <Text>💡</Text> 潜台词解读
              </Text>
              <Text className={styles.deepMeaningText}>{term.deepMeaning}</Text>
            </View>
          </View>

          {term.synonyms.length > 0 && (
            <View className={styles.card}>
              <View className={styles.cardHeader}>
                <View className={styles.cardIcon} style={{ background: '#FEF3C7' }}>🔄</View>
                <Text className={styles.cardTitle}>同义黑话</Text>
              </View>
              <View className={styles.synonymsList}>
                {term.synonyms.map((syn, idx) => (
                  <View key={idx} className={styles.synonymChip}>
                    {syn}
                  </View>
                ))}
              </View>
            </View>
          )}

          <View className={styles.card}>
            <View className={styles.cardHeader}>
              <View className={styles.cardIcon} style={{ background: '#FCE7F3' }}>💬</View>
              <Text className={styles.cardTitle}>职场例句</Text>
            </View>
            <View className={styles.examplesList}>
              {allExamples.map((ex, idx) => (
                <View key={ex.id || idx} className={styles.exampleItem}>
                  <Text className={styles.exampleQuote}>"</Text>
                  <Text className={styles.exampleText}>{ex.text}</Text>
                  <View className={styles.exampleMeta}>
                    <Text className={styles.exampleAuthor}>
                      {(ex as any).isUser ? `👤 ${ex.author || '用户贡献'}` : ex.author ? `💼 ${ex.author}` : '📝 职场实战'}
                    </Text>
                    <View className={styles.exampleLikes}>
                      <Text>👍</Text>
                      <Text>{ex.likes}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            <View className={styles.addExampleBox}>
              {!showInput ? (
                <View className={styles.addExampleBtn} onClick={() => setShowInput(true)}>
                  <Text>✏️</Text>
                  <Text>补充一句你见过的例句</Text>
                </View>
              ) : (
                <>
                  <Textarea
                    className={styles.exampleInput}
                    placeholder='输入你在职场中听到的使用这个词的真实句子...'
                    value={exampleText}
                    onInput={(e) => setExampleText(e.detail.value)}
                    maxlength={200}
                  />
                  <View className={styles.actionBar}>
                    <View
                      className={`${styles.actionBtn} ${styles.actionBtnCancel}`}
                      onClick={() => { setShowInput(false); setExampleText(''); }}
                    >
                      取消
                    </View>
                    <View
                      className={`${styles.actionBtn} ${styles.actionBtnSubmit}`}
                      onClick={handleSubmitExample}
                    >
                      提交分享
                    </View>
                  </View>
                </>
              )}
            </View>
          </View>

          {term.usageNote && (
            <View className={styles.card}>
              <View className={styles.cardHeader}>
                <View className={styles.cardIcon} style={{ background: '#FEF3C7' }}>⚠️</View>
                <Text className={styles.cardTitle}>使用提示</Text>
              </View>
              <View className={styles.usageNote}>
                <Text className={styles.usageNoteLabel}>
                  <Text>📌</Text> 职场老鸟经验
                </Text>
                <Text className={styles.usageNoteText}>{term.usageNote}</Text>
              </View>
            </View>
          )}

          {relatedQuestions.length > 0 && (
            <View className={styles.card}>
              <View className={styles.cardHeader}>
                <View className={styles.cardIcon} style={{ background: '#E0F2FE' }}>🎯</View>
                <Text className={styles.cardTitle}>实战练习</Text>
              </View>
              <View className={styles.relatedQuestions}>
                {relatedQuestions.map(q => (
                  <View key={q.id} className={styles.relatedQItem} onClick={() => goQuiz(q.id)}>
                    <Text className={styles.relatedQText}>{q.title}</Text>
                    <View className={styles.relatedQMeta}>
                      <SceneTag questionType={q.type} size='small' />
                      <View style={{
                        background: 'linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%)',
                        borderRadius: 16,
                        padding: '2rpx 14rpx',
                        fontSize: 20,
                        fontWeight: 600,
                        color: '#fff',
                        lineHeight: 1.8
                      }}>
                        +{q.points}分
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        <View className={styles.paddingBottom} />
      </ScrollView>
    </View>
  );
};

export default TermDetailPage;
