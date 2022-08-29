<template>
  <div>
    <!-- 搜索结果页-头部导航 -->
    <div class="search-result-container">
      <!-- 点击实现后退效果 -->
      <van-nav-bar
        title="搜索结果"
        left-arrow
        @click-left="$router.go(-1)"
        fixed
      />
    </div>
    <!--  文章列表  -->
    <div>
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <ArticleItem
          v-for="obj in articleList" :key="obj.art_id" :isShow="false"
          :artObj="obj" @click.native="itemClickFn(obj.art_id)">
        </ArticleItem>
      </van-list>

    </div>
  </div>
</template>

<script>
import {searchResultAPI} from '@/api';
import ArticleItem from '@/components/ArticleItem';

// 时间修饰符.native给组件内的根标签绑定原生事件
export default {
  name: 'SearchResult',
  components: {
    ArticleItem
  },
  data () {
    return {
      page: 1,
      articleList: [],
      loading: false,
      finished: false,
    }
  },
  async created () {
    const res = await searchResultAPI ({
      page: this.page,
      q: this.$route.params.kw
    })
    console.log (res)
    console.log ('create周期创建')
    this.articleList = res.data.data.results
  },
  methods: {
    async onLoad () {
      this.page++
      const res = await searchResultAPI ({
        page: this.page,
        q: this.$route.params.kw
      })
      console.log (res)
      if (res.data.data.results.length === 0) {
        this.finished = true
        return
      }
      this.articleList = [...this.articleList, ...res.data.data.results]
      this.loading = false
    },
    // 跳转到详情页
    itemClickFn (id) {
      this.$router.push ({
        path: `/detail?${id}`
      })
    }
  },

}
</script>

<style lang="less" scoped>
.search-result-container {
  padding-top: 46px;
}

.van-nav-bar {
  background-color: #007bff;

  /deep/ .van-nav-bar__title {
    color: #fff;
  }

  /deep/ .van-icon {
    color: #fff;
  }
}
</style>
