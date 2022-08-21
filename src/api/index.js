// 统一封装接口方法
// 每个方法负责请求一个url地址
// 逻辑页面只要导入这个接口方法就能直接发起请求
// 优点: url地址的统一管理
import axios from '@/utils/request'

// 登录
// 使用axios发起请求,内部会自动把参数转换成JSON字符串发给后台
// 会自动携带请求参数(headers)里面的 Content-Type: 'application/json'
// 使用结构赋值{mobile, code}中 mobile和code 既是变量名又是赋给data中同名变量的值
export const loginAPi = ({ mobile, code }) => axios({
  url: '/v1_0/authorizations',
  method: 'POST',
  data: {
    mobile,
    code
  }
})

// 获取全部列表
// export const getAllChannnelsAPI = () => {
//   return axios ({
//     url: '/v1_0/channels',
//     method: 'GET'
//   })
// }
