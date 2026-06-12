import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { questionsData } from '@/data/questions';
import { scenesData } from '@/data/levels';
import SceneTag from '@/components/SceneTag';
import EmptyState from '@/components/EmptyState';
import { getSceneColor, getDifficultyColor, getDifficultyName, getQuestionTypeName } from '@/utils/progress';
import type { SceneType, DifficultyLevel, QuestionType } from '@/types';
import { useStore } from '@/store/useStore';
const ScenarioPage: React.FC = () => {
 const { progress, updateStreak } = useStore();
 const [activeScene, setActiveScene] = useState<SceneType | 'all'>('all');
 const [activeType, setActiveType] = useState<QuestionType | 'all'>('all');
 const [activeDifficulty, setActiveDifficulty] = useState<DifficultyLevel | 'all'>('all');
 const [timerEnabled, setTimerEnabled] = useState(true);
 const sceneFilters = [
 { id: 'all', name: '全部', icon: '🌟' },
 ...scenesData.map(s => ({ id: s.id, name: s.name, icon: s.icon }))
 ];
 const typeFilters: {
 id: QuestionType | 'all';
 name: string;
 icon: string;
 }[] = [
 { id: 'all', name: '全部题型', icon: '🎲' },
 { id: 'meaning', name: '黑话释义', icon: '📖' },
 { id: 'intent', name: '真实诉求', icon: '🤔' },
 { id: 'rewrite', name: '表达改写', icon: '✍️' }
 ];
 const filteredQuestions = useMemo(() => {
 return questionsData.filter(q => {
 if (activeScene !== 'all' && q.scene !== activeScene)
 return false;
 if (activeType !== 'all' && q.type !== activeType)
 return false;
 if (activeDifficulty !== 'all' && q.difficulty !== activeDifficulty)
 return false;
 return true;
 });
 }, [activeScene, activeType, activeDifficulty]);
 const handleStartQuiz = (questionId: string) => {
 updateStreak();
 Taro.navigateTo({
 url: `/pages/quiz/index?source=scenario&questionId=${questionId}&timer=${timerEnabled}`
 });
 };
 const handleRandomStart = () => {
 if (filteredQuestions.length === 0)
 return;
 const randomIdx = Math.floor(Math.random() * filteredQuestions.length);
 const q = filteredQuestions[randomIdx];
 handleStartQuiz(q.id);
 };
 const getDifficultyStats = (diff: DifficultyLevel) => {
 const list = questionsData.filter(q => q.difficulty === diff);
 const correct = list.filter(q => progress.sceneProgress[q.scene].correct > 0).length;
 return { total: list.length, correct };
 };
 return (<View className={styles.page}>
 <View className='pageContainer'>
 <View className={styles.filterBar}>
 <ScrollView scrollX className={styles.scrollWrap} enhanced showScrollbar={false}>
 {sceneFilters.map(f => (<View key={f.id} className={classnames(styles.filterChip, activeScene === f.id && styles.filterChipActive)} onClick={() => setActiveScene(f.id as any)}>
 <Text>{f.icon}</Text>
 <Text className={classnames(styles.filterChipText, activeScene === f.id && styles.filterChipActiveText)}>
 {f.name}
 </Text>
 </View>))}
 </ScrollView>
 </View>

 <View className={styles.typeFilters}>
 {typeFilters.map(f => (<View key={f.id} className={classnames(styles.typeChip, activeType === f.id && styles.typeChipActive)} onClick={() => setActiveType(f.id)}>
 <Text>{f.icon}</Text>
 <Text className={classnames(styles.typeChipText, activeType === f.id && styles.typeChipActiveText)}>
 {f.name}
 </Text>
 </View>))}
 </View>

 <Text className={styles.sectionTitle}>
 <Text>⚡</Text>
 难度选择
 </Text>
 <View className={styles.difficultyRow}>
 {(['all', 'easy', 'medium', 'hard'] as const).map((d, idx) => {
 const diffName = d === 'all' ? '全部' : getDifficultyName(d);
 const diffIcon = d === 'all' ? '🎯' : d === 'easy' ? '🌱' : d === 'medium' ? '🔥' : '⚡';
 const stats = d !== 'all' ? getDifficultyStats(d) : { total: questionsData.length, correct: progress.correctCount };
 const color = d === 'all' ? '#6366F1' : getDifficultyColor(d);
 return (<View key={d} className={classnames(styles.difficultyItem, activeDifficulty === d && styles.difficultyItemActive)} style={activeDifficulty === d ? { borderTop: `4rpx solid ${color}` } : {}} onClick={() => setActiveDifficulty(d)}>
 <Text className={styles.difficultyIcon}>{diffIcon}</Text>
 <Text className={styles.difficultyName} style={{ color }}>{diffName}</Text>
 <Text className={styles.difficultyCount}>{stats.correct > 0 ? `${stats.correct}/` : ''}{stats.total}题</Text>
 </View>);
 })}
 </View>

 <View className={styles.timerCard}>
 <Text className={styles.timerIcon}>⏱️</Text>
 <Text className={styles.timerText}>
 限时挑战模式 {timerEnabled ? '已开启' : '已关闭'}
 </Text>
 <Text className={styles.timerSwitch} onClick={() => setTimerEnabled(!timerEnabled)}>
 {timerEnabled ? '✅' : '⚪'}
 </Text>
 </View>

 <View className={styles.randomCard}>
 <View className={styles.randomInfo}>
 <Text className={styles.randomTitle}>🎲 随机挑战</Text>
 <Text className={styles.randomDesc}>
 从筛选出的 {filteredQuestions.length} 道题中随机抽一道
 </Text>
 </View>
 <Button className={styles.randomBtn} onClick={handleRandomStart}>开始</Button>
 </View>

 <Text className={styles.sectionTitle}>
 <Text>📝</Text>
 题目列表 ({filteredQuestions.length}题
 </Text>

 {filteredQuestions.length === 0 ? (<View className={styles.emptyWrap}>
 <EmptyState icon='🔍' title='暂无符合条件的题目' description='试试调整筛选条件，发现更多题目'/>
 </View>) : (<View className={styles.questionList}>
 {filteredQuestions.map(q => {
 const sceneColor = getSceneColor(q.scene);
 const diffColor = getDifficultyColor(q.difficulty);
 return (<View key={q.id} className={styles.questionCard} onClick={() => handleStartQuiz(q.id)}>
 <View className={styles.qcHeader}>
 <View className={styles.qcBadge} style={{ backgroundColor: `${sceneColor}1A` }}>
 <Text className={styles.qcBadgeText}>
 {q.type === 'meaning' ? '📖' : q.type === 'intent' ? '🤔' : '✍️'}
 </Text>
 </View>
 <View className={styles.qcInfo}>
 <Text className={styles.qcTitle}>{q.title}</Text>
 <View className={styles.qcTags}>
 <SceneTag scene={q.scene} size='small' />
 <SceneTag difficulty={q.difficulty} size='small' showIcon={false} />
 <SceneTag questionType={q.type} size='small' />
 </View>
 </View>
 </View>
 <View className={styles.qcFooter}>
 <View className={styles.qcMeta}>
 <View className={styles.qcMetaItem}>
 <Text>⏱️</Text>
 <Text className={styles.qcMetaText}>{q.timeLimit}秒</Text>
 </View>
 <View className={styles.qcMetaItem}>
 <Text>🎯</Text>
 <Text className={styles.qcMetaText}>+{q.points}分</Text>
 </View>
 </View>
 <Text className={styles.qcStartBtn} style={{ color: sceneColor }}>
 答题 →
 </Text>
 </View>
 </View>);
 })}
 </View>)}
 </View>
 </View>);
};
export default ScenarioPage;

