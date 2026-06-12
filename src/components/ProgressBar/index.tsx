import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import classnames from 'classnames';

interface ProgressBarProps {
  percent: number;
  showText?: boolean;
  height?: number;
  color?: string;
  bgColor?: string;
  rounded?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  percent,
  showText = false,
  height = 16,
  color = '',
  bgColor = '',
  rounded = true
}) => {
  const safePercent = Math.max(0, Math.min(100, percent));

  return (
    <View className={styles.progressWrap}>
      <View
        className={classnames(styles.progressBar, rounded && styles.rounded)}
        style={{
          height: `${height}rpx`,
          backgroundColor: bgColor || undefined
        }}
      >
        <View
          className={classnames(styles.progressFill, rounded && styles.rounded)}
          style={{
            width: `${safePercent}%`,
            height: `${height}rpx`,
            background: color || undefined
          }}
        />
      </View>
      {showText && (
        <Text className={styles.progressText}>{safePercent.toFixed(0)}%</Text>
      )}
    </View>
  );
};

export default ProgressBar;
