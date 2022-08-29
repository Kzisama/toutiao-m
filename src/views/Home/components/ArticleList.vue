<template>
  <div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
        offset="50"
      >
        <ArticleItem
          v-for="obj in list" :key="obj.art_id"
          :artObj="obj"
          @dislikeEV="dislikeFn"
          @reportsEv="reportsFn"
          @click.native="itemClickFn(obj.art_id)">
        </ArticleItem>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import ArticleItem from '@/components/ArticleItem';
import {getAllArticleListAPI, dislikeArticleAPI, reportsArticleAPI} from '@/api';
import {Notify} from 'vant';

export default {
  props: {
    channelId: Number
  },
  components: {
    ArticleItem
  },
  data () {
    return {
      list: [],
      loading: false,  // 底部刷新状态
      finished: false,
      theTime: +new Date (),
      isLoading: false  // 顶部刷新状态
    }
  },
  created () {
    this.getArticleList ()
  },
  methods: {
    // 专门发请求
    async getArticleList () {
      const res = await getAllArticleListAPI (
        {
          channel_id: this.channelId,
          timestamp: this.theTime
        })
      console.log (res)
      this.list = [...this.list, ...res.data.data.results]
      this.theTime = res.data.data.pre_timestamp
      this.loading = false
      if (res.data.data.pre_timestamp === null) { // 数据请求完毕，没有更多数据
        this.finished = true
        return
      }
      this.isLoading = false
    },
    // 底部加载事件
    async onLoad () {
      // 双重保险，immediate-check 只是在内部组织了判断
      // 但是当从一个页面切换到另一个页面时,滚动条的位置可能不在顶部,但是他需要回到顶部,那么又触发了滚动事件,导致immediate-check的失效
      if (this.list.length === 0) {
        this.loading = false
        return
      }
      await this.getArticleList ()

    },
    // 顶部刷新事件
    async onRefresh () {
      this.list = []
      this.theTime = +new Date ()
      this.getArticleList ()
    },
    // 文章不感兴趣事件
    async dislikeFn (atrId) {
      await dislikeArticleAPI ({
        atrId
      })
      Notify ({type: 'success', message: '反馈成功'})
    },
    // 举报文章
    async reportsFn (id, value) {
      await reportsArticleAPI ({
        artId: id,
        type: value
      })
      Notify ({type: 'success', message: '举报成功'})
    },
    // 跳转到详情页
    itemClickFn (id) {
      this.$router.push ({
        path: `/detail?art_id=${id}`
      })
    }
  },
}
</script>

<style scoped>

</style>
