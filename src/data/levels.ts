import type { Level, Scene } from '@/types';

export const scenesData: Scene[] = [
  {
    id: 'meeting',
    name: '会议沟通',
    description: '跨部门对齐、周会脑暴、项目启动，听懂潜台词才叫真·参与',
    icon: '💼',
    color: '#3B82F6'
  },
  {
    id: 'report',
    name: '汇报表达',
    description: '周报月报、晋升述职、方案汇报，话说对了事半功倍',
    icon: '📊',
    color: '#06B6D4'
  },
  {
    id: 'sales',
    name: '商务销售',
    description: '客户拜访、方案沟通、谈判议价，识破婉拒和真需求',
    icon: '🤝',
    color: '#F97316'
  },
  {
    id: 'hiring',
    name: '招聘求职',
    description: 'JD解读、面试对话、Offer谈判，别被画饼忽悠了',
    icon: '🎯',
    color: '#EC4899'
  },
  {
    id: 'review',
    name: '项目复盘',
    description: '上线复盘、季度Review、绩效面谈，会说话也是一种能力',
    icon: '🔍',
    color: '#84CC16'
  }
];

export const levelsData: Level[] = [
  {
    id: 'l_meeting_1',
    scene: 'meeting',
    name: '开会入门',
    description: '认识最基础的会议黑话，告别「会上懵逼」',
    difficulty: 'easy',
    questionIds: ['q001', 'q004', 'q010', 'q011', 'q016'],
    requiredScore: 40,
    unlocked: true,
    order: 1
  },
  {
    id: 'l_meeting_2',
    scene: 'meeting',
    name: '潜台词破译',
    description: '读懂老板话里有话，会议不是光听就行',
    difficulty: 'medium',
    questionIds: ['q002', 'q009', 'q014', 'q017', 'q020'],
    requiredScore: 50,
    unlocked: false,
    order: 2
  },
  {
    id: 'l_report_1',
    scene: 'report',
    name: '汇报词汇基础',
    description: '掌握汇报高频词，周报不再是流水账',
    difficulty: 'easy',
    questionIds: ['q004', 'q005', 'q008', 'q018'],
    requiredScore: 30,
    unlocked: true,
    order: 1
  },
  {
    id: 'l_report_2',
    scene: 'report',
    name: '述职进阶',
    description: '学会用黑话包装成果，晋升答辩有底气',
    difficulty: 'medium',
    questionIds: ['q003', 'q009', 'q013'],
    requiredScore: 45,
    unlocked: false,
    order: 2
  },
  {
    id: 'l_sales_1',
    scene: 'sales',
    name: '销售沟通入门',
    description: '客户的YES和NO，听懂才算入门',
    difficulty: 'easy',
    questionIds: ['q005', 'q015'],
    requiredScore: 20,
    unlocked: true,
    order: 1
  },
  {
    id: 'l_sales_2',
    scene: 'sales',
    name: '成交心理学',
    description: '识破客户婉拒话术，跟进才有方向',
    difficulty: 'medium',
    questionIds: ['q015', 'q014'],
    requiredScore: 30,
    unlocked: false,
    order: 2
  },
  {
    id: 'l_hiring_1',
    scene: 'hiring',
    name: '面试避坑',
    description: 'JD里的潜规则，面试前先扫盲',
    difficulty: 'easy',
    questionIds: ['q019'],
    requiredScore: 10,
    unlocked: true,
    order: 1
  },
  {
    id: 'l_hiring_2',
    scene: 'hiring',
    name: 'Offer谈判',
    description: '面试官的画饼艺术，你能识破几层',
    difficulty: 'hard',
    questionIds: ['q006', 'q012'],
    requiredScore: 35,
    unlocked: false,
    order: 2
  },
  {
    id: 'l_review_1',
    scene: 'review',
    name: '复盘表达',
    description: '复盘不是批斗会，会说话很重要',
    difficulty: 'medium',
    questionIds: ['q008', 'q018'],
    requiredScore: 25,
    unlocked: true,
    order: 1
  },
  {
    id: 'l_review_2',
    scene: 'review',
    name: '甩锅的艺术',
    description: '承认错误但不背锅，高段位玩家必修',
    difficulty: 'hard',
    questionIds: ['q007'],
    requiredScore: 25,
    unlocked: false,
    order: 2
  }
];
