<template>
  <div class="user-edit-container">
    <!-- Header 区域 -->
    <van-nav-bar title="编辑资料" left-arrow @click-left="$router.back()" fixed/>

    <!-- 用户资料 -->
    <van-cell-group class="action-card">
      <van-cell title="头像" is-link center>
        <template #default>
          <van-image round class="avatar" :src="$store.state.userPhoto" @click="iptClick"/>
          <!-- file 选择框 -->
          <input
            type="file"
            ref="iptFile"
            v-show="false"
            accept="image/*"
            @change="onFileChange"
          />
        </template>
      </van-cell>
      <van-cell title="名称" is-link :value="userProfile.name" @click="nameUpdate"/>
      <van-cell title="生日" is-link :value="userProfile.birthday" @click="birthdayUpdate"/>
    </van-cell-group>

    <!--  名称修改弹窗  -->
    <van-dialog v-model="show" title="标题" show-cancel-button :before-close="beforeCloseFn">
      <input type="text" v-fofo class="ipt" v-model="inputUserName">
    </van-dialog>

    <!--  日期修改弹窗  -->
    <van-popup v-model="popupShow" position="bottom" round :style="{ height: '50%' }">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择年月日"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="updateBir"
        @cancel="cancelFn"
      />
    </van-popup>

  </div>
</template>

<script>
import { updatePhotoAPI, updateProfilesAPI, userProfileInfoAPI } from '@/api'
import { Notify } from 'vant'
import { formatDate } from '@/utils/formatDate'
import { mapMutations } from 'vuex'

export default {
  data () {
    return {
      userProfile: {},
      show: false, // 控制姓名修改弹窗
      inputUserName: '',
      minDate: new Date(1920, 0, 1),  // 最小日期
      maxDate: new Date(2025, 11, 1), // 最大日期
      currentDate: '', // 当前日期
      popupShow: false,
    }
  },
  methods: {
    ...mapMutations(['SET_USERPHOTO']),
    // 文件选择发生改变
    async onFileChange (e) {
      if (e.target.files.length === 0) return  // 说明用户可能没有选择头像
      const theFd = new FormData() // 创建一个表单对象
      theFd.append('photo', e.target.files[0])  // 给表单对象添加一个键值对
      const res = await updatePhotoAPI(theFd)
      this.userProfile.photo = res.data.photo
    },
    // 模拟点击input type="file"事件，打开文件选择窗口
    iptClick () {
      this.$refs.iptFile.click()
    },
    // 修改姓名
    nameUpdate () {
      this.show = true
      this.inputUserName = this.userProfile.name
    },
    // 修改姓名 -- 关闭框 -- 关闭前的回调函数
    async beforeCloseFn (action, done) {
      if (action === 'confirm') { // 点击了确定
        const reg = /^[A-Za-z0-9\u4e00-\u9fa5]{1,7}$/
        if (reg.test(this.inputUserName) === true) {
          // 通过了校验
          // updateProfilesAPI 需要传一个对象，对象里面规定了属性
          // {name,gender,birthday,real_name,intro} 都是可选参数，有那个属性就传那个属性，没有的就不传
          await updateProfilesAPI({
            name: this.inputUserName
          })
          this.userProfile.name = this.inputUserName
          done()
        } else {
          // 没有通过校验
          Notify({ type: 'warning', message: '用户名输入有误' })
          done(false)
        }
      } else { // 点击了取消
        done() // 关闭弹出框
      }
    },
    // 修改生日
    birthdayUpdate () {
      this.popupShow = true
      // 获取当前时间，让日历弹出时显示用户信息中的生日
      // 注意：信息中的生日是字符串，我们要转换成日期对象
      this.currentDate = new Date(this.userProfile.birthday)
    },
    // 日期选择器--点击取消事件
    cancelFn () {
      this.popupShow = false
    },
    // 日期选择器--点击确定事件
    async updateBir () {
      // 后台需要的birthday的格式是 '年-月-日' 的字符串格式
      // const year = new Date (this.currentDate).getFullYear ()
      // const month = new Date (this.currentDate).getMonth () + 1
      // const day = new Date (this.currentDate).getDate ()
      // const dateStr = `${year}-${month}-${day}`

      this.popupShow = false
      await updateProfilesAPI({
        birthday: formatDate(this.currentDate)
      })
      this.userProfile.birthday = formatDate(this.currentDate)

    }
  },
  async activated () {
    const res = await userProfileInfoAPI()
    console.log(res)
    this.userProfile = res.data.data
    // this.$store.commit ('SET_USERPHOTO', 'this.userProfile.photo')
    this.SET_USERPHOTO(this.userProfile.photo)
  },
}
</script>

<style lang="less" scoped>
.van-nav-bar {
  background-color: #007bff;

  /deep/ .van-nav-bar__title {
    color: #fff;
  }

  /deep/ .van-icon {
    color: #fff;
  }
}

.user-edit-container {
  padding-top: 46px;

  .avatar {
    width: 50px;
    height: 50px;
  }
}

/deep/ .van-dialog__content {
  text-align: center;

  .ipt {
    text-align: center;
    outline: none;
    border: none;
  }
}
</style>
