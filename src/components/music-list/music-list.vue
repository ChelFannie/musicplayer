<template>
  <div class="music-list">
    <div class="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="filter"></div>
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
      this.$refs.layer.style['transform'] = `translate3d(0, ${newY}px, 0)`
      this.$refs.layer.style['webkitTransform'] = `translate3d(0, ${newY}px, 0)`
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
    this.$refs.list.$el.style.top = `${this.$refs.bgImage.clientHeight}px`
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
