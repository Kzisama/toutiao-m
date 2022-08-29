<template>
  <div>
    <!-- Header 区域 -->
    <van-nav-bar fixed title="文章详情" left-arrow @click-left="$router.back()"/>

    <!-- 文章信息区域 -->
    <div class="article-container">
      <!-- 文章标题 -->
      <h1 class="art-title">{{ artObj.title }}</h1>

      <!-- 用户信息 -->
      <van-cell center :title="artObj.aut_name" :label="formatDate(artObj.pubdate)">
        <template #icon>
          <img :src="artObj.aut_photo" alt="" class="avatar">
        </template>
        <template #default>
          <div>
            <van-button type="info" size="mini" v-if="artObj.is_followed" @click="followFn(true)">已关注</van-button>
            <van-button icon="plus" type="info" size="mini" plain v-else @click="followFn(false)">关注</van-button>
          </div>
        </template>
      </van-cell>

      <!-- 分割线 -->
      <van-divider></van-divider>

      <!-- 文章内容 -->
      <div class="art-content" v-html="artObj.content"></div>

      <!-- 分割线 -->
      <van-divider>End</van-divider>

      <!-- 点赞 -->
      <div class="like-box">
        <van-button icon="good-job" type="danger" size="small" v-if="artObj.attitude===1" @click="likeFn(true)">已点赞
        </van-button>
        <van-button icon="good-job-o" type="danger" plain size="small" v-else @click="likeFn(false)">点赞</van-button>
      </div>
    </div>

    <!--  评论列表  -->
    <CommentList></CommentList>
  </div>
</template>

<script>
import {articleDetailAPI, noAttentionAPI, attentionAPI, disLikeArticleAPI, likeArticleAPI} from '@/api';
import {timeAgo} from '@/utils/formatDate';
import CommentList from '@/views/ArticleDetail/CommentList';

export default {
  components: {
    CommentList
  },
  data () {
    return {
      artObj: {},
    }
  },
  methods: {
    formatDate: timeAgo,
    // 作者--关注和取关
    async followFn (bool) {
      if (bool === true) { // 点击关注按钮,代表想要取关,调用取关接口
        this.artObj.is_followed = false;
        await noAttentionAPI ({
          target: this.artObj.aut_id
        })
      } else { // 调用关注接口
        this.artObj.is_followed = true;
        await attentionAPI ({
          target: this.artObj.aut_id
        })
      }
    },
    // 文章--点赞和取消点赞
    async likeFn (bool) {
      if (bool === true) { // 调用取消点赞接口
        this.artObj.attitude = 0
        await disLikeArticleAPI ({
          atrId: this.artObj.art_id
        })
      } else { // 调用点赞接口
        this.artObj.attitude = 1
        await likeArticleAPI ({
          artId: this.artObj.art_id
        })
      }
    }
  },
  async created () {
    const res = await articleDetailAPI ({
      artId: this.$route.query.art_id
    })
    this.artObj = res.data.data
  },
}
</script>

<style scoped lang="less">
.van-nav-bar {
  background-color: #007bff;

  /deep/ .van-nav-bar__title {
    color: #fff;
  }

  /deep/ .van-icon {
    color: #fff;
  }
}


.article-container {
  padding: 10px;
  margin-top: 46px;
}

.art-title {
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0;
}

.art-content {
  font-size: 12px;
  line-height: 24px;
  width: 100%;
  overflow-x: scroll;
  word-break: break-all;

  /deep/ img {
    width: 100%;
  }

  /deep/ pre {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}

.van-cell {
  padding: 5px 0;

  &::after {
    display: none;
  }
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f8f8f8;
  margin-right: 5px;
  border: none;
}

.like-box {
  display: flex;
  justify-content: center;
}
</style>
