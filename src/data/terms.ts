import type { Term } from '@/types';

export const termsData: Term[] = [
  {
    id: 't001',
    word: '对齐颗粒度',
    meaning: '双方或多方就某件事的细节程度、处理范围达成共识',
    deepMeaning: '表面是讨论工作的细致程度，实际是在确认「谁做多少做到什么程度」「出了问题责任边界在哪」，本质是在划分权责和预期管理',
    scenes: ['meeting', 'report'],
    difficulty: 'medium',
    synonyms: ['统一口径', '对一下细节', '拉通对齐'],
    examples: [
      { id: 'e001', text: '这个方案我们先对齐一下颗粒度，别到时候你做了A我做了B。', likes: 128, createdAt: Date.now() },
      { id: 'e002', text: '先和产品对一下颗粒度，免得做出来不符合预期。', likes: 89, createdAt: Date.now() }
    ],
    usageNote: '常用于项目启动前或需求评审时，避免工作边界不清造成返工'
  },
  {
    id: 't002',
    word: '赋能',
    meaning: '给予能力和资源支持，帮助某人或某团队完成目标',
    deepMeaning: '原意是「给予能力」，实际使用中已经泛化成一个万能词：培训可以叫赋能、给工具叫赋能、出个方案也叫赋能，有时候甚至就是「我来参与一下」的高端说法',
    scenes: ['meeting', 'report', 'review'],
    difficulty: 'easy',
    synonyms: ['支持', '助力', '提供支持'],
    examples: [
      { id: 'e003', text: '我们要为一线业务团队赋能，提升整体作战能力。', likes: 256, createdAt: Date.now() },
      { id: 'e004', text: '技术部来赋能一下这个项目。', author: '匿名用户', likes: 167, createdAt: Date.now() }
    ]
  },
  {
    id: 't003',
    word: '抓手',
    meaning: '切入点、突破口、具体可执行的办法',
    deepMeaning: '把抽象的工作目标变成一件具体可落地的事情。老板说「找个抓手」的潜台词通常是：「别跟我讲这些虚的，告诉我先做什么具体的事」',
    scenes: ['meeting', 'report', 'sales'],
    difficulty: 'medium',
    synonyms: ['切入点', '突破口', '着力点'],
    examples: [
      { id: 'e005', text: '这个季度的增长抓手是什么？不能光喊口号啊。', likes: 342, createdAt: Date.now() },
      { id: 'e006', text: '我们以用户留存为抓手，带动整体数据提升。', likes: 201, createdAt: Date.now() }
    ],
    usageNote: '汇报必备高频词，用对了显得很有方法论'
  },
  {
    id: 't004',
    word: '闭环',
    meaning: '从开始到结束的完整流程，形成一个可以自我运转的体系',
    deepMeaning: '表面是说流程完整，实际潜台词可能是：①「这件事不能只做一半」②「你得跟踪结果，别做了就不管了」③「反馈机制要打通」',
    scenes: ['meeting', 'report', 'review', 'sales'],
    difficulty: 'easy',
    synonyms: ['完整流程', '打通链路', '形成回路'],
    examples: [
      { id: 'e007', text: '用户从注册到付费的转化闭环还没打通。', likes: 198, createdAt: Date.now() },
      { id: 'e008', text: '做任何项目都要形成闭环，有始有终。', likes: 176, createdAt: Date.now() }
    ]
  },
  {
    id: 't005',
    word: '复盘',
    meaning: '项目或事件结束后，回顾全过程，总结经验教训',
    deepMeaning: '不是简单的总结，而是「推演每一步决策为什么做、结果对不对、下次怎么改」。如果项目做得好，复盘是为了「可复制」；做砸了，复盘是为了「甩锅和避免下次再被坑」',
    scenes: ['review', 'meeting'],
    difficulty: 'easy',
    synonyms: ['总结', '回顾', 'Review'],
    examples: [
      { id: 'e009', text: '这个项目上线后我们做个复盘，看看哪些地方可以优化。', likes: 287, createdAt: Date.now() },
      { id: 'e010', text: '复盘不是批斗会，关键是沉淀方法论。', likes: 234, createdAt: Date.now() }
    ]
  },
  {
    id: 't006',
    word: '顶层设计',
    meaning: '从全局视角出发，自上而下的整体规划和设计',
    deepMeaning: '潜台词：「你别上来就抠细节，先想清楚大方向和整体框架」。老板说「先做顶层设计」通常意味着：你现在做的太零散了，缺乏系统性思考',
    scenes: ['meeting', 'report'],
    difficulty: 'hard',
    synonyms: ['总体规划', '战略设计', '顶层规划'],
    examples: [
      { id: 'e011', text: '先别急着动手，我们先把顶层设计想清楚。', likes: 445, createdAt: Date.now() },
      { id: 'e012', text: '缺乏顶层设计，做出来的东西东拼西凑。', likes: 312, createdAt: Date.now() }
    ]
  },
  {
    id: 't007',
    word: '去中心化',
    meaning: '不依赖单一中心节点，权力和决策分散到各个个体',
    deepMeaning: '在互联网公司语境下，通常意思是：①「别什么都找我审批」②「让一线的人自己做决定」③「组织结构扁平化」。但要注意：说归说，真出了问题还是会找你',
    scenes: ['meeting', 'report', 'hiring'],
    difficulty: 'hard',
    synonyms: ['分布式', '扁平化', '去中间化'],
    examples: [
      { id: 'e013', text: '我们要推行去中心化的决策机制，让听得见炮声的人做决定。', likes: 378, createdAt: Date.now() }
    ]
  },
  {
    id: 't008',
    word: '拉通',
    meaning: '把相关人员拉到一起，信息同步、达成共识',
    deepMeaning: '一个典型的名词作动词用的互联网黑话。潜台词：「之前大家各干各的，信息不透明，现在必须凑到一起说清楚」。「拉通一下」有时候等于「开个会」',
    scenes: ['meeting', 'report'],
    difficulty: 'easy',
    synonyms: ['同步', '对齐', '碰一下'],
    examples: [
      { id: 'e014', text: '这个需求涉及三个部门，我们拉通一下吧。', likes: 521, createdAt: Date.now() },
      { id: 'e015', text: '你把相关同学拉通对齐一下。', likes: 402, createdAt: Date.now() }
    ]
  },
  {
    id: 't009',
    word: '心智',
    meaning: '用户对品牌/产品的认知和印象',
    deepMeaning: '源自心理学概念「心智模型」，在营销语境中就是「用户想到某个品类时，第一个想到你」。「占领用户心智」约等于「让用户买东西先想到你」',
    scenes: ['sales', 'report', 'meeting'],
    difficulty: 'medium',
    synonyms: ['认知', '印象', '品牌认知'],
    examples: [
      { id: 'e016', text: '我们要通过内容营销占领用户心智。', likes: 267, createdAt: Date.now() },
      { id: 'e017', text: '用户心智的建立需要长期投入。', likes: 189, createdAt: Date.now() }
    ]
  },
  {
    id: 't010',
    word: 'ROI',
    meaning: 'Return On Investment，投入产出比',
    deepMeaning: '判断一件事值不值得做的核心指标。老板问「ROI怎么样」的潜台词是：「花这些钱/精力，能赚回来多少？别做亏本买卖」。低ROI的项目=随时可能被砍掉的项目',
    scenes: ['meeting', 'report', 'review', 'sales'],
    difficulty: 'medium',
    synonyms: ['投入产出比', '投资回报率'],
    examples: [
      { id: 'e018', text: '这个活动ROI太低，不建议做。', likes: 456, createdAt: Date.now() },
      { id: 'e019', text: '做决策前先算清楚ROI。', likes: 334, createdAt: Date.now() }
    ],
    usageNote: '外企和大厂高频词，读字母音R-O-I，不要读成单词'
  },
  {
    id: 't011',
    word: '护城河',
    meaning: '企业或产品的竞争壁垒、核心优势',
    deepMeaning: '源自巴菲特的投资理论，比喻像古代城堡周围的护城河一样，让竞争对手难以进入。老板问「我们的护城河是什么」=「我们靠什么不被干掉」',
    scenes: ['meeting', 'report', 'sales'],
    difficulty: 'medium',
    synonyms: ['竞争壁垒', '核心优势', '壁垒'],
    examples: [
      { id: 'e020', text: '光有流量不行，我们得建立自己的护城河。', likes: 389, createdAt: Date.now() },
      { id: 'e021', text: '技术壁垒才是真正的护城河。', likes: 278, createdAt: Date.now() }
    ]
  },
  {
    id: 't012',
    word: '降维打击',
    meaning: '用更高维度的优势去碾压低维度的对手',
    deepMeaning: '出自《三体》，原本是科幻概念。商业语境下的意思是：「我们用更先进的模式/技术/资源，去打那些还在用老方法的对手」。但很多时候只是在说「我们想个办法碾压对方」',
    scenes: ['meeting', 'sales', 'report'],
    difficulty: 'hard',
    synonyms: ['碾压', '降维攻击', '维度优势'],
    examples: [
      { id: 'e022', text: '我们要用数字化手段对传统行业进行降维打击。', likes: 567, createdAt: Date.now() }
    ]
  },
  {
    id: 't013',
    word: '沉淀',
    meaning: '把经验、方法、数据等积累下来，形成可复用的资产',
    deepMeaning: '「做了事情就要留下点东西」。沉淀=不白干。做完项目不沉淀经验=干完就忘=下次还踩同样的坑',
    scenes: ['review', 'meeting', 'report'],
    difficulty: 'easy',
    synonyms: ['积累', '留存', '固化'],
    examples: [
      { id: 'e023', text: '做完项目记得把经验沉淀下来。', likes: 234, createdAt: Date.now() },
      { id: 'e024', text: '团队的知识沉淀非常重要。', likes: 167, createdAt: Date.now() }
    ]
  },
  {
    id: 't014',
    word: '倒逼',
    meaning: '反过来推动，用结果或外部压力促使改变',
    deepMeaning: '「倒逼改革/升级/优化」= 正常手段推不动，只能反过来用压力逼着做。比如：用户投诉倒逼产品改进、KPI倒逼团队加班',
    scenes: ['meeting', 'report', 'review'],
    difficulty: 'medium',
    synonyms: ['反向推动', '反向驱动', '推动'],
    examples: [
      { id: 'e025', text: '用业务增长倒逼技术架构升级。', likes: 412, createdAt: Date.now() },
      { id: 'e026', text: '市场竞争倒逼我们必须做出改变。', likes: 323, createdAt: Date.now() }
    ]
  },
  {
    id: 't015',
    word: '场景',
    meaning: '用户在什么时间、什么地点、什么情境下使用产品',
    deepMeaning: '一个词把「Who When Where What Why How」都概括了。做产品不谈场景=纸上谈兵。「这个场景不成立」=「你这个需求是空想的，没人会用」',
    scenes: ['meeting', 'report', 'sales'],
    difficulty: 'easy',
    synonyms: ['使用场景', '应用场景', '情境'],
    examples: [
      { id: 'e027', text: '先想清楚用户使用场景再做设计。', likes: 298, createdAt: Date.now() },
      { id: 'e028', text: '这个功能的使用场景是什么？别为了做功能而做功能。', likes: 245, createdAt: Date.now() }
    ]
  },
  {
    id: 't016',
    word: '打法',
    meaning: '做事情的方式方法、策略套路',
    deepMeaning: '源自军事用语，把做项目比作打仗。「有什么打法」=「有什么办法/策略」。「换个打法」=「之前的方法不行，换套路」',
    scenes: ['meeting', 'sales', 'report'],
    difficulty: 'easy',
    synonyms: ['策略', '方法', '套路'],
    examples: [
      { id: 'e029', text: '这个市场我们换个打法试试。', likes: 367, createdAt: Date.now() },
      { id: 'e030', text: '运营打法要灵活，不能太死板。', likes: 289, createdAt: Date.now() }
    ]
  },
  {
    id: 't017',
    word: '颗粒度',
    meaning: '事情的细致程度、拆分的精细度',
    deepMeaning: '颗粒度粗=不够细致、太笼统。颗粒度细=考虑周全、拆解得很细。老板说「颗粒度再细一点」=「你这个方案太虚了，说具体点」',
    scenes: ['meeting', 'report'],
    difficulty: 'medium',
    synonyms: ['细致程度', '精细度', '详细程度'],
    examples: [
      { id: 'e031', text: '这个任务的颗粒度再拆细一点，便于执行和跟踪。', likes: 345, createdAt: Date.now() },
      { id: 'e032', text: '数据报表的颗粒度不够，需要下钻到日维度。', likes: 267, createdAt: Date.now() }
    ]
  },
  {
    id: 't018',
    word: '迭代',
    meaning: '小步快跑、持续优化改进',
    deepMeaning: '「先上线再迭代」=「别追求完美，先搞出来再说，后面慢慢改」。这是互联网思维的核心：快速试错胜过完美计划。迭代次数多=一直在做事=有产出',
    scenes: ['meeting', 'report', 'review'],
    difficulty: 'easy',
    synonyms: ['优化', '升级', '版本更新'],
    examples: [
      { id: 'e033', text: '这个版本先上线，后续再迭代优化。', likes: 312, createdAt: Date.now() },
      { id: 'e034', text: '产品迭代要以用户反馈为导向。', likes: 234, createdAt: Date.now() }
    ]
  },
  {
    id: 't019',
    word: '痛点',
    meaning: '用户尚未被满足的、又迫切渴望被解决的需求',
    deepMeaning: '「找到痛点」=「找到用户愿意为之掏钱的理由」。伪痛点=用户嘴上说需要但实际不愿付钱。真痛点=不用活不了，必须有',
    scenes: ['meeting', 'sales', 'report', 'hiring'],
    difficulty: 'easy',
    synonyms: ['需求', '问题', '难处'],
    examples: [
      { id: 'e035', text: '我们要精准击中用户痛点。', likes: 278, createdAt: Date.now() },
      { id: 'e036', text: '痛点找不对，再努力也是白费。', likes: 223, createdAt: Date.now() }
    ]
  },
  {
    id: 't020',
    word: '天花板',
    meaning: '发展的上限、增长的极限',
    deepMeaning: '「这个赛道天花板不高」=「这个市场做不大，没前景」。「个人天花板」=「你也就这样了，再努力也上不去了」（委婉版）',
    scenes: ['meeting', 'report', 'hiring'],
    difficulty: 'medium',
    synonyms: ['上限', '极限', '瓶颈'],
    examples: [
      { id: 'e037', text: '这个细分市场的天花板不高，我们要考虑拓展边界。', likes: 423, createdAt: Date.now() },
      { id: 'e038', text: '产品增长遇到了天花板，需要寻找第二曲线。', likes: 356, createdAt: Date.now() }
    ]
  }
];
