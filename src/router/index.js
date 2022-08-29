import Vue from 'vue'
import VueRouter from 'vue-router'
import {getToken} from '@/utils/token';
// import Login from '@/views/Login/LoginIndex'
// import Layout from '@/views/Layout/LayoutIndex'
// import Home from '@/views/Home/HomeIndex'
// import User from '@/views/User/UserIndex'
// import Search from '@/views/Search/SearchIndex'
// import SearchResult from '@/views/Search/SearchResult';
// import ArticleDetail from '@/views/ArticleDetail/ArticleDetail';
// import UserEdit from '@/views/User/UserEdit';
// import ChatIndex from '@/views/Chat/ChatIndex';

// 路由懒加载：为了让第一个页面加载的 js文件小一些，网页打开的速度快一些
// 思路: 把组件对应的js,分成若干个js文件,路由切换到那个页面,才去加载对应的js
// 原因: webpack分析入口时，发现router里面一开始就import了所有js文件，导致app.js很大
// 解决: 当路由路径匹配规则时,采取import引入相对应的文件

Vue.use (VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/layout/home'
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "Login" */ '@/views/Login/LoginIndex'),
    // 独享路由守卫
    beforeEnter: (to, from, next) => {
      if (getToken ()?.length > 0 && to.path === '/login') {
        // next (false)
        next ('/layout/home')  //不想留在原地，而是跳转到首页

      } else {
        next ()
      }
    }
  },
  {
    path: '/layout',
    component: () => import(/* webpackChunkName: "Layout" */ '@/views/Layout/LayoutIndex'),
    children: [
      {
        path: 'home',
        component: () => import(/* webpackChunkName: "Home" */ '@/views/Home/HomeIndex')
      },
      {
        path: 'user',
        component: () => import(/* webpackChunkName: "User" */ '@/views/User/UserIndex')
      }
    ]
  },
  {
    path: '/search',
    component: () => import(/* webpackChunkName: "Search" */ '@/views/Search/SearchIndex')
  },
  { // 搜索结果
    path: '/search_result/:kw',
    component: () => import(/* webpackChunkName: "SearchResult" */ '@/views/Search/SearchResult')
  },
  { // 文章详情
    path: '/detail',
    component: () => import(/* webpackChunkName: "Detail" */ '@/views/ArticleDetail/ArticleDetail')
  },
  { // 用户编辑
    path: '/user_edit',
    component: () => import(/* webpackChunkName: "UserEdit" */ '@/views/User/UserEdit')
  },
  { // 小思同学
    path: '/chat',
    component: () => import(/* webpackChunkName: "Chat" */ '@/views/Chat/ChatIndex')
  }
]

const router = new VueRouter ({
  routes
})

// 全局前置路由守卫
// router.beforeEach ((to, from, next) => {
//   // 如果有token，并且要跳转到登录页，那么就会拦截
//   if (getToken ()?.length > 0 && to.path === '/login') {
//      next (false)  不想留在原地，而是跳转到首页
//      next ('/layout')
//   } else {
//     next ()
//   }
//
// })

export default router
