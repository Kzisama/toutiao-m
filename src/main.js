import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 全局样式
import '@/style/index.less'

// rem适配
import 'amfe-flexible'
import 'postcss-pxtorem'

import {
  NavBar,
  Form,
  Field,
  Button,
  Tabbar,
  TabbarItem,
  Icon,
  Tabs,
  Tab,
  Cell,
  List,
  PullRefresh,
  ActionSheet,
  Popup,
  Row,
  Col,
  Badge,
  Search,
  Divider,
  Tag,
  CellGroup,
  Image,
  Dialog,
  DatetimePicker,
} from 'vant'

Vue.use (DatetimePicker);
Vue.use (Dialog);
Vue.use (NavBar);
Vue.use (Form);
Vue.use (Field);
Vue.use (Button);
Vue.use (Tabbar);
Vue.use (TabbarItem);
Vue.use (Icon);
Vue.use (Tab);
Vue.use (Tabs);
Vue.use (Cell);
Vue.use (List);
Vue.use (PullRefresh);
Vue.use (ActionSheet);
Vue.use (Popup);
Vue.use (Badge);
Vue.use (Row);
Vue.use (Col);
Vue.use (Search);
Vue.use (Divider);
Vue.use (Tag);
Vue.use (CellGroup);
Vue.use (Image)


// 封装一个中间件函数
let directiveObj = {
  install (Vue) {
    Vue.directive ('fofo', {
      inserted (el) { // 元素被插入到真实DOM中时触发，如果用 display:none 隐藏了，那么再显示的时候就不会触发
        // 指令的根标签是div，而input是在内部
        // el可能是div 也可能是一个input或者textarea
        // 使用原生DOM操作获取到标签名
        if (el.nodeName === 'INPUT' || el.nodeName === 'TEXTAREA') { // 说明这个节点本身就是输入框
          el.focus ()
        } else { // 尝试在内部寻找一下输入框
          let theInput = el.querySelector ('input')
          let theTextArea = el.querySelector ('textarea')
          if (theInput) theInput.focus ()
          if (theTextArea) theTextArea.focus ()
        }
      },
      update (el) { // 元素更新时显示
        if (el.nodeName === 'INPUT' || el.nodeName === 'TEXTAREA') { // 说明这个节点本身就是输入框
          el.focus ()
        } else { // 尝试在内部寻找一下输入框
          let theInput = el.querySelector ('input')
          let theTextArea = el.querySelector ('textarea')
          if (theInput) theInput.focus ()
          if (theTextArea) theTextArea.focus ()
        }
      }
    })
  }
}
Vue.use (directiveObj)


Vue.config.productionTip = false

new Vue ({
  router,
  store,
  render: h => h (App)
}).$mount ('#app')
