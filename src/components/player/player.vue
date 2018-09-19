<template>
  <div class="player" v-show="playlist.length>0">
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave">

      <!-- 大播放器 -->
      <div class="normal-player" v-show="fullScreen">

        <!-- 背景图 -->
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image" alt="">
        </div>

        <!-- 顶部歌曲信息 -->
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>

        <!-- 唱片 -->
        <div class="middle">
          <div class="middle-l">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img :src="currentSong.image" alt="" class="image">
              </div>
            </div>
          </div>
        </div>

        <!-- 底部操作歌曲 -->
        <div class="bottom">

          <!-- 歌曲进度条 -->
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar></progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>

          <!-- 歌曲前进后退收藏功能 -->
          <div class="operators">
            <div class="icon i-left">
              <i class="icon-sequence"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <!-- <i class="icon-play" @click="togglePlaying"></i> -->
              <i :class="playIcon" @click="togglePlaying"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <transition name="mini">

      <!-- 小播放器 -->
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img :class="cdCls" width="40" height="40" :src="currentSong.image" alt="">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <i :class="miniIcon" class="icon-mini" @click.stop="togglePlaying"></i>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
          <!-- <i :class="miniIcon" @click.stop="togglePlaying"></i> -->
        </div>
      </div>
    </transition>
    <audio
      ref="audio"
      :src="currentSong.url"
      @play="ready"
      @error="error"
      @timeupdate="updateTime"></audio>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import animations from 'create-keyframe-animation'
import {prefixStyle} from 'common/js/dom.js'
import progressBar from 'base/progress-bar/progress-bar'
const transform = prefixStyle('transform')
export default {
  components: {
    progressBar
  },
  data () {
    return {
      // 歌曲是否播放
      songReady: false,
      // 当前播放时间
      currentTime: 0
    }
  },
  computed: {
    ...mapGetters([
      'fullScreen',
      'playlist',
      'currentSong',
      'playing',
      'currentIndex'
    ]),
    // 控制大播放器的播放与暂停按钮显示
    playIcon () {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    // 控制小播放器的播放与暂停按钮显示
    miniIcon () {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    // 控制小播放器cd的旋转样式
    cdCls () {
      return this.playing ? 'play' : 'play pause'
    },
    disableCls () {
      return this.songReady ? '' : 'disable'
    }
  },
  watch: {
    // 监听是否需要播放
    currentSong () {
      this.$nextTick(() => {
        this.$refs.audio.play()
      })
    },
    // 监听播放状态
    playing (newPlaying) {
      this.$nextTick(() => {
        const audio = this.$refs.audio
        // 如果是true则播放，否则就暂停播放
        newPlaying ? audio.play() : audio.pause()
      })
    }
  },
  created () {
  },
  methods: {
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX'
    }),
    // 将播放器变小
    back () {
      this.setFullScreen(false)
    },
    // 将播放器全屏展示
    open () {
      this.setFullScreen(true)
    },
    enter (el, done) {
      // 得到移动的位置和缩放比例
      const {x, y, scale} = this._getPosAndScale()
      // 设置动画帧数
      let animation = {
        0: {
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0, 0, 0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0, 0, 0) scale(1)`
        }
      }
      // 使用第三个插件注册动画
      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })
      // done是在动画执行完成后，执行下一个钩子函数
      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    afterEnter (el) {
      // 取消动画
      animations.unregisterAnimation('move')
      this.$refs.cdWrapper.style.animation = ''
    },
    leave (el, done) {
      this.$refs.cdWrapper.style.transition = 'all 0.4s'
      const {x, y, scale} = this._getPosAndScale()
      this.$refs.cdWrapper.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      // 在transitionend事件里监听动画是否完成
      this.$refs.cdWrapper.addEventListener('transitionend', done)
    },
    afterLeave (el) {
      // 动画完成后，清空
      this.$refs.cdWrapper.style.transition = ''
      this.$refs.cdWrapper.style[transform] = ''
    },
    // 控制播放器的播放暂停状态
    togglePlaying () {
      // 如果歌曲不是在播放状态时，不能马上点击
      if (!this.songReady) {
        return
      }
      this.setPlayingState(!this.playing)
    },
    // 播放上一曲
    prev () {
      // 如果歌曲不是在播放状态时，不能马上点击,如果不判断，连续点击会报错
      if (!this.songReady) {
        return
      }
      let index = this.currentIndex - 1
      if (index === -1) {
        index = this.playlist.length - 1
      }
      this.setCurrentIndex(index)
      // 如果当前状态是暂停，播放上一曲时，音乐播放，同时要改变播放与暂停按钮的样式的显示与隐藏
      if (!this.playing) {
        this.togglePlaying()
      }
      this.songReady = false
    },
    // 播放下一曲
    next () {
      // 如果歌曲不是在播放状态时，不能马上点击
      if (!this.songReady) {
        return
      }
      let index = this.currentIndex + 1
      if (index === this.playlist.length) {
        index = 0
      }
      this.setCurrentIndex(index)
      if (!this.playing) {
        this.togglePlaying()
      }
      this.songReady = false
    },
    // 当浏览器能够开始播放指定的音频/视频时，发生 canplay 事件
    ready () {
      this.songReady = true
    },
    error () {
      this.songReady = true
    },
    // timeupdate 事件在音频/视频（audio/video）的播放位置发生改变时触发
    updateTime (e) {
      this.currentTime = e.target.currentTime
    },
    _getPosAndScale () {
      // 小播放器mini-player的宽度
      const targetWidth = 40
      // 小播放器mini-player中心位置离左边的距离
      const paddingLeft = 40
      // 小播放器mini-player中心位置离底部的距离
      const paddingBottom = 30
      // 唱片middle的容器离顶部的距离
      const paddingTop = 80
      // 唱片容器cd-wrapper的宽度
      const width = window.innerWidth * 0.8
      // 缩放比例
      const scale = targetWidth / width
      // 唱片的移动距离 初始x, y坐标
      const x = -(window.innerWidth / 2 - paddingLeft)
      const y = window.innerHeight - paddingTop - paddingBottom - width / 2
      return {x, y, scale}
    },
    // 格式化时间
    format (interval) {
      // 向下取整
      interval = interval | 0
      const minute = interval / 60 | 0
      // const second = interval % 60
      const second = this._pad(interval % 60)
      return `${minute}:${second}`
    },
    // 补零 n 表示补零的位数
    _pad (num, n = 2) {
      let len = num.toString().length
      while (len < n) {
        num = '0' + num
        len++
      }
      return num
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.player
  .normal-player
    position fixed
    left 0
    right 0
    top 0
    bottom 0
    z-index 150
    background $color-background
    &.normal-enter-active, &.normal-leave-active
      transition all 0.4s
      .top, .bottom
        transition all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
    &.normal-enter, &.normal-leave-to
      opacity 0
      .top
        transform translate3d(0, -100px, 0)
      .bottom
        transform translate3d(0, 100px, 0)
    .background
      position: absolute
      left: 0
      top: 0
      width: 100%
      height: 100%
      z-index: -1
      opacity: 0.6
      filter: blur(20px)
    .top
      position relative
      margin-bottom 25px
      .back
        position absolute
        top 0
        left 6px
        z-index 50
        .icon-back
          display block
          padding 9px
          font-size $font-size-large-x
          color $color-theme
          transform rotate(-90deg)
      .title
        width 70%
        margin 0 auto
        line-height 40px
        text-align center
        no-wrap()
        font-size $font-size-large
        color $color-text
      .subtitle
        line-height 20px
        text-align center
        font-size $font-size-medium
        color $color-text
    .middle
      position fixed
      width 100%
      top 80px
      bottom 170px
      white-space nowrap
      font-size 0
      .middle-l
        display inline-block
        vertical-align top
        width 100%
        height 0
        padding-top 80%
        .cd-wrapper
          position absolute
          left 10%
          top 0
          width 80%
          height 80%
          .cd
            width 100%
            height 100%
            box-sizing border-box
            border 10px solid rgba(255, 255, 255, 0.1)
            border-radius 50%
            &.play
              animation rotate 20s linear infinite
            &.pause
              animation-play-state paused
            .image
              position absolute
              left 0
              top 0
              width 100%
              height 100%
              border-radius 50%
    .bottom
      position absolute
      bottom 50px
      width 100%
      .progress-wrapper
        display flex
        align-items center
        width 80%
        margin 0 auto
        padding 10px 0
        .time
          color $color-text
          font-size $font-size-small
          flex 0 0 30px
          width 30px
          line-height 30px
          &.time-l
            text-align left
          &.time-r
            text-align right
        .progress-bar-wrapper
          flex 1
      .operators
        display flex
        align-items center
        .icon
          flex 1
          color $color-theme-d
          &.disable
            color: $color-theme-d
          i
            font-size 30px
        .i-left
          text-align right
        .i-center
          text-align center
          padding 0 20px
        .i-right
          text-align left
  .mini-player
    position fixed
    left 0
    bottom 0
    z-index 180
    width 100%
    height 60px
    background $color-highlight-background
    display flex
    align-items center
    &.mini-enter-active, &.mini-leave-active
      transition all 0.4s
    &.mini-enter, &.mini-leave-to
      opacity 0
    .icon
      flex 0 0 40px
      width 40px
      padding 0 10px 0 20px
      img
        border-radius 50%
        &.play
          animation rotate 20s linear infinite
        &.pause
          // css3新属性 暂停动画
          animation-play-state paused
    .text
      flex 1
      display flex
      flex-direction column
      justify-content center
      line-height 20px
      overflow hidden
      .name
        margin-bottom 2px
        no-wrap()
        font-size $font-size-medium
        color $color-text
      .desc
        no-wrap()
        font-size $font-size-small
        color $color-text-d
    .control
      flex 0 0 30px
      width 30px
      padding 0 10px
      .icon-play-mini, .icon-pause-mini, .icon-playlist
        font-size 30px
        color $color-theme-d
      .icon-mini
        font-size 32px
  @keyframes rotate
    0%
      transform rotate(0)
    100%
      transform rotate(360deg)
</style>
