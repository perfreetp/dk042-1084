export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/scenario/index',
    'pages/mistakes/index',
    'pages/terms/index',
    'pages/profile/index',
    'pages/level-detail/index',
    'pages/quiz/index',
    'pages/term-detail/index',
    'pages/ranking/index',
    'pages/stage-test/index',
    'pages/achievement/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#6366F1',
    navigationBarTitleText: '黑话闯关',
    navigationBarTextStyle: 'white'
  },
  tabBar: {
    color: '#94A3B8',
    selectedColor: '#6366F1',
    backgroundColor: '#ffffff',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '闯关'
      },
      {
        pagePath: 'pages/scenario/index',
        text: '场景'
      },
      {
        pagePath: 'pages/mistakes/index',
        text: '错题本'
      },
      {
        pagePath: 'pages/terms/index',
        text: '词条'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的'
      }
    ]
  }
})
