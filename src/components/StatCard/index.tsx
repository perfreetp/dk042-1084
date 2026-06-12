import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  color?: string;
  trend?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  color = '#6366F1',
  trend
}) => {
  return (
    <View className={styles.card}>
      <View
        className={styles.iconBox}
        style={{ backgroundColor: `${color}1A` }}
      >
        <Text className={styles.icon}>{icon}</Text>
      </View>
      <View className={styles.content}>
        <Text className={styles.label}>{label}</Text>
        <View className={styles.valueRow}>
          <Text className={styles.value} style={{ color }}>{value}</Text>
          {trend && <Text className={styles.trend}>{trend}</Text>}
        </View>
      </View>
    </View>
  );
};

export default StatCard;
