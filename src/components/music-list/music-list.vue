<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div ref="playBtn" class="play" v-show="songs.length>0" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
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
        <song-list :songs="songs" @select="selectItem" :rank="rank"></song-list>
      </div>
      <div v-show="!songs.length" class="loading-container">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
import Loading from 'base/loading/loading'
import {prefixStyle} from 'common/js/dom.js'
import {mapActions} from 'vuex'
import {playlistMixin} from 'common/js/mixins.js'

// 给layer滚动到title位置
const RESERVED_HEIGHT = 40
// 拿到兼容后的样式
const transform = prefixStyle('transform')
const backdrop = prefixStyle('backdrop')
// console.log(transform)
export default {
  mixins: [playlistMixin],
  components: {
    Scroll,
    SongList,
    Loading
  },
  props: {
    bgImage: {
      type: String,
      default: ''
    },
    // 歌单列表
    songs: {
      type: Array,
      default: function () {
        return []
      }
    },
    title: {
      type: String,
      default: ''
    },
    rank: {
      type: Boolean,
      default: false
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
      let translateY = Math.max(this.minTransalteY, newY)
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
      this.$refs.filter.style[backdrop] = `blur(${blur}px)`
      // 换成用变量代替 处理兼容
      this.$refs.layer.style[transform] = `translate3d(0, ${translateY}px, 0)`
      if (newY < this.minTransalteY) {
        zIndex = 10
        this.$refs.bgImage.style.paddingTop = 0
        this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
        this.$refs.playBtn.style.display = 'none'
      } else {
        // 如果没有滚动到最小的距离差，则是默认样式
        this.$refs.bgImage.style.paddingTop = '70%'
        this.$refs.bgImage.style.height = 0
        this.$refs.playBtn.style.display = ''
      }
      this.$refs.bgImage.style.zIndex = zIndex
      // 换成用变量代替 处理兼容
      this.$refs.bgImage.style[transform] = `scale(${scale})`
    }
  },
  data () {
    return {
      scrollY: 0,
      // 背景图片的高度
      imageHeight: null,
      // 可以滚动的距离
      minTransalteY: null
    }
  },
  created () {
    // 实时派发scroll事件
    this.probeType = 3
    this.listenScroll = true
  },
  mounted () {
    // console.log(this.$refs.list)
    // this.$refs.list是一个VueComponent对象，对象中的$el才是对应的DOM
    this.imageHeight = this.$refs.bgImage.clientHeight
    // layer可以滚动的距离
    this.minTransalteY = -this.imageHeight + RESERVED_HEIGHT
    this.$refs.list.$el.style.top = `${this.imageHeight}px`
  },
  methods: {
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ]),
    scroll (position) {
      this.scrollY = position.y
    },
    back () {
      this.$router.back()
    },
    // 点击播放列表中的首歌曲
    selectItem (item, index) {
      // console.log(item, index)
      this.selectPlay({
        list: this.songs,
        index: index
      })
    },
    // 点击随机播放
    random () {
      this.randomPlay({
        list: this.songs
      })
    },
    // 使用mixin对象，根据是否有小播放器，设置底部的bottom值
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '60px' : 0
      this.$refs.list.$el.style.bottom = bottom
      this.$refs.list.refresh()
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
    .play-wrapper
      position absolute
      bottom 20px
      z-index 50
      width 100%
      .play
        box-sizing border-box
        width 135px
        padding 7px 0
        margin 0 auto
        text-align center
        border 1px solid $color-theme
        color $color-theme
        border-radius: 100px
        font-size 0
        .icon-play
          display inline-block
          font-size $font-size-medium-x
          margin-right 6px
          vertical-align middle
        .text
          display inline-block
          font-size $font-size-small
          vertical-align middle
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
