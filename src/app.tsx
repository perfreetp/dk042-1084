import React, { useEffect } from 'react';
import { useDidShow, useDidHide } from '@tarojs/taro';
import { useStore } from '@/store/useStore';
// 全局样式
import './app.scss';

function App(props) {
  const { initStore, checkAchievements } = useStore();

  useEffect(() => {
    initStore();
    checkAchievements();
    console.log('[App] initialized');
  }, []);

  // 对应 onShow
  useDidShow(() => {
    checkAchievements();
  });

  // 对应 onHide
  useDidHide(() => {});

  return props.children;
}

export default App;
