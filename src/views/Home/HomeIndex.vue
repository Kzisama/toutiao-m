<template>
  <div>
    <!--  头部  -->
    <van-nav-bar fixed>
      <template #left>
        <img class="logo" src="@/assets/logo.png" alt="">
      </template>
      <template v-slot:right>
        <!-- postcss 只能转换style标签内的样式，不能将行内样式里的px转换成rem，需要我们手动转换 -->
        <van-icon name="search" size="0.48rem" color="#fff" @click="moveToSearchFn"/>
      </template>
    </van-nav-bar>
    <!--  tab栏导航  -->
    <div class="main">
      <van-tabs v-model="channelId" animated sticky offset-top="1.226667rem">
        <van-tab v-for="obj in channelList" :key="obj.id"
                 :title="obj.name"
                 :name="obj.id"
        >
          <ArticleList :channelId="channelId"></ArticleList>
        </van-tab>
      </van-tabs>
      <!-- 编辑频道图标 -->
      <van-icon name="plus" size="0.37333334rem" class="moreChannels" @click="showPopup"/>
    </div>
    <!--  频道弹出层  -->
    <van-popup class="channel_popup" v-model="show" get-container="body">
      <ChannelEdit
        :userlist="channelList"
        :morelist="moreChannelList"
        @addChannelEV="addChannel"
        @delChannelEV="delChannel"
        @close="closeFn"
        ref="editRef"
        v-model="channelId">
        <!-- v-model会原地调用@input事件,并将绑定的值传过去 -->
      </ChannelEdit>
    </van-popup>
  </div>
</template>

<script>
import {getAllChannelsAPI, getAllUserChannelAPI, updateChannelAPI, deleteChannelAPI} from '@/api';
import ArticleList from '@/views/Home/components/ArticleList';
import ChannelEdit from '@/views/Home/ChannelEdit';

export default {
  name: 'Index',
  components: {
    ArticleList,
    ChannelEdit,
    deleteChannelAPI
  },
  data () {
    return {
      channelId: 0,
      channelList: [], // 用户频道列表
      allChannelList: [],
      // articleList: [] // 文章列表
      show: false
    };
  },
  computed: {
    moreChannelList () {  // 更多频道  (所有频道-用户频道)
      // 遍历所有频道里的元素,去用户频道找查找,如果没有就添加到新数组中
      const newArr = this.allChannelList.filter (bigObj => {
        let index = this.channelList.findIndex (smallObj => {
          return smallObj.id === bigObj.id
        })
        // index === -1 返回false,说明用户频道里没有,那么就可以添加到新数组中
        // index !== -1 返回true,说明用户频道里有,那么就不可以
        return index === -1;
      })
      return newArr
    }
  },
  methods: {
    showPopup () {
      this.show = true;
    },
    // 将点击的频道加入到用户频道中
    // 子传父,将传递过来的对象添加到用户频道数组中
    async addChannel (addObj) {
      this.channelList.push (addObj)
      let newArr = this.channelList.filter (item => item.id !== 0)
      let theNewArr = newArr.map ((item, index) => {
        const newObj = {...item}
        delete newObj.name
        newObj.seq = index
        return newObj
      })
      await updateChannelAPI ({
        channels: theNewArr
      })
    },
    // 删除用户频道
    async delChannel (delObj) {
      let index = this.channelList.findIndex ((item, index) => item.id === delObj.id)
      this.channelList.splice (index, 1)
      await deleteChannelAPI ({
        channelId: delObj.id
      })
    },
    // 关闭弹出层
    closeFn () {
      this.show = false
      // 回归初始编辑状态
      this.$refs.editRef.isEdit = false
    },
    // 跳转到搜索页面
    moveToSearchFn () {
      this.$router.push ('/search')
    }
  },
  async created () {
    // 获取频道列表
    const res = await getAllUserChannelAPI ()
    this.channelList = res.data.data.channels

    // 获取所有频道
    const res2 = await getAllChannelsAPI ()
    this.allChannelList = res2.data.data.channels

    console.log (this.moreChannelList)
  }
}
</script>

<style scoped>
/deep/ .van-nav-bar__content {
  background-color: #007bff;
}

.logo {
  width: 100px;
  height: 30px;
}

.main {
  padding-top: 46px;
}

/deep/ .van-tabs__line {
  background-color: #007bff;
}

/*设置装图标的盒子的样式*/
/deep/ .van-tabs__wrap {
  padding-right: 30px;
  background-color: #fff;
}

/*设置图标本身的样式*/
.moreChannels {
  position: fixed;
  top: 62px;
  right: 8px;
  z-index: 999;
}

.channel_popup {
  width: 100vw;
  height: 100vh;
}
</style>
