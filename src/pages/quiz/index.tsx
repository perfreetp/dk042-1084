import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import classnames from 'classnames';
import { View, Text, Button, ScrollView } from '@tarojs/components';
import Taro, { useRouter, useDidHide } from '@tarojs/taro';
import styles from './index.module.scss';
import { questionsData } from '@/data/questions';
import { useStore } from '@/store/useStore';
import { getSceneColor, getQuestionTypeName, getQuestionTypeIcon } from '@/utils/progress';
import SceneTag from '@/components/SceneTag';
import ProgressBar from '@/components/ProgressBar';
import type { Question } from '@/types';
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
    answerDailyQuestion,
    progress,
    updateStreak,
    dailyQuestion
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

  const [levelPassed, setLevelPassed] = useState(false);

  const finishQuiz = () => {
    stopTimer();
    updateStreak();

    let passed = true;
    if (source === 'level' && levelId) {
      const level = levelsData.find(l => l.id === levelId);
      const requiredScore = level?.requiredScore || 60;
      passed = completeLevel(levelId, totalScore, requiredScore);
      setLevelPassed(passed);
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

    return (
      <View className={styles.page}>
        <ScrollView scrollY className={styles.summaryPage}>
          <View className={styles.summaryHeader}>
            <Text className={styles.summaryScoreLabel}>本次得分</Text>
            <Text className={styles.summaryScore}>{totalScore}</Text>
            <View className={styles.summaryResult}>
              {passed ? '🎉 完成练习' : '💪 继续加油'}
            </View>
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

          {source === 'level' && levelId && (
            <View className={styles.summarySection}>
              <Text className={styles.summarySectionTitle}>
                <Text>💡</Text> {passed ? '关卡结果' : '挑战结果'}
              </Text>
              <Text style={{ fontSize: 28, color: '#475569', lineHeight: 1.8 }}>
                {passed
                  ? '🎉 恭喜通关！下一关已解锁，继续挑战更高难度吧！'
                  : `未达到通关分数。本关需要 ${levelsData.find(l => l.id === levelId)?.requiredScore || 60} 分，差一点就通过了，复习错题再来一次！`}
              </Text>
            </View>
          )}

          {source === 'mistakes' && (
            <View className={styles.summarySection}>
              <Text className={styles.summarySectionTitle}>
                <Text>💡</Text> 错题重练结果
              </Text>
              <Text style={{ fontSize: 28, color: '#475569', lineHeight: 1.8 }}>
                {wrongItems.length === 0
                  ? '🎉 太棒了！这些错题你已经全部掌握啦，可以从错题本移除了。'
                  : `还有 ${wrongItems.length} 道题需要继续巩固，建议反复练习直到全部答对。`}
              </Text>
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
