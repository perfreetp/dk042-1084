import type { Question } from '@/types';

export const questionsData: Question[] = [
  {
    id: 'q001',
    type: 'meaning',
    scene: 'meeting',
    difficulty: 'easy',
    title: '在项目启动会上，主管说「我们先对齐一下颗粒度」，这里的「颗粒度」最可能是什么意思？',
    options: [
      { key: 'A', text: '项目的预算分配比例' },
      { key: 'B', text: '工作的细致程度和职责边界' },
      { key: 'C', text: '团队成员的绩效考核标准' },
      { key: 'D', text: '项目的时间节点规划' }
    ],
    answer: 'B',
    explanation: '「颗粒度」指的是事情的细致程度、拆分的精细度。对齐颗粒度就是确认双方对工作的理解程度一致，避免你做的太粗我做的太细，或者职责边界不清。本质是在做预期管理和权责划分。',
    relatedTermId: 't017',
    timeLimit: 30,
    points: 10
  },
  {
    id: 'q002',
    type: 'intent',
    scene: 'meeting',
    difficulty: 'medium',
    title: '周会上老板听完汇报后说：「嗯……这个方案先放一放吧。」老板最真实的想法是？',
    context: '背景：你花了两周做了一个新产品方案，周会汇报时老板全程没怎么说话，最后只说了这句话。',
    options: [
      { key: 'A', text: '老板觉得方案不错，等时机成熟再启动' },
      { key: 'B', text: '老板可能不认可，需要你重新调整思路，短期内别再提了' },
      { key: 'C', text: '老板太忙了，等他有空再看' },
      { key: 'D', text: '方案需要补充更多数据支撑' }
    ],
    answer: 'B',
    explanation: '老板说「先放一放」通常是委婉的否定。如果真的只是时机问题，一般会给出具体的等待时间或者补充方向。「先放一放」翻译成人话就是「我不太看好，你自己领会，别让我当面驳回你」。建议你重新思考方案的可行性。',
    timeLimit: 45,
    points: 15
  },
  {
    id: 'q003',
    type: 'rewrite',
    scene: 'report',
    difficulty: 'medium',
    title: '你要向领导汇报「用户留存做得不好」，以下哪种表达最专业、最有黑话水平？',
    options: [
      { key: 'A', text: '用户留不住，很多人用了一次就走了' },
      { key: 'B', text: '目前我们的用户留存数据表现不佳，存在较大提升空间' },
      { key: 'C', text: '以用户生命周期管理为抓手，核心链路的留存转化闭环尚未有效打通，需通过精细化运营手段完成次留、七留等关键指标的体系化提升' },
      { key: 'D', text: '流失率太高了，需要想办法改善' }
    ],
    answer: 'C',
    explanation: '选项C使用了「抓手」「闭环」「链路」「精细化运营」「体系化」等多个高频黑话，同时将问题描述转化为方法论导向的解决方案表述，是标准的大厂汇报风格。ABD都太直白，缺乏「专业感」。',
    relatedTermId: 't003',
    timeLimit: 40,
    points: 15
  },
  {
    id: 'q004',
    type: 'meaning',
    scene: 'report',
    difficulty: 'easy',
    title: '汇报时说「我们要找好业务的抓手」，这里的「抓手」意思是？',
    options: [
      { key: 'A', text: '业务的具体操作工具' },
      { key: 'B', text: '具体可执行的切入点和突破口' },
      { key: 'C', text: '业务的核心指标' },
      { key: 'D', text: '负责该业务的负责人' }
    ],
    answer: 'B',
    explanation: '「抓手」是汇报高频词，指的是把抽象目标变成具体可落地的事情。老板说「找个抓手」=「别跟我讲虚的，告诉我先做什么具体的事」。',
    relatedTermId: 't003',
    timeLimit: 25,
    points: 10
  },
  {
    id: 'q005',
    type: 'meaning',
    scene: 'sales',
    difficulty: 'easy',
    title: '销售总监说「我们要提升用户心智」，「心智」在这里指？',
    options: [
      { key: 'A', text: '用户的智力水平和理解能力' },
      { key: 'B', text: '用户对品牌/产品的认知和印象' },
      { key: 'C', text: '用户的消费心理和习惯' },
      { key: 'D', text: '用户的心理年龄层' }
    ],
    answer: 'B',
    explanation: '「心智」源自心理学，在营销语境中就是「用户想到某个品类时第一个想到你」。占领用户心智≈建立品牌认知，让用户买东西先想到你。',
    relatedTermId: 't009',
    timeLimit: 25,
    points: 10
  },
  {
    id: 'q006',
    type: 'intent',
    scene: 'hiring',
    difficulty: 'hard',
    title: '面试官说：「我们是一个很有活力的团队，工作节奏比较快，需要抗压能力强的同学。」他最可能在暗示什么？',
    context: '背景：你在面试互联网公司运营岗，聊到团队氛围时面试官说了这番话，表情意味深长。',
    options: [
      { key: 'A', text: '团队年轻化，氛围轻松愉快' },
      { key: 'B', text: '经常加班，工作压力大，需要做好996的心理准备' },
      { key: 'C', text: '团队经常组织团建活动' },
      { key: 'D', text: '公司发展快，晋升机会多' }
    ],
    answer: 'B',
    explanation: '面试黑话翻译：「有活力」= 年轻人多（好忽悠），「节奏快」= 经常加班（或者需求变来变去），「抗压能力强」= 能接受996/007不出声。这是招聘中委婉表达工作强度大的标准话术。',
    timeLimit: 50,
    points: 20
  },
  {
    id: 'q007',
    type: 'rewrite',
    scene: 'review',
    difficulty: 'hard',
    title: '项目复盘会上你要承认「这个需求是我没考虑周全导致延期了」，哪种说法最能保护自己又显得专业？',
    options: [
      { key: 'A', text: '对不起，是我的问题，我考虑不周，下次一定改' },
      { key: 'B', text: '这个项目延期主要是因为前期需求调研不够充分，当然我也有责任' },
      { key: 'C', text: '从复盘视角看，本次项目在需求端的前置性风险预判机制尚有优化空间，多维度信息输入的对齐颗粒度未达预期，导致了后续链路的节奏偏差。我这边已在沉淀相关方法论，后续会引入二次确认机制规避类' },
      { key: 'D', text: '这个延期不能全怪我，产品那边需求也改了好几次' }
    ],
    answer: 'C',
    explanation: '选项C使用了复盘场景下的全套黑话组合拳：「复盘视角」「前置性风险预判」「对齐颗粒度」「链路的节奏偏差」「沉淀方法论」「机制规避」。既承认了问题，又把个人失误上升为流程机制问题，显得有思考有改进方案，还不显得是你一个人的锅。',
    relatedTermId: 't005',
    timeLimit: 60,
    points: 25
  },
  {
    id: 'q008',
    type: 'meaning',
    scene: 'review',
    difficulty: 'easy',
    title: '项目结束后领导说「大家一起复盘一下」，「复盘」最准确的意思是？',
    options: [
      { key: 'A', text: '开个庆功会总结经验' },
      { key: 'B', text: '回顾项目全过程，分析每一步决策和结果，沉淀经验教训' },
      { key: 'C', text: '检查项目的最终交付物' },
      { key: 'D', text: '讨论下一个项目的计划' }
    ],
    answer: 'B',
    explanation: '复盘不是简单总结，而是推演全过程：为什么这么做决策、结果是否符合预期、下次如何改进。做好了是为了「可复制」，做砸了是为了「避坑和甩锅」。',
    relatedTermId: 't005',
    timeLimit: 25,
    points: 10
  },
  {
    id: 'q009',
    type: 'intent',
    scene: 'report',
    difficulty: 'medium',
    title: '你在汇报工作，领导打断你说：「你先给我顶层设计层面的东西，别上来就讲细节。」领导想表达的真实意思是？',
    context: '背景：你正在汇报一个新项目方案，刚讲到第一个具体功能点就被领导打断了。',
    options: [
      { key: 'A', text: '你的方案缺乏系统性思考，先讲清楚大方向、整体框架和核心逻辑' },
      { key: 'B', text: '细节太多太啰嗦了，挑重点说' },
      { key: 'C', text: '他对你的方案没兴趣，想快点结束' },
      { key: 'D', text: '你的方案太复杂了，需要简化' }
    ],
    answer: 'A',
    explanation: '「顶层设计」是老板批评下属方案的常用词，潜台词：你现在的方案太零散，只见树木不见森林。要先讲清楚：做什么（方向）、为什么做（战略价值）、怎么做（整体路径），再讲具体做什么（功能细节）。',
    relatedTermId: 't006',
    timeLimit: 40,
    points: 15
  },
  {
    id: 'q010',
    type: 'meaning',
    scene: 'meeting',
    difficulty: 'medium',
    title: '同事说「这个项目的ROI不高」，他最可能想表达什么？',
    options: [
      { key: 'A', text: '项目的技术难度太大' },
      { key: 'B', text: '投入产出比太低，不值得做或需要重新评估' },
      { key: 'C', text: '项目的用户参与度不高' },
      { key: 'D', text: '项目的回报率还可以再高一点' }
    ],
    answer: 'B',
    explanation: 'ROI是Return On Investment（投入产出比）。说ROI不高=投入的资源（钱/人力/时间）和预期回报不成比例。这句话的杀伤力很大，因为低ROI的项目随时可能被砍掉。',
    relatedTermId: 't010',
    timeLimit: 30,
    points: 15
  },
  {
    id: 'q011',
    type: 'meaning',
    scene: 'meeting',
    difficulty: 'medium',
    title: '「形成业务闭环」这句话中的「闭环」最准确的意思是？',
    options: [
      { key: 'A', text: '项目已经结束了' },
      { key: 'B', text: '从输入到输出再到反馈的完整流程，每个环节都有跟踪和承接' },
      { key: 'C', text: '责任划分明确，不会出问题' },
      { key: 'D', text: '业务流程自动化，不需要人工干预' }
    ],
    answer: 'B',
    explanation: '闭环指一个完整的、有始有终的流程。比如用户从注册→使用→付费→复购，每个环节都有对应的产品机制和运营策略承接，并且能收集到反馈反哺优化，这就叫形成了转化闭环。',
    relatedTermId: 't004',
    timeLimit: 30,
    points: 15
  },
  {
    id: 'q012',
    type: 'intent',
    scene: 'hiring',
    difficulty: 'medium',
    title: 'HR在招聘JD中写「扁平化管理，弹性工作制」，最真实的含义是？',
    context: '背景：你在看一份创业公司的招聘信息，福利待遇一栏写了这些。',
    options: [
      { key: 'A', text: '公司层级少，沟通效率高，上下班时间灵活自由' },
      { key: 'B', text: '没有大公司那么多条条框框，想什么时候上班都行' },
      { key: 'C', text: '「扁平化」= 没有明确晋升通道，老板直接管你；「弹性工作制」= 随时加班，下班了也得回消息' },
      { key: 'D', text: '公司不打卡，管理人性化' }
    ],
    answer: 'C',
    explanation: '招聘黑话翻译：「扁平化管理」= 小公司层级少但也意味着晋升空间有限，以及老板直接管到你；「弹性工作制」= 上班不打卡但下班也没点，周末回消息是基本操作。这些都是创业公司的「常规操作」。',
    timeLimit: 45,
    points: 20
  },
  {
    id: 'q013',
    type: 'rewrite',
    scene: 'report',
    difficulty: 'medium',
    title: '「我们发现很多用户用了一次就不用了」这句话，用黑话包装后最恰当的是？',
    options: [
      { key: 'A', text: '用户流失问题比较严重，需要重视' },
      { key: 'B', text: '用户次留指标承压，说明我们的核心价值主张尚未有效击穿目标用户心智，建议从场景化触达和Aha Moment优化为抓手，系统性提升用户首次体验的获得感' },
      { key: 'C', text: '很多用户觉得产品不好用，用了一次就走了' },
      { key: 'D', text: '用户留存率偏低，需要加强用户运营' }
    ],
    answer: 'B',
    explanation: '选项B完美体现了黑话的精髓：用「次留指标承压」替代「流失严重」，用「价值主张击穿心智」替代「觉得不好用」，用「场景化触达」「Aha Moment」「抓手」「获得感」等词汇显得很有方法论。最关键的是，它不仅提出问题，还给出了方向（虽然也是虚的），这就是汇报的艺术。',
    timeLimit: 50,
    points: 20
  },
  {
    id: 'q014',
    type: 'meaning',
    scene: 'meeting',
    difficulty: 'hard',
    title: '「我们要建立护城河」中的「护城河」在商业语境下指什么？',
    options: [
      { key: 'A', text: '公司的安全合规体系' },
      { key: 'B', text: '企业的竞争壁垒和核心优势，让竞争对手难以进入和模仿' },
      { key: 'C', text: '公司的财务储备和现金流' },
      { key: 'D', text: '产品的技术架构和基础设施' }
    ],
    answer: 'B',
    explanation: '护城河源自巴菲特的投资理论，比喻让竞争对手难以进入的壁垒。常见的护城河包括：技术专利、网络效应、规模效应、品牌、转换成本、数据壁垒等。老板问「我们的护城河是什么」=「我们靠什么不被干掉？」',
    relatedTermId: 't011',
    timeLimit: 35,
    points: 20
  },
  {
    id: 'q015',
    type: 'intent',
    scene: 'sales',
    difficulty: 'medium',
    title: '客户说：「你们的方案整体不错，我们内部再讨论一下。」这个客户的真实状态最可能是？',
    context: '背景：你跟了这个客户一个月，演示了三次产品，今天终于把完整方案报过去了。客户在电话里这么对你说。',
    options: [
      { key: 'A', text: '客户很感兴趣，已经进入内部审批流程了' },
      { key: 'B', text: '大概率是委婉拒绝，或者暂时没有预算/优先级不够。需要主动跟进判断真实阻力，不要被动等' },
      { key: 'C', text: '客户内部意见不统一，需要你帮忙说服' },
      { key: 'D', text: '方案还需要再完善细节，等待客户反馈' }
    ],
    answer: 'B',
    explanation: '销售黑话翻译：「内部讨论一下」是排名第一的婉拒话术。如果客户真的想买，通常会主动告诉你「我们下周走流程，你准备好合同」，或者抛出具体问题（价格、对接、售后等）。遇到这句话需要主动探测真实原因：是预算问题？还是有竞品？还是决策人没搞定？',
    timeLimit: 45,
    points: 20
  },
  {
    id: 'q016',
    type: 'meaning',
    scene: 'meeting',
    difficulty: 'easy',
    title: '「大家的意见先拉通对齐一下」中的「拉通对齐」是什么意思？',
    options: [
      { key: 'A', text: '把所有人拉到同一个群里' },
      { key: 'B', text: '相关方信息同步、达成共识、统一口径' },
      { key: 'C', text: '按照职位高低排序发言' },
      { key: 'D', text: '把大家的意见整理成文档' }
    ],
    answer: 'B',
    explanation: '「拉通」=把相关人员召集起来（可以是开会、建群、单独沟通），「对齐」=大家信息同步、认知一致。拉通对齐=先把信息搞对称了再做事，免得各干各的。这是互联网最高频的动词组合之一。',
    relatedTermId: 't008',
    timeLimit: 20,
    points: 10
  },
  {
    id: 'q017',
    type: 'rewrite',
    scene: 'meeting',
    difficulty: 'hard',
    title: '你想表达「这个想法不切实际，做起来很难落地」，以下哪种黑话表达既专业又不得罪人？',
    options: [
      { key: 'A', text: '这个想法太天马行空了，根本做不了' },
      { key: 'B', text: '这个方向在当前阶段的落地可行性还有待论证，建议我们先做小规模MVP验证核心假设，同时评估下技术实现的复杂度和资源投入的ROI，再决定是否推进' },
      { key: 'C', text: '这个想法挺好的，但是我们资源不够' },
      { key: 'D', text: '我觉得这个想法不太靠谱' }
    ],
    answer: 'B',
    explanation: '选项B的精髓：①用「落地可行性有待论证」替代「不切实际」（不是你想法烂，是需要论证）②用「MVP验证假设」（你看我不是反对，是建议用科学方法）③最后用「ROI」压阵（投入产出算一算，大家就懂了）。既表达了反对意见，又显得你专业理性。',
    timeLimit: 55,
    points: 25
  },
  {
    id: 'q018',
    type: 'meaning',
    scene: 'review',
    difficulty: 'medium',
    title: '「把经验沉淀下来」中的「沉淀」是什么意思？',
    options: [
      { key: 'A', text: '把项目文档归档到共享盘' },
      { key: 'B', text: '积累和固化经验、方法论、流程、模板等，形成可复用的团队资产' },
      { key: 'C', text: '让团队成员记住这次教训' },
      { key: 'D', text: '把项目总结发邮件给所有人' }
    ],
    answer: 'B',
    explanation: '沉淀不是简单的存档，而是把个人经验变成团队资产。比如：踩过的坑整理成避坑指南、成功的方法变成SOP、好的设计做成组件库。沉淀做得好的团队，新人进来一周就能上手；做得差的，每次都是重新发明轮子。',
    relatedTermId: 't013',
    timeLimit: 30,
    points: 15
  },
  {
    id: 'q019',
    type: 'intent',
    scene: 'hiring',
    difficulty: 'easy',
    title: '面试最后，面试官说「今天先到这里，后续HR会联系你」，通常意味着？',
    options: [
      { key: 'A', text: '肯定通过了，等offer就行' },
      { key: 'B', text: '大概率没通过。如果表现好通常会当场告诉你下一轮安排或薪资期望' },
      { key: 'C', text: '面试流程就是这样，别多想' },
      { key: 'D', text: '需要和其他候选人对比，结果不确定' }
    ],
    answer: 'B',
    explanation: '面试黑话翻译：如果对你满意，面试官通常会继续聊「你的期望薪资」「最快什么时候入职」「我们还有XX面大概在下周」等。只说「HR联系你」然后就没后续信息，基本等于婉拒。当然也有例外，但大概率是没通过。',
    timeLimit: 25,
    points: 10
  },
  {
    id: 'q020',
    type: 'meaning',
    scene: 'meeting',
    difficulty: 'hard',
    title: '「我们需要对传统模式进行降维打击」中的「降维打击」是什么意思？',
    options: [
      { key: 'A', text: '降低产品成本，用价格战抢占市场' },
      { key: 'B', text: '用更高维度的优势（技术、模式、资源等）去碾压传统竞争对手' },
      { key: 'C', text: '简化产品功能，降低使用门槛' },
      { key: 'D', text: '下沉到低线城市市场' }
    ],
    answer: 'B',
    explanation: '「降维打击」出自《三体》，原本是把三维空间降到二维。商业语境中，意思是你拥有的优势是对手根本无法理解和学习的（比如你有AI能力对手连技术团队都没有，或者你有生态资源对手只是单一产品），这种碾压式的竞争优势就叫降维打击。',
    relatedTermId: 't012',
    timeLimit: 35,
    points: 20
  }
];
