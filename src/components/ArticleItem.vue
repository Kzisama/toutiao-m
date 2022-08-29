<template>

  <div>
    <!-- 一条文章单元格 -->
    <van-cell>
      <!-- 标题区域的插槽 -->
      <template #title>
        <div class="title-box">
          <!-- 标题 -->
          <span>{{ artObj.title }}</span>
          <!-- 单图 -->
          <img class="thumb" v-if="artObj.cover.type === 1" :src="artObj.cover.images[0]">
        </div>
        <!-- 多图 -->
        <div class="thumb-box" v-if="artObj.cover.type > 1">
          <img class="thumb" v-for="(val,index) in artObj.cover.images" :key="index"
               :src="val">
        </div>
      </template>
      <!-- label 区域的插槽 -->
      <template #label>
        <div class="label-box">
          <div>
            <span>{{ artObj.aut_name }}</span>
            <span>{{ artObj.comm_count }} 评论</span>
            <span>{{ formatDate (artObj.pubdate) }}</span>
          </div>
          <!-- 反馈按钮 -->
          <van-icon name="cross" @click.stop="show = true" v-if="isShow"/>
        </div>
      </template>
    </van-cell>

    <van-action-sheet
      v-model="show"
      :actions="actions"
      @select="onSelect"
      get-container="body"
      :cancel-text="cancelText"
      @cancel="cancelFn"
      @close="closeFn"/>
  </div>

</template>

<script>
import {timeAgo} from '@/utils/formatDate';
import {firstActions, secondActions} from '@/api/report';

export default {
  props: {
    artObj: Object,
    isShow: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      show: false,
      actions: firstActions,  //反馈面板选项
      cancelText: '取消'
    }
  },
  methods: {
    formatDate: timeAgo,
    onSelect (action, index) {
      // console.log (action)  // 被点击的选项
      // console.log (index)   // 被点击的选项的索引
      // 默认情况下点击选项时不会自动收起
      // 可以通过 close-on-click-action 属性开启自动收起
      // this.show = false;
      if (action.name === '反馈垃圾内容') {
        this.actions = secondActions
        this.cancelText = '返回'
      } else if (action.name === '不感兴趣') {
        this.$emit ('dislikeEV', this.artObj.art_id)
        this.show = false // 无论成功失败，都让返回面板消失
      } else { // 一定是二级反馈面板的选项
        this.$emit ('reportsEv', this.artObj.art_id, action.value)
        this.show = false
      }
    },
    // 点击返回按钮，回到一级弹出层
    cancelFn () {
      if (this.cancelText === '返回') {
        this.show = true  // 强制显示，覆盖掉默认的隐藏
        this.cancelText = '取消'
        this.actions = firstActions
      }
    },
    // 关闭面板时触发，让数组回到第一层的数据的数组
    closeFn () {
      this.cancelFn ()
      this.show = false
    }
  }
}
</script>

<style scoped lang="less">
/* 标题样式 */
.title-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

/* label描述样式 */
.label-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 文章信息span */
.label-box span {
  margin: 0 3px;

  &:first-child {
    margin-left: 0;
  }
}

/* 图片的样式, 矩形黄金比例：0.618 */
.thumb {
  width: 113px;
  height: 70px;
  background-color: #f8f8f8;
  object-fit: cover;
}

/* 三图, 图片容器 */
.thumb-box {
  display: flex;
  justify-content: space-between;
}
</style>
