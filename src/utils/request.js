// 基于axios封装网络请求
// 每个程序员的想法都不一样, 封装的地方和名字都不一样, 但是思想相同
import theAxios from 'axios'
import {Notify} from 'vant';
import router from '@/router';
import {getToken, removeToken, setToken} from '@/utils/token';
import {getNewTokenAPI} from '@/api';

const axios = theAxios.create ({
  baseURL: 'http://geek.itheima.net',
  timeout: 20000 // 20秒超时时间(请求20秒无响应直接判定超时)
})

// 添加请求拦截器
axios.interceptors.request.use (function (config) {
  // http响应码为 2xx 3xx 就算响应成功，进入这里
  // 在发送请求之前做些什么
  // 统一携带token
  // 判断本地是否有token,再判断/api/index.js里有没有携带Authorization属性,再添加
  // ?. 可选链操作符 如果 getToken()有值再调用length获取长度
  // console.log (config)
  if (getToken ()?.length > 0 && config.headers.Authorization === undefined) {
    config.headers.Authorization = `Bearer ${getToken ()}`
  }
  return config;
}, function (error) {
  // http响应码为 4xx 5xx 就算响应失败，进入这里
  // 对请求错误做些什么
  console.log (error)
  return Promise.reject (error);
});

// 添加响应拦截器
axios.interceptors.response.use (function (response) {
  // 对响应数据做点什么
  return response;
}, async function (error) {
  // 对响应错误做点什么
  // 只有响应码为401时，说明身份认证过期，需要跳转到登录页面
  console.log (error)
  // console.log (this)   // undefined
  if (error.response.status === 401) {
    // 这里不能是用this.$router  (因为这里的this不是vue组件对象，无法调用$router)
    // 解决：在上面引入@/router文件下的router对象
    // Notify ({type: 'warning', message: '身份已过期'})
    // 清空token，让路由守卫失效
    removeToken ()

    // 方式1：清空token，跳转到登录，用户有感知，体验不好
    // router.replace ('/login')

    // 方式2：替换token，用js的方式实现
    const res = await getNewTokenAPI ()
    setToken (res.data.data.token)  // 更新token
    error.config.headers.Authorization = `Bearer ${res.data.data.token}`
    return axios (error.config) // 重新发起未完成的请求   error.config就是上次未完成的请求配置
    // 我们还是要返回一个Promise对象到逻辑页面中调用的地方，所以需要return
  } else if (error.response.status === 500 && error.response.config.url === '/v1_0/authorizations' && error.response.config.method === 'put') {
    localStorage.clear ()
    // 说明是refresh_token也过期了，只能重新跳转到登陆页面
    Notify ({type: 'warning', message: '身份已过期'})
    await router.replace ('/login')
  }
  return Promise.reject (error);
});

export default ({url, method = 'GET', params = {}, data = {}, headers = {}}) => {
  return axios ({
    url,
    method,
    params,
    data,
    headers
  })
}
//   return new Promise((resolve, reject) => {
//     // 判断如果params有值, 需要自己写js代码, 把params对象里key和value拼接到url上
//     $.ajax({
//       url,
//       data,
//       headers,
//       type: method,
//       success: (res) => {
//         resolve(res)
//       },
//       error: err => {
//         reject(err)
//       }
//     })
//   })

// 但是上面有局限性
// 导出的axios方法在使用时
/*
// 我在逻辑页面调用时, 传入的这5个配置名字
    axios({
        url: '请求地址',
        method: '请求方式',
        params: {},
        data: {},
        headers: {}
    })
*/
// 问题来了, 万一将来我要更新request.js里封装网络请求的工具
// 把axios换成jquery的$.ajax
// import $ from 'jquery'
// export default $.ajax
/*
 $.ajax({
    url: '请求地址',
    type: '请求方式',
    data: {}, // 没有params
    headers: {}
 })
*/
