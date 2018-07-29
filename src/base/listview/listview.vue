<template>
 <scroll class="listview" :data="data" ref="listview">
   <ul>
     <li v-for="(group, index) in data" :key="index" class="list-group" ref="listGrop">
       <h2 class="list-group-title">{{group.title}}</h2>
       <ul>
         <li class="list-group-item" v-for="(item, index1) in group.items" :key="index1">
           <img class="avatar" v-lazy="item.avatar" alt="">
           <span class="name">{{item.name}}</span>
         </li>
       </ul>
     </li>
   </ul>
   <div class="list-shortcut">
     <ul>
       <li class="item" v-for="(item, index) in shortcutList" :key="index" @touchstart.stop.prevent="onShortcutTouchStart(index, $event)" @touchmove.stop.prevent="onShortcutTouchMove($event)">{{item}}</li>
     </ul>
   </div>
 </scroll>
</template>

<script>
import Scroll from 'base/scroll/scroll'
// import {getData} from 'common/js/dom.js'

// const TITLE_HEIGHT = 30
// 导航每个元素的高度
const ANCHOR_HEIGHT = 18
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
  computed: {
    // 得到右侧的导航条
    shortcutList () {
      return this.data.map(group => {
        return group.title.substr(0, 1)
      })
    }
  },
  data () {
    return {

    }
  },
  created () {
    this.touch = {}
  },
  methods: {
    onShortcutTouchStart (index, e) {
      // this.$refs.listview.scrollToElement(this.$refs.listGrop[index], 0)
      this._scrollTo(index)
      let firstTouch = e.touches[0]
      this.touch.y1 = firstTouch.pageY
      this.touch.anchorIndex = index
    },
    onShortcutTouchMove (e) {
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      // 在y轴的偏移量
      let delta1 = this.touch.y2 - this.touch.y1
      // 计算偏移了几个字母值，并去零取整
      let delta = delta1 / ANCHOR_HEIGHT | 0
      // 得到移动后手离开屏幕的字母的index
      let anchorIndex = this.touch.anchorIndex + delta
      // this.$refs.listview.scrollToElement(this.$refs.listGrop[anchorIndex], 0)
      this._scrollTo(anchorIndex)
    },
    _scrollTo (index) {
      this.$refs.listview.scrollToElement(this.$refs.listGrop[index], 0)
    }
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
  .list-shortcut
    position absolute
    z-index 30
    right 0
    top 50%
    transform translateY(-50%)
    width 20px
    padding 20px 0
    border-radius 10px
    text-align center
    background $color-background-d
    font-family Helvetica
    .item
      padding 3px
      line-height 1
      color: $color-text-l
      font-size: $font-size-small
</style>
