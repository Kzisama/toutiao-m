<template>
  <div>
    <van-nav-bar background-color='blue' title="黑马头条-登录"/>
    <div>
      <van-form @submit="onSubmit">
        <van-field
          v-model="user.mobile"
          required
          name="mobile"
          label="手机号"
          placeholder="请输入11位手机号"
          :rules="[{ required: true, pattern:/^1[3-9]\d{9}$/,message: '请填写正确手机号' }]"
        />
        <van-field
          v-model="user.code"
          required
          type="password"
          name="code"
          label="密码"
          placeholder="请输入6位密码"
          :rules="[{ required: true,pattern:/\d{6}$/, message: '请填写正确密码' }]"
        />
        <div style="margin: 16px;">
          <van-button round block
                      :loading="isLoading"
                      :disabled="isLoading"
                      loading-text="登陆中..."
                      type="info"
                      native-type="submit">提交
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import { loginAPi } from '@/api'
import { setToken } from '@/utils/token'
import { Notify } from 'vant'

export default {
  data () {
    return {
      user: {
        mobile: '13888888888',
        code: '246810' // 后台规定死了只能是 246810
      },
      isLoading: false
    }
  },
  methods: {
    async onSubmit (values) {
      // 发送请求时,状态改变,按钮禁用
      this.isLoading = true
      // value 收集表单信息(参数名和值)
      // console.log ('submit', values);
      try {
        const res = await loginAPi(this.user)
        console.log(res)
        // 成功通知
        Notify({ type: 'success', message: '登录成功' })
        setToken(res.data.data.token)
      } catch (err) {
        // Promise内ajax抛出错误,直接进入catch
        Notify({ type: 'danger', message: '手机号或密码有误' })
      }
      // 请求发送完毕,无论成功还是不成功都将按钮恢复
      this.isLoading = false
    }
  }
}
</script>

<style scoped>
.van-nav-bar {
  background-color: #007bff;
}

/* /deep/ 会把属性选择器放在元素前面 (用后代选择器的方式来向内查找匹配的类名) */
/* 想要修改组件内部元素的样式,如果使用了scoped,就在标签前面加上 /deep/ 即可 */

/deep/ .van-nav-bar__title {
  color: #fff;
}

</style>
