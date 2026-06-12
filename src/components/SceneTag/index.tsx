import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import classnames from 'classnames';
import { getSceneColor, getSceneName, getSceneIcon, getDifficultyName, getDifficultyColor, getQuestionTypeName, getQuestionTypeIcon } from '@/utils/progress';
import type { SceneType, DifficultyLevel, QuestionType } from '@/types';

interface SceneTagProps {
  scene?: SceneType;
  difficulty?: DifficultyLevel;
  questionType?: QuestionType;
  size?: 'small' | 'medium';
  showIcon?: boolean;
  customText?: string;
  customColor?: string;
  outline?: boolean;
  onClick?: () => void;
}

const SceneTag: React.FC<SceneTagProps> = ({
  scene,
  difficulty,
  questionType,
  size = 'small',
  showIcon = true,
  customText,
  customColor,
  outline = false,
  onClick
}) => {
  let text = customText || '';
  let color = customColor || '#6366F1';
  let icon = '';

  if (scene) {
    text = getSceneName(scene);
    color = getSceneColor(scene);
    icon = getSceneIcon(scene);
  } else if (difficulty) {
    text = getDifficultyName(difficulty);
    color = getDifficultyColor(difficulty);
    icon = difficulty === 'easy' ? '🌱' : difficulty === 'medium' ? '🔥' : '⚡';
  } else if (questionType) {
    text = getQuestionTypeName(questionType);
    icon = getQuestionTypeIcon(questionType);
  }

  return (
    <View
      className={classnames(
        styles.tag,
        styles[`size${size.charAt(0).toUpperCase() + size.slice(1)}`],
        outline && styles.outline
      )}
      style={{
        backgroundColor: outline ? `${color}14` : `${color}1A`,
        borderColor: outline ? color : 'transparent'
      }}
      onClick={onClick}
    >
      {showIcon && icon && <Text className={styles.icon}>{icon}</Text>}
      <Text
        className={styles.text}
        style={{ color: outline ? color : color }}
      >
        {text}
      </Text>
    </View>
  );
};

export default SceneTag;
