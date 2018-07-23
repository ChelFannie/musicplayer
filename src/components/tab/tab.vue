<template>
 <div class="tab">
   <router-link v-for="(item, index) in routerList" :key="index" :to="item.routerPath" tag="div" class="tab-item">
     <span class="tab-link">{{item.desc}}</span>
   </router-link>
 </div>
</template>

<script>
export default {
  data () {
    return {
      msg: 'tab',
      routerList: [
        {routerPath: 'recommend', desc: '推荐'},
        {routerPath: 'singer', desc: '歌手'},
        {routerPath: 'rank', desc: '排行'},
        {routerPath: 'search', desc: '搜索'}
      ]
    }
  },
  created () {

  },
  methods: {

  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
.tab
  display: flex
  height 44px
  line-height 44px
  font-size $font-size-medium
  .tab-item
    flex: 1
    text-align center
    .tab-link
      padding-bottom 5px
      color $color-text-1
    &.router-link-active
      .tab-link
        color: $color-theme
        border-bottom: 2px solid $color-theme
</style>
