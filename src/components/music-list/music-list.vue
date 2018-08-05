<template>
  <div class="music-list">
    <div class="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll
      :data="songs"
      :probe-type="probeType"
      :listen-scroll="listenScroll"
      class="list"
      ref="list"
      @scroll="scroll">
      <div class="song-list-wrapper">
        <song-list :songs="songs"></song-list>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'

// 给layer滚动到title位置
const RESERVED_HEIGHT = 40
export default {
  components: {
    Scroll,
    SongList
  },
  props: {
    bgImage: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default: function () {
        return []
      }
    },
    title: {
      tyep: String,
      default: ''
    }
  },
  computed: {
    bgStyle () {
      return `background-image:url(${this.bgImage})`
    }
  },
  watch: {
    scrollY (newY) {
      // layer层不能无限滚动，滚动到（背景图片的高度-title的高度）后就不需要滚动了
      console.log(this.minTransalteY, 1)
      console.log(newY, 2)
      let translateY = Math.max(this.minTransalteY, newY)
      console.log(translateY, 3)
      let zIndex = 0
      // 定义图片缩放比例，且只有向下滚动才有
      let scale = 1
      // 定义图片的模糊效果，且只有向上滚动才有
      let blur = 0
      const percent = Math.abs(newY / this.imageHeight)
      if (newY > 0) {
        scale = 1 + percent
        zIndex = 10
      } else {
        blur = Math.min(20, percent * 10)
      }
      this.$refs.filter.style.filter = `blur(${blur}px)`
      this.$refs.layer.style['transform'] = `translate3d(0, ${translateY}px, 0)`
      this.$refs.layer.style['webkitTransform'] = `translate3d(0, ${translateY}px, 0)`
      if (newY < this.minTransalteY) {
        zIndex = 10
        this.$refs.bgImage.style.paddingTop = 0
        this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
      } else {
        this.$refs.bgImage.style.paddingTop = '70%'
        this.$refs.bgImage.style.height = 0
      }
      this.$refs.bgImage.style.zIndex = zIndex
      this.$refs.bgImage.style['transform'] = `scale(${scale})`
      this.$refs.bgImage.style['webkitTransform'] = `scale(${scale})`
    }
  },
  data () {
    return {
      scrollY: 0
    }
  },
  created () {
    this.probeType = 3
    this.listenScroll = true
  },
  mounted () {
    // console.log(this.$refs.list)
    // this.$refs.list是一个VueComponent对象，对象中的$el才是对应的DOM
    this.imageHeight = this.$refs.bgImage.clientHeight
    this.minTransalteY = -this.imageHeight + RESERVED_HEIGHT
    this.$refs.list.$el.style.top = `${this.imageHeight}px`
  },
  methods: {
    scroll (position) {
      this.scrollY = position.y
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable'
@import "~common/stylus/mixin"
.music-list
  position fixed
  z-index 100
  top 0
  left 0
  right 0
  bottom 0
  background $color-background
  .back
    position absolute
    top 0
    left 6px
    z-index 50
    .icon-back
      display block
      padding 10px
      font-size $font-size-large-x
      color $color-theme
  .title
    position absolute
    top 0
    left 10%
    z-index 40
    width 80%
    no-wrap()
    text-align: center
    line-height: 40px
    font-size: $font-size-large
    color: $color-text
  .bg-image
    width: 100%
    height: 0
    padding-top: 70%
    transform-origin: top
    background-size: cover
    position: relative
    .filter
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      background: rgba(7, 17, 27, 0.4)
  .bg-layer
    // position relative
    height 100%
    background $color-background
  .list
    position: fixed
    // top值不固定，会根据浏览器改变而改变
    top: 0
    bottom: 0
    width: 100%
    background: $color-background
    // overflow hidden
    .song-list-wrapper
      padding: 20px 30px
</style>
