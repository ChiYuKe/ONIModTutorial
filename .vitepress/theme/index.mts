// .vitepress/theme/index.mts
import DefaultTheme from 'vitepress/theme'
import './custom.css' // 这里的引入才是有效的
// @ts-ignore
import Contributors from './components/Contributors.vue'
import SteamNews from './components/SteamNews.vue'
import LearningTimeline from './components/LearningTimeline.vue'
import WorkshopList from './components/WorkshopList.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }: any) {
      app.component('Contributors', Contributors)
      app.component('SteamNews', SteamNews)
      app.component('LearningTimeline', LearningTimeline)
      app.component('WorkshopList', WorkshopList)
    }

}