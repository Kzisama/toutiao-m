// 设置管理token的方法
const key = 'geek-itheima'

export const setToken = token => {
  localStorage.setItem(key, token)
}

export const getToken = () => localStorage.getItem(key)

export const removeToken = () => {
  localStorage.removeItem(key)
}
