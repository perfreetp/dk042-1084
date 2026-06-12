import type { Achievement } from '@/types';

export const achievementsData: Achievement[] = [
  {
    id: 'a001',
    name: '初入江湖',
    description: '完成第一道题目',
    icon: '🎓',
    condition: '完成答题数量 ≥ 1',
    progress: 0,
    target: 1
  },
  {
    id: 'a002',
    name: '小试牛刀',
    description: '累计答对10道题',
    icon: '⭐',
    condition: '累计正确数 ≥ 10',
    progress: 0,
    target: 10
  },
  {
    id: 'a003',
    name: '黑话学徒',
    description: '累计答对50道题',
    icon: '📚',
    condition: '累计正确数 ≥ 50',
    progress: 0,
    target: 50
  },
  {
    id: 'a004',
    name: '闯关先锋',
    description: '通过第一个关卡',
    icon: '🏆',
    condition: '完成关卡数 ≥ 1',
    progress: 0,
    target: 1
  },
  {
    id: 'a005',
    name: '五关斩将',
    description: '累计通过5个关卡',
    icon: '⚔️',
    condition: '完成关卡数 ≥ 5',
    progress: 0,
    target: 5
  },
  {
    id: 'a006',
    name: '会议达人',
    description: '完成「会议沟通」场景所有关卡',
    icon: '💼',
    condition: '会议场景关卡全部通过',
    progress: 0,
    target: 1
  },
  {
    id: 'a007',
    name: '汇报高手',
    description: '完成「汇报表达」场景所有关卡',
    icon: '📊',
    condition: '汇报场景关卡全部通过',
    progress: 0,
    target: 1
  },
  {
    id: 'a008',
    name: '连续打卡7天',
    description: '连续学习打卡7天不间断',
    icon: '🔥',
    condition: '连续打卡 ≥ 7',
    progress: 0,
    target: 7
  },
  {
    id: 'a009',
    name: '坚持就是胜利',
    description: '连续打卡30天',
    icon: '💪',
    condition: '连续打卡 ≥ 30',
    progress: 0,
    target: 30
  },
  {
    id: 'a010',
    name: '学霸级玩家',
    description: '累计积分达到1000分',
    icon: '👑',
    condition: '总积分 ≥ 1000',
    progress: 0,
    target: 1000
  },
  {
    id: 'a011',
    name: '错题终结者',
    description: '在错题本中重做并答对20道题',
    icon: '🎯',
    condition: '错题重做正确 ≥ 20',
    progress: 0,
    target: 20
  },
  {
    id: 'a012',
    name: '收藏家',
    description: '收藏20个词条到我的词库',
    icon: '💎',
    condition: '收藏词条数 ≥ 20',
    progress: 0,
    target: 20
  }
];
