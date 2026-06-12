import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import classnames from 'classnames';
import { View, Text, Button, ScrollView } from '@tarojs/components';
import Taro, { useRouter, useDidHide } from '@tarojs/taro';
import styles from './index.module.scss';
import { questionsData } from '@/data/questions';
import { termsData } from '@/data/terms';
import { useStore } from '@/store/useStore';
import { getSceneColor, getQuestionTypeName, getQuestionTypeIcon, getDifficultyName } from '@/utils/progress';
import SceneTag from '@/components/SceneTag';
import ProgressBar from '@/components/ProgressBar';
import type { Question, QuestionType, Term } from '@/types';
import { levelsData } from '@/data/levels';

interface AnswerState {
  selectedKey: string | null;
  isAnswered: boolean;
  isCorrect: boolean;
  timeSpent: number;
}

const QuizPage: React.FC = () => {
  const router = useRouter();
  const {
    source = 'single',
    questionId,
    questionIds,
    levelId,
    scene,
    mistakes: mistakeStr,
    timed = '1'
  } = router.params;

  const timedEnabled = timed !== '0';

  const {
    recordAnswer,
    addMistake,
    completeLevel,
    recordLevelAttempt,
    answerDailyQuestion,
    progress,
    updateStreak,
    dailyQuestion,
    removeMasteredMistakes
  } = useStore();

  const questionList = useMemo<Question[]>(() => {
    let list: Question[] = [];
    if (source === 'daily') {
      if (dailyQuestion) {
        list = [dailyQuestion.question];
      } else if (questionId) {
        const q = questionsData.find(q => q.id === questionId);
        if (q) list = [q];
      }
    } else if (source === 'level' && questionIds) {
      const ids = questionIds.split(',');
      list = ids
        .map(id => questionsData.find(q => q.id === id))
        .filter((q): q is Question => !!q);
    } else if (source === 'mistakes') {
      if (questionIds) {
        const ids = questionIds.split(',');
        list = ids
          .map(id => questionsData.find(q => q.id === id))
          .filter((q): q is Question => !!q);
      } else if (mistakeStr) {
        try {
          const ids: string[] = JSON.parse(decodeURIComponent(mistakeStr));
          list = ids
            .map(id => questionsData.find(q => q.id === id))
            .filter((q): q is Question => !!q);
        } catch (e) {
          list = [];
        }
      }
    } else if (source === 'scenario' && questionIds) {
      const ids = questionIds.split(',');
      list = ids
        .map(id => questionsData.find(q => q.id === id))
        .filter((q): q is Question => !!q);
    } else if (questionId) {
      const q = questionsData.find(q => q.id === questionId);
      if (q) list = [q];
    } else if (questionIds) {
      const ids = questionIds.split(',');
      list = ids
        .map(id => questionsData.find(q => q.id === id))
        .filter((q): q is Question => !!q);
    }
    return list;
  }, [source, questionId, questionIds, mistakeStr, dailyQuestion]);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<AnswerState[]>(() =>
    questionList.map(() => ({
      selectedKey: null,
      isAnswered: false,
      isCorrect: false,
      timeSpent: 0
    }))
  );
  const [timeLeft, setTimeLeft] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [startTime] = useState(Date.now());
  const [levelPassed, setLevelPassed] = useState(false);
  const [masteredRemoved, setMasteredRemoved] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentQuestion = questionList[currentIdx];
  const currentAnswer = answers[currentIdx];
  const isLastQuestion = currentIdx === questionList.length - 1;
  const allAnswered = answers.every(a => a.isAnswered);
  const correctCount = answers.filter(a => a.isCorrect).length;
  const totalScore = answers.reduce((sum, a, idx) => {
    if (a.isCorrect && questionList[idx]) {
      return sum + questionList[idx].points;
    }
    return sum;
  }, 0);
  const accuracy = answers.length > 0
    ? Math.round((correctCount / answers.length) * 100)
    : 0;

  const totalQuestions = questionList.length;

  const { weakTypes, weakTerms, masteredMistakeIds } = useMemo(() => {
    const typeStats: Record<QuestionType, { total: number; correct: number }> = {
      meaning: { total: 0, correct: 0 },
      intent: { total: 0, correct: 0 },
      rewrite: { total: 0, correct: 0 }
    };
    const termStats: Record<string, { total: number; correct: number }> = {};
    const mastered: string[] = [];

    answers.forEach((a, idx) => {
      const q = questionList[idx];
      if (!q) return;
      typeStats[q.type].total++;
      if (a.isCorrect) typeStats[q.type].correct++;
      if (q.relatedTermId) {
        if (!termStats[q.relatedTermId]) termStats[q.relatedTermId] = { total: 0, correct: 0 };
        termStats[q.relatedTermId].total++;
        if (a.isCorrect) termStats[q.relatedTermId].correct++;
      }
      if (source === 'mistakes' && a.isCorrect) mastered.push(q.id);
    });

    const wt: QuestionType[] = (Object.keys(typeStats) as QuestionType[])
      .filter(t => typeStats[t].total > 0 && typeStats[t].correct / typeStats[t].total < 0.6)
      .sort((a, b) => (typeStats[a].correct / typeStats[a].total) - (typeStats[b].correct / typeStats[b].total));

    const wIds: string[] = Object.keys(termStats)
      .filter(id => termStats[id].total > 0 && termStats[id].correct / termStats[id].total < 1)
      .sort((a, b) => (termStats[a].correct / termStats[a].total) - (termStats[b].correct / termStats[b].total))
      .slice(0, 3);

    const wTerms: Term[] = wIds.map(id => termsData.find(t => t.id === id)).filter((t): t is Term => !!t);

    return { weakTypes: wt, weakTerms: wTerms, masteredMistakeIds: mastered };
  }, [answers, questionList, source]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback((limit: number) => {
    if (!timedEnabled) {
      setTimeLeft(limit);
      return;
    }
    stopTimer();
    setTimeLeft(limit);
    const startedAt = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      const left = Math.max(0, limit - elapsed);
      setTimeLeft(left);
      if (left <= 0) {
        stopTimer();
        handleTimeout();
      }
    }, 200);
  }, [stopTimer, timedEnabled]);

  const handleTimeout = useCallback(() => {
    if (!timedEnabled) return;
    setAnswers(prev => {
      if (prev[currentIdx].isAnswered) return prev;
      const newAnswers = [...prev];
      newAnswers[currentIdx] = {
        selectedKey: '',
        isAnswered: true,
        isCorrect: false,
        timeSpent: currentQuestion?.timeLimit || 0
      };
      return newAnswers;
    });
    if (currentQuestion) {
      recordAnswer(currentQuestion, '', false, currentQuestion.timeLimit);
    }
  }, [currentIdx, currentQuestion, recordAnswer, timedEnabled]);

  useEffect(() => {
    if (currentQuestion && !currentAnswer.isAnswered && !showSummary) {
      startTimer(currentQuestion.timeLimit);
    }
    return () => stopTimer();
  }, [currentIdx, showSummary, timedEnabled]);

  useDidHide(() => {
    stopTimer();
  });

  const handleSelectOption = (key: string) => {
    if (currentAnswer.isAnswered) return;
    stopTimer();
    const timeSpent = timedEnabled
      ? Math.max(1, (currentQuestion?.timeLimit || 0) - timeLeft)
      : Math.max(1, Math.floor((Date.now() - startTime) / 1000) - currentIdx * 5);
    const isCorrect = key === currentQuestion?.answer;

    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[currentIdx] = {
        selectedKey: key,
        isAnswered: true,
        isCorrect,
        timeSpent: Math.max(1, timeSpent)
      };
      return newAnswers;
    });

    if (currentQuestion) {
      recordAnswer(currentQuestion, key, isCorrect, Math.max(1, timeSpent));
      if (source === 'daily') {
        answerDailyQuestion(isCorrect);
      }
      if (!isCorrect) {
        const correctOpt = currentQuestion.options.find(o => o.key === currentQuestion.answer);
        addMistake(currentQuestion, key, correctOpt?.key || '');
      }
    }
  };

  const goNext = () => {
    if (isLastQuestion) {
      finishQuiz();
    } else {
      setCurrentIdx(prev => prev + 1);
    }
  };

  const goPrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
    }
  };

  const finishQuiz = () => {
    stopTimer();
    updateStreak();

    let passed = true;
    if (source === 'level' && levelId) {
      const level = levelsData.find(l => l.id === levelId);
      const requiredScore = level?.requiredScore || 60;
      passed = completeLevel(levelId, totalScore, requiredScore);
      setLevelPassed(passed);

      recordLevelAttempt({
        levelId,
        score: totalScore,
        correctCount,
        totalQuestions,
        accuracy,
        weakTypes,
        weakTermIds: weakTerms.map(t => t.id),
        attemptedAt: Date.now(),
        passed
      });
    }
    setShowSummary(true);
  };

  const getOptionClass = (key: string) => {
    if (!currentAnswer.isAnswered) {
      return currentAnswer.selectedKey === key
        ? `${styles.optionItem} ${styles.optionItemSelected}`
        : styles.optionItem;
    }
    if (key === currentQuestion?.answer) {
      return `${styles.optionItem} ${styles.optionItemCorrect}`;
    }
    if (key === currentAnswer.selectedKey && key !== currentQuestion?.answer) {
      return `${styles.optionItem} ${styles.optionItemWrong}`;
    }
    return styles.optionItem;
  };

  const getOptionKeyClass = (key: string) => {
    if (!currentAnswer.isAnswered) {
      return currentAnswer.selectedKey === key
        ? `${styles.optionKey} ${styles.optionKeySelected}`
        : styles.optionKey;
    }
    if (key === currentQuestion?.answer) {
      return `${styles.optionKey} ${styles.optionKeyCorrect}`;
    }
    if (key === currentAnswer.selectedKey && key !== currentQuestion?.answer) {
      return `${styles.optionKey} ${styles.optionKeyWrong}`;
    }
    return styles.optionKey;
  };

  const handleBackHome = () => {
    Taro.switchTab({ url: '/pages/home/index' });
  };

  const handleRetry = () => {
    setCurrentIdx(0);
    setAnswers(
      questionList.map(() => ({
        selectedKey: null,
        isAnswered: false,
        isCorrect: false,
        timeSpent: 0
      }))
    );
    setShowSummary(false);
    setLevelPassed(false);
    setMasteredRemoved(false);
  };

  const handleRemoveMastered = () => {
    if (masteredMistakeIds.length === 0) return;
    removeMasteredMistakes(masteredMistakeIds);
    setMasteredRemoved(true);
    Taro.showToast({ title: `已移除 ${masteredMistakeIds.length} 道掌握错题`, icon: 'success' });
  };

  const handleGoTerm = (termId: string) => {
    Taro.navigateTo({ url: `/pages/term-detail/index?id=${termId}` });
  };

  if (questionList.length === 0) {
    return (
      <View className={styles.page}>
        <View className='pageContainer' style={{ padding: 64, textAlign: 'center' }}>
          <Text>暂无题目，请返回选择</Text>
        </View>
      </View>
    );
  }

  if (showSummary) {
    let passed = true;
    if (source === 'level' && levelId) {
      passed = levelPassed;
    } else if (source === 'mistakes') {
      passed = accuracy >= 60;
    } else {
      passed = accuracy >= 60;
    }

    const wrongItems = answers
      .map((a, idx) => ({ answer: a, question: questionList[idx], idx }))
      .filter(x => !x.answer.isCorrect);

    const level = source === 'level' && levelId ? levelsData.find(l => l.id === levelId) : undefined;
    const requiredScore = level?.requiredScore || 60;

    const getNextAdvice = () => {
      if (source !== 'level' || !level) return '';
      if (passed) {
        return '🎉 恭喜通关！建议挑战同场景下一关，或进入词条广场巩固相关黑话。';
      }
      if (accuracy >= 40) {
        return '差一点就通关了！建议先复习本次错题，再针对薄弱题型专项训练。';
      }
      return '基础还需要夯实，建议回到词条广场学习相关黑话含义后再来挑战。';
    };

    return (
      <View className={styles.page}>
        <ScrollView scrollY className={styles.summaryPage}>
          <View className={styles.summaryHeader}>
            <Text className={styles.summaryScoreLabel}>本次得分</Text>
            <Text className={styles.summaryScore}>{totalScore}</Text>
            <View className={styles.summaryResult}>
              {source === 'level'
                ? (passed ? '🎉 通关成功' : '💪 挑战未通过')
                : passed ? '🎉 完成练习' : '💪 继续加油'}
            </View>
            {source === 'level' && (
              <Text className={styles.summarySub}>
                通关分数：{requiredScore} 分 · {passed ? '已达标' : '未达标'}
              </Text>
            )}
          </View>

          <View className={styles.summaryStats}>
            <View className={styles.summaryStatCard}>
              <Text className={styles.summaryStatValue}>{totalQuestions}</Text>
              <Text className={styles.summaryStatLabel}>总题数</Text>
            </View>
            <View className={styles.summaryStatCard}>
              <Text className={styles.summaryStatValue} style={{ color: '#10B981' }}>
                {correctCount}
              </Text>
              <Text className={styles.summaryStatLabel}>答对</Text>
            </View>
            <View className={styles.summaryStatCard}>
              <Text className={styles.summaryStatValue} style={{ color: '#EF4444' }}>
                {totalQuestions - correctCount}
              </Text>
              <Text className={styles.summaryStatLabel}>答错</Text>
            </View>
            <View className={styles.summaryStatCard}>
              <Text className={styles.summaryStatValue} style={{ color: '#6366F1' }}>
                {accuracy}%
              </Text>
              <Text className={styles.summaryStatLabel}>正确率</Text>
            </View>
          </View>

          {source === 'mistakes' && (
            <View className={styles.summarySection}>
              <Text className={styles.summarySectionTitle}>
                <Text>📊</Text> 错题掌握情况
              </Text>
              <View className={styles.masterRow}>
                <View className={styles.masterBox} style={{ background: '#ECFDF5', borderColor: '#10B981' }}>
                  <Text className={styles.masterCount} style={{ color: '#10B981' }}>
                    {masteredMistakeIds.length}
                  </Text>
                  <Text className={styles.masterLabel}>已掌握</Text>
                </View>
                <View className={styles.masterBox} style={{ background: '#FEF2F2', borderColor: '#EF4444' }}>
                  <Text className={styles.masterCount} style={{ color: '#EF4444' }}>
                    {totalQuestions - masteredMistakeIds.length}
                  </Text>
                  <Text className={styles.masterLabel}>需继续巩固</Text>
                </View>
              </View>
              {masteredMistakeIds.length > 0 && !masteredRemoved && (
                <Text className={styles.removeMasteredBtn} onClick={handleRemoveMastered}>
                  ✅ 从错题本移除这 {masteredMistakeIds.length} 道已掌握题目
                </Text>
              )}
              {masteredRemoved && (
                <Text style={{ fontSize: 24, color: '#10B981', textAlign: 'center', padding: 16 }}>
                  ✓ 已从错题本移除掌握题目
                </Text>
              )}
            </View>
          )}

          {source === 'level' && weakTypes.length > 0 && (
            <View className={styles.summarySection}>
              <Text className={styles.summarySectionTitle}>
                <Text>⚠️</Text> 薄弱题型
              </Text>
              <View className={styles.weakTypeList}>
                {weakTypes.map(t => (
                  <View key={t} className={styles.weakTypeItem}>
                    <Text className={styles.weakTypeIcon}>{getQuestionTypeIcon(t)}</Text>
                    <Text className={styles.weakTypeName}>{getQuestionTypeName(t)}</Text>
                    <Text className={styles.weakTypeTip}>需重点练习</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {(source === 'level' || source === 'mistakes') && weakTerms.length > 0 && (
            <View className={styles.summarySection}>
              <Text className={styles.summarySectionTitle}>
                <Text>📚</Text> 相关词条推荐
              </Text>
              <View className={styles.termList}>
                {weakTerms.map(t => {
                  const sceneColor = getSceneColor(t.scenes[0]);
                  return (
                    <View
                      key={t.id}
                      className={styles.termCard}
                      onClick={() => handleGoTerm(t.id)}
                    >
                      <View className={styles.termCardHeader}>
                        <Text className={styles.termWord}>{t.word}</Text>
                        <SceneTag difficulty={t.difficulty} size='small' showIcon={false} />
                      </View>
                      <Text className={styles.termMeaning} numberOfLines={2}>
                        {t.meaning}
                      </Text>
                      <View className={styles.termFooter}>
                        <Text className={styles.termView} style={{ color: sceneColor }}>
                          查看详情 →
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {source === 'level' && (
            <View className={styles.summarySection}>
              <Text className={styles.summarySectionTitle}>
                <Text>🎯</Text> 下一步建议
              </Text>
              <Text style={{ fontSize: 28, color: '#475569', lineHeight: 1.8 }}>
                {getNextAdvice()}
              </Text>
              {!passed && weakTypes.length > 0 && (
                <Text style={{ fontSize: 26, color: '#94A3B8', lineHeight: 1.8, display: 'block', marginTop: 8 }}>
                  建议练习重点：{weakTypes.map(t => getQuestionTypeName(t)).join('、')}
                </Text>
              )}
            </View>
          )}

          {wrongItems.length > 0 && (
            <View className={styles.summarySection}>
              <Text className={styles.summarySectionTitle}>
                <Text>❌</Text> 错题回顾（{wrongItems.length}）
              </Text>
              <View className={styles.wrongList}>
                {wrongItems.map(({ answer, question, idx }) => (
                  <View key={question.id} className={styles.wrongItem}>
                    <View className={styles.wrongIndex}>{idx + 1}</View>
                    <View className={styles.wrongContent}>
                      <Text className={styles.wrongTitle}>{question.title}</Text>
                      <View className={styles.wrongCompare}>
                        <View className={styles.wrongCompareRow}>
                          <Text className={styles.wrongLabelUser}>你的</Text>
                          <Text className={styles.wrongCompareText}>
                            {answer.selectedKey
                              ? question.options.find(o => o.key === answer.selectedKey)?.text
                              : '未作答'}
                          </Text>
                        </View>
                        <View className={styles.wrongCompareRow}>
                          <Text className={styles.wrongLabelCorrect}>正确</Text>
                          <Text className={styles.wrongCompareText}>
                            {question.options.find(o => o.key === question.answer)?.text}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        <View className={styles.bottomBar}>
          <Button className={styles.btnSecondary} onClick={handleBackHome}>
            返回首页
          </Button>
          <Button className={styles.btnPrimary} onClick={handleRetry}>
            🔄 再来一次
          </Button>
        </View>
      </View>
    );
  }

  const sceneColor = currentQuestion ? getSceneColor(currentQuestion.scene) : '#6366F1';
  const timerDanger = timeLeft <= 5;
  const canSubmit = currentAnswer.selectedKey !== null && !currentAnswer.isAnswered;

  return (
    <View className={styles.page}>
      <View className={styles.topBar}>
        <View className={styles.progressInfo}>
          <Text className={styles.progressText}>
            {currentIdx + 1}/{totalQuestions}
          </Text>
          <View className={styles.progressBarWrap}>
            <ProgressBar
              percent={Math.round(((currentIdx + (currentAnswer.isAnswered ? 1 : 0)) / totalQuestions) * 100)}
              color={sceneColor}
              height='12rpx'
            />
          </View>
        </View>
        <View
          className={classnames(
            styles.timerBox,
            timedEnabled && timerDanger && styles.timerBoxDanger
          )}
          style={!timedEnabled ? { background: '#ECFDF5' } : undefined}
        >
          <Text className={styles.timerIcon}>{timedEnabled ? '⏱' : '✅'}</Text>
          <Text
            className={classnames(
              styles.timerText,
              timedEnabled && timerDanger && styles.timerTextDanger
            )}
            style={!timedEnabled ? { color: '#059669' } : undefined}
          >
            {timedEnabled ? `${timeLeft}s` : '不限时'}
          </Text>
        </View>
      </View>

      <ScrollView scrollY className={styles.questionContainer}>
        <View className={styles.questionCard}>
          <View className={styles.tagRow}>
            <View className={styles.questionTypeLabel}>
              <Text>{getQuestionTypeIcon(currentQuestion.type)}</Text>
              <Text>{getQuestionTypeName(currentQuestion.type)}</Text>
            </View>
            <SceneTag scene={currentQuestion.scene} size='small' />
            <SceneTag difficulty={currentQuestion.difficulty} size='small' showIcon={false} />
            <View style={{
              background: 'linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%)',
              borderRadius: 20,
              padding: '4rpx 16rpx',
              fontSize: 22,
              fontWeight: 600,
              color: '#fff',
              lineHeight: 1.8
            }}>
              +{currentQuestion.points}分
            </View>
          </View>

          <Text className={styles.questionTitle}>{currentQuestion.title}</Text>

          {currentQuestion.context && (
            <View className={styles.questionContext}>
              <Text className={styles.questionContextLabel}>📌 背景情境</Text>
              <Text className={styles.questionContextText}>{currentQuestion.context}</Text>
            </View>
          )}

          <View className={styles.optionsList}>
            {currentQuestion.options.map(option => {
              const showCorrectIcon =
                currentAnswer.isAnswered && option.key === currentQuestion.answer;
              const showWrongIcon =
                currentAnswer.isAnswered &&
                option.key === currentAnswer.selectedKey &&
                option.key !== currentQuestion.answer;

              return (
                <View
                  key={option.key}
                  className={getOptionClass(option.key)}
                  onClick={() => handleSelectOption(option.key)}
                >
                  <View className={getOptionKeyClass(option.key)}>
                    {option.key}
                  </View>
                  <View className={styles.optionContent}>
                    <Text className={styles.optionText}>{option.text}</Text>
                  </View>
                  {showCorrectIcon && (
                    <Text className={styles.optionResultIcon}>✅</Text>
                  )}
                  {showWrongIcon && (
                    <Text className={styles.optionResultIcon}>❌</Text>
                  )}
                </View>
              );
            })}
          </View>

          {currentAnswer.isAnswered && (
            <View className={styles.explanationCard}>
              <View className={styles.explanationHeader}>
                <Text className={styles.explanationIcon}>📖</Text>
                <Text className={styles.explanationTitle}>
                  {currentAnswer.isCorrect ? '答对啦！答案解析' : '答案解析'}
                </Text>
              </View>
              <Text className={styles.explanationText}>{currentQuestion.explanation}</Text>
            </View>
          )}
        </View>

        <View className={styles.paddingBottom} />
      </ScrollView>

      <View className={styles.bottomBar}>
        {currentIdx > 0 && (
          <Button className={styles.btnSecondary} onClick={goPrev}>
            ← 上一题
          </Button>
        )}
        {!currentAnswer.isAnswered ? (
          <Button
            className={`${styles.btnPrimary} ${!canSubmit ? styles.btnPrimaryDisabled : ''}`}
            onClick={() => currentAnswer.selectedKey && handleSelectOption(currentAnswer.selectedKey)}
          >
            {canSubmit ? '提交答案' : '请选择选项'}
          </Button>
        ) : (
          <Button className={styles.btnPrimary} onClick={goNext}>
            {isLastQuestion ? '查看结果 →' : '下一题 →'}
          </Button>
        )}
      </View>
    </View>
  );
};

export default QuizPage;
