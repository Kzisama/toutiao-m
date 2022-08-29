<template>
  <div>
    <!-- 搜索页面头部 -->
    <div class="search-header">
      <!-- 后退按钮 -->
      <van-icon name="arrow-left" color="white" size="0.48rem" class="goback" @click="$router.back()"/>
      <!-- 搜索组件 -->
      <van-search placeholder="请输入搜索关键词" background="#007BFF" shape="round" v-fofo v-model.trim="kw"
                  @input="inputFn" @search="searchFn(kw)"/>
    </div>
    <!-- 搜索建议列表 -->
    <div class="sugg-list">
      <div class="sugg-item" v-for="(str , index) in suggestList" :key="index" v-html="lightFn (str, kw)"
           @click="searchListFn(str)">
      </div>
    </div>
    <!-- 搜索历史 -->
    <div class="search-history" v-show="suggestList.length===0">
      <!-- 标题 -->
      <van-cell title="搜索历史">
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template #right-icon>
          <van-icon name="delete" class="search-icon" @click="clearFn"/>
        </template>
      </van-cell>

      <!-- 历史列表 -->
      <div class="history-list">
        <span class="history-item" v-for="(str,index) in history" :key="index" @click="historyFn(str)">{{ str }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import {suggestListAPI} from '@/api';

export default {
  name: 'Search',
  data () {
    return {
      kw: '', // 搜索关键字
      timer: null,
      suggestList: [],
      history: JSON.parse (localStorage.getItem ('his')) || [] // 搜索历史
    }
  },
  methods: {
    // 搜索
    inputFn () {
      clearTimeout (this.timer)
      if (this.kw.length === 0) {
        this.suggestList = []
      } else {
        this.timer = setTimeout (async () => {
          const res = await suggestListAPI ({
            keywords: this.kw
          })
          this.suggestList = res.data.data.options
        }, 300)
      }
    },
    // 关键字高亮
    lightFn (oriStr, target) {
      // oriStr:传过来的字符串
      // target:关键字
      // replace:只替换第一个满足条件的元素
      // replaceAll:替换所有满足要求的元素
      // 返回值:替换之后的字符串

      // 如果要是用变量来作为正则的判断条件，那就不能使用语法糖的形式
      // 替换后的值不能使用target，因为会将匹配到的内容全部替换成target
      let reg = new RegExp (target, 'ig') // i 表示忽略大小写，g 表示全局匹配
      return oriStr.replaceAll (reg, match => {
        // match就是匹配结果中原来的那个字符，我们只要给他改个颜色即可
        return `<span style="color:red">${match}</span>`
      })
    },
    // 跳转到搜索结果
    // 路由跳转在watch之前执行，导致history没有保存下来，所以给路由跳转一个定时器包裹
    skip (info) {
      setTimeout (() => {
        this.$router.push ({
          path: `/search_result/${info}`
        })
      }, 0)

    },
    // 搜索跳转
    searchFn () {
      if (this.kw.length > 0) {
        this.history.push (this.kw)
        this.skip (this.kw)
      }
    },
    // 搜索联想列表跳转
    searchListFn (str) {
      this.history.push (str)
      this.skip (str)
    },
    // 历史记录跳转
    historyFn (str) {
      this.skip (str)
    },
    // 清空历史记录
    clearFn () {
      localStorage.removeItem ('his')
    }
  },
  watch: {
    history: { // 历史记录数组发送变化
      deep: true,
      handler () { // 覆盖式更新数组
        // 数组去重，利用ES6的Set方法
        // set是一个无重复值的集合体，是没有下标的
        // set会自动将传入的数组中的重复元素清理掉,返回一个set对象,利用Array.from将set对象再转换为数组,实现数组去重
        this.history = Array.from (new Set (this.history))
        localStorage.setItem ('his', JSON.stringify (this.history))
      }
    }
  }
}
</script>

<style scoped lang="less">
.search-header {
  height: 46px;
  display: flex;
  align-items: center;
  background-color: #007bff;
  overflow: hidden;

  /*后退按钮*/

  .goback {
    padding-left: 14px;
  }

  /*搜索组件*/

  .van-search {
    flex: 1;
  }
}

/*搜索建议列表样式 */
.sugg-list {
  .sugg-item {
    padding: 0 15px;
    border-bottom: 1px solid #f8f8f8;
    font-size: 14px;
    line-height: 50px;
    // 实现省略号的三行代码
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

/*搜索历史 */
.search-icon {
  font-size: 16px;
  line-height: inherit;
}

.history-list {
  padding: 0 10px;

  .history-item {
    display: inline-block;
    font-size: 12px;
    padding: 8px 14px;
    background-color: #efefef;
    margin: 10px 8px 0px 8px;
    border-radius: 10px;
  }
}
</style>

