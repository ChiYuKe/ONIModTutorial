// .vitepress/theme/index.mts
import DefaultTheme from 'vitepress/theme'
import './custom.css' // 这里的引入才是有效的
// @ts-ignore
import Contributors from './components/Contributors.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }: any) {
      app.component('Contributors', Contributors)
    }

}