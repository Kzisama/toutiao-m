<template>
  <div>

    <!-- 评论列表 -->
    <div :class="{'art-cmt-container-1':isShow,'art-cmt-container-2':!isShow}">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
      >
        <div class="cmt-list" v-for="obj in commentsArr" :key="obj.com_id">
          <!-- 评论的 Item 项 -->
          <div class="cmt-item">
            <!-- 头部区域 -->
            <div class="cmt-header">
              <!-- 头部左侧 -->
              <div class="cmt-header-left">
                <img :src="obj.aut_photo" alt="" class="avatar">
                <span class="uname">zs</span>
              </div>
              <!-- 头部右侧 -->
              <div class="cmt-header-right">
                <van-icon name="like" size="16" color="red" v-if="obj.is_liking" @click="likeFn(true,obj)"/>
                <van-icon name="like-o" size="16" color="gray" v-else @click="likeFn(false,obj)"/>
              </div>
            </div>
            <!-- 主体区域 -->
            <div class="cmt-body">
              {{ obj.content }}
            </div>
            <!-- 尾部区域 -->
            <div class="cmt-footer">{{ timeAgo (obj.pubdate) }}</div>
          </div>
        </div>
      </van-list>
    </div>

    <!--  发表评论  -->
    <div>
      <!-- 底部添加评论区域 - 1 -->
      <div class="add-cmt-box van-hairline--top" v-if="isShow">
        <van-icon name="arrow-left" size="0.48rem" @click="$router.back()"/>
        <div class="ipt-cmt-div" @click="changeFn">发表评论</div>
        <div class="icon-box">
          <van-badge :content="totalCount===0? '' :totalCount ">
            <van-icon name="comment-o" size="0.53333334rem" @click="commentClickFn"/>
          </van-badge>
          <van-icon name="star-o" size="0.53333334rem"/>
          <van-icon name="share-o" size="0.53333334rem"/>
        </div>
      </div>

      <!-- 底部添加评论区域 - 2 -->
      <div class="cmt-box van-hairline--top" v-else>
        <textarea placeholder="友善评论、理性发言、阳光心灵" v-fofo @blur="blurFn" v-model.trim="comText"></textarea>
        <van-button type="default" :disabled="comText.length===0" @click="commentFn">发布</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import {commentsAPI, likeCommentAPi, disLikeCommentAPI, commentSend} from '@/api';
import {timeAgo} from '@/utils/formatDate';

export default {
  data () {
    return {
      commentsArr: [],  // 评论列表
      totalCount: null, // 文章总评论数
      isShow: true,
      commentHeight: 0, // 文章内容高度
      comText: '',
      loading: false,
      finished: false,
      last_id: null  // 用于分页
    }
  },
  methods: {
    timeAgo,
    // 点赞/取消点赞事件
    async likeFn (bool, comObj) {
      // comObj.is_liking = bool !== true;
      if (bool === true) {  // 说明点击时处于点赞状态,点击后要变成不喜欢状态
        comObj.is_liking = false
        await disLikeCommentAPI ({
          comId: comObj.com_id
        })
      } else {
        comObj.is_liking = true
        await likeCommentAPi ({
          comId: comObj.com_id
        })
      }
    },
    // 切换发布评论组件
    changeFn () {
      this.isShow = false
    },
    // 点击评论按钮,让第一条评论滑动到顶部位置
    async commentClickFn () {
      // 只需要滑动整个文章内容的高度即可 scrollHeight
      // JS代码实在html,css运行和才执行,真实DOM已经加载到页面上,document一下的元素都是可以获取到的
      // this.commentHeight = document.querySelector ('.article-container').scrollHeight
      // window.scrollTo (0, this.commentHeight)

      // 可以用原生JS的缓步动画来做滑动效果,具体见 https://gitee.com/lidongxuwork/bilibili-matching-code/blob/master/Web%E5%89%8D%E7%AB%AF/5-%E6%A1%86%E6%9E%B6/V2.x/%E9%A1%B9%E7%9B%AE/%E9%BB%91%E9%A9%AC%E5%A4%B4%E6%9D%A1_%E7%A7%BB%E5%8A%A8%E7%AB%AF%E9%A1%B9%E7%9B%AE/%E9%85%8D%E5%A5%97%E7%AC%94%E8%AE%B0/05_%E6%89%A9%E5%B1%95/%E6%BB%9A%E5%8A%A8%E5%88%B0%E5%BA%95%E9%83%A8/%E7%82%B9%E5%87%BB%E8%AF%84%E8%AE%BA%E6%BB%9A%E5%8A%A8%E5%88%B0%E5%BA%95%E9%83%A8.txt

      // 评论滑动
      // 真实DOM都在document(所以不再一个vue文件内), 也是可以获取的
      document.querySelector ('.like-box').scrollIntoView ({
        behavior: 'smooth'
      })


    },
    // 点击发布评论
    async commentFn () {
      const res = await commentSend ({
        id: this.$route.query.art_id,
        content: this.comText
      })
      console.log (res)
      this.commentsArr.unshift (res.data.data.new_obj)
      this.comText = ''
      this.totalCount++
      await this.commentClickFn ()
    },
    // 失焦事件
    blurFn () {
      // 发现bug:在点击发布评论时,会因为文本域输入框失焦而触发失焦事件,由于用v-if和v-else控制显示和出现,导致了失焦时销毁了文本域输入框所在的整个标签
      // 解决:设置一个定时器,延迟失焦事件的触发,属于异步任务
      setTimeout (() => {
        this.isShow = true
      }, 0)
    },
    // 加载更多
    async onLoad () {
      if (this.commentsArr.length === 0) {
        this.loading = false
        return
      }
      const res = await commentsAPI ({
        id: this.$route.query.art_id,
        offset: this.last_id
      })
      if (res.data.data.last_id === null) {
        this.finished = true
      }
      this.commentsArr = [...this.commentsArr, ...res.data.data.results]
      this.totalCount = res.data.data.total_count
      this.last_id = res.data.data.last_id
      this.loading = false
    }
  },
  async created () {
    const res = await commentsAPI ({
      id: this.$route.query.art_id,
      offset: this.offset
    })
    console.log (res)
    this.commentsArr = res.data.data.results
    this.totalCount = res.data.data.total_count
    this.last_id = res.data.data.last_id

    if (res.data.data.results.length === 0) {
      this.finished = true
    }
  }
}
</script>

<style scoped lang="less">
.comList {
  padding-bottom: 46px;
}

.cmt-list {
  padding: 10px;

  .cmt-item {
    padding: 15px 0;

    + .cmt-item {
      border-top: 1px solid #f8f8f8;
    }

    .cmt-header {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .cmt-header-left {
        display: flex;
        align-items: center;

        .avatar {
          width: 40px;
          height: 40px;
          background-color: #f8f8f8;
          border-radius: 50%;
          margin-right: 15px;
        }

        .uname {
          font-size: 12px;
        }
      }
    }

    .cmt-body {
      font-size: 14px;
      line-height: 28px;
      text-indent: 2em;
      margin-top: 6px;
      word-break: break-all;
    }

    .cmt-footer {
      font-size: 12px;
      color: gray;
      margin-top: 10px;
    }
  }
}

/*美化 - 文章详情 - 底部的评论页面 */
// 外层容器
.art-cmt-container-1 {
  padding-bottom: 46px;
}

.art-cmt-container-2 {
  padding-bottom: 80px;
}

// 发布评论的盒子 - 1
.add-cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 46px;
  line-height: 46px;
  padding-left: 10px;

  .ipt-cmt-div {
    flex: 1;
    border: 1px solid #efefef;
    border-radius: 15px;
    height: 30px;
    font-size: 12px;
    line-height: 30px;
    padding-left: 15px;
    margin-left: 10px;
    background-color: #f8f8f8;
  }

  .icon-box {
    width: 40%;
    display: flex;
    justify-content: space-evenly;
    line-height: 0;
  }
}

.child {
  width: 20px;
  height: 20px;
  background: #f2f3f5;
}

// 发布评论的盒子 - 2
.cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  padding-left: 10px;
  box-sizing: border-box;
  background-color: white;

  textarea {
    flex: 1;
    height: 66%;
    border: 1px solid #efefef;
    background-color: #f8f8f8;
    resize: none;
    border-radius: 6px;
    padding: 5px;
  }

  .van-button {
    height: 100%;
    border: none;
  }
}
</style>
