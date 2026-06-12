import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import SceneTag from '@/components/SceneTag';
import ProgressBar from '@/components/ProgressBar';
import type { Level } from '@/types';
import { getSceneColor } from '@/utils/progress';

interface LevelCardProps {
  level: Level;
  completed?: boolean;
  score?: number;
  requiredScore?: number;
  onClick?: () => void;
}

const LevelCard: React.FC<LevelCardProps> = ({
  level,
  completed = false,
  score = 0,
  requiredScore,
  onClick
}) => {
  const targetScore = requiredScore || level.requiredScore;
  const percent = Math.min(100, (score / targetScore) * 100);
  const isUnlocked = level.unlocked || completed;
  const sceneColor = getSceneColor(level.scene);

  const handleClick = () => {
    if (!isUnlocked) {
      Taro.showToast({
        title: '先完成上一关哦',
        icon: 'none'
      });
      return;
    }
    onClick?.();
  };

  return (
    <View
      className={classnames(
        styles.card,
        !isUnlocked && styles.locked,
        completed && styles.completed
      )}
      onClick={handleClick}
    >
      <View className={styles.header}>
        <View className={styles.left}>
          <View
            className={styles.levelBadge}
            style={{
              background: isUnlocked
                ? completed
                  ? `linear-gradient(135deg, ${sceneColor} 0%, #10B981 100%)`
                  : `linear-gradient(135deg, ${sceneColor}80 0%, ${sceneColor} 100%)`
                : 'linear-gradient(135deg, #CBD5E1 0%, #94A3B8 100%)'
            }}
          >
            <Text className={styles.levelIcon}>
              {!isUnlocked ? '🔒' : completed ? '✓' : `L${level.order}`}
            </Text>
          </View>
          <View className={styles.levelInfo}>
            <Text className={styles.levelName}>{level.name}</Text>
            <View className={styles.tagRow}>
              <SceneTag scene={level.scene} size="small" />
              <SceneTag difficulty={level.difficulty} size="small" showIcon={false} />
            </View>
          </View>
        </View>
        <View className={styles.right}>
          {completed ? (
            <View className={styles.scoreBox}>
              <Text className={styles.scoreValue}>{score}</Text>
              <Text className={styles.scoreLabel}>分</Text>
            </View>
          ) : isUnlocked ? (
            <Text className={styles.arrow}>→</Text>
          ) : null}
        </View>
      </View>

      <Text className={styles.desc}>{level.description}</Text>

      <View className={styles.footer}>
        <View className={styles.progressWrap}>
          <ProgressBar
            percent={percent}
            height={12}
            color={completed ? 'linear-gradient(90deg, #10B981 0%, #34D399 100%)' : ''}
          />
        </View>
        <View className={styles.meta}>
          <Text className={styles.metaText}>
            {level.questionIds.length}题 · {targetScore}分通关
          </Text>
        </View>
      </View>
    </View>
  );
};

export default LevelCard;
