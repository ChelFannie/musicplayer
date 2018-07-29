<template>
 <scroll class="listview" :data="data">
   <ul>
     <li v-for="(group, index) in data" :key="index" class="list-group">
       <h2 class="list-group-title">{{group.title}}</h2>
       <ul>
         <li class="list-group-item" v-for="(item, index1) in group.items" :key="index1">
           <img class="avatar" v-lazy="item.avatar" alt="">
           <span class="name">{{item.name}}</span>
         </li>
       </ul>
     </li>
   </ul>
 </scroll>
</template>

<script>
import Scroll from 'base/scroll/scroll'
export default {
  props: {
    data: {
      type: Array,
      // default: [] // 这样子写会报错，以下两种方法可以解决
      // default: () => [],
      default: function () {
        return []
      }
    }
  },
  components: {
    Scroll
  },
  data () {
    return {

    }
  },
  created () {

  },
  methods: {

  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
.listview
  position relative
  width 100%
  height 100%
  overflow hidden
  background $color-background
  .list-group
    padding-bottom 30px
    .list-group-title
      height 30px
      line-height 30px
      padding-left 20px
      font-size $font-size-small
      color $color-text-l
      background $color-highlight-background
    .list-group-item
      display flex
      align-items center
      padding 20px 0 0 30px
      .avatar
        width 50px
        height 50px
        border-radius 50%
      .name
        margin-left 20px
        color: $color-text-l
        font-size: $font-size-medium
</style>
