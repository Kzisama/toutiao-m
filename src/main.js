import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 全局样式
import '@/style/index.less'

// rem适配
import 'amfe-flexible'
import 'postcss-pxtorem'

import { NavBar, Form, Field, Button } from 'vant'

Vue.use(NavBar)
Vue.use(Form)
Vue.use(Field)
Vue.use(Button)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
