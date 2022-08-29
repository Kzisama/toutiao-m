<template>
  <div id="app">
    <keep-alive :exclude="['ArticleDetail', 'Login', 'Search', 'SearchResult']">
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
// import {getAllChannnelsAPI} from '@/api';

export default {
  // async created () {
  //   try {
  //     const res = await getAllChannnelsAPI ()
  //     console.log (res)
  //   } catch (err) {
  //     alert ('出错啦')
  //     console.dir (err)
  //   }
  // }
}
</script>

<style scoped lang="less">

</style>
