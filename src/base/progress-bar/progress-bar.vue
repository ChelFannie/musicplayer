<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div
        class="progress-btn-wrapper"
        ref="progressBtn"
        @touchstart.prevent="progressTouchStart"
        @touchmove.prevent="progressTouchMove"
        @touchend="progressTouchEnd">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {prefixStyle} from 'common/js/dom.js'
const transform = prefixStyle('transform')
// 进度条上的按钮的宽度
const progressBtnWidth = 16
export default {
  props: {
    // 歌曲播放进度比例
    percent: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      // 进度条按钮被拖动的值
      touch: {}
    }
  },
  watch: {
    // 监控父组件在传入percent时，改动进度条和按钮的位移
    percent (newPercent) {
      // 如果在进度条被拖动过程中，即是this.touch.initiated = true，进度条此时不跟随父组件改变
      if (newPercent >= 0 && !this.touch.initiated) {
        // 进度条可移动的最大长度
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        // 进度条移动的实时宽度
        const offsetWidth = barWidth * newPercent
        // 设置进度条和按钮的样式
        this._offset(offsetWidth)
      }
    }
  },
  created () {
  },
  methods: {
    progressTouchStart (e) {
      // 被拖动的起始位置
      this.touch.startX = e.touches[0].clientX
      // 设置被拖动的标志
      this.touch.initiated = true
      // 记录进度条的当前位置
      this.touch.left = this.$refs.progress.clientWidth
    },
    progressTouchMove (e) {
      if (!this.touch.initiated) {
        return
      }
      // 进度条被拖动的位移差
      const deltaX = e.touches[0].clientX - this.touch.startX
      // 进度条上的按钮拖动需要限制 最小是0，最大是progressBar的宽度 - progressBtnWidth
      const move = Math.max(0, (this.touch.left + deltaX))
      const offsetWidth = Math.min((this.$refs.progressBar.clientWidth - progressBtnWidth), move)
      // this._offset(deltaX)
      this._offset(offsetWidth)
    },
    progressTouchEnd () {
      // 拖动结束时，改变拖动的标志位，并将比例传回给父组件
      this.touch.initiated = false
      this._triggerPercent()
    },
    // 点击进度条改变歌曲播放时间
    progressClick (e) {
      // Element.getBoundingClientRect()方法返回元素的大小及其相对于视口的位置
      const offsetWidth = e.pageX - this.$refs.progressBar.getBoundingClientRect().left
      this._offset(offsetWidth)
      this._triggerPercent()
    },
    // 进度条和移动按钮移动的距离
    _offset (offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`
      // this.$refs.progressBtn.style.transform = `translate3d(${offsetWidth}px, 0, 0)`
      this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
    },
    // 进度条拖动后，传回比例给父组件
    _triggerPercent () {
      // 进度条可移动的最大长度
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      // 进度条移动的实时宽度
      const percent = this.$refs.progress.clientWidth / barWidth
      this.$emit('percentChange', percent)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .progress-bar
    height 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position absolute
        height 100%
        background $color-theme
      .progress-btn-wrapper
        position absolute
        left -8px
        top -13px
        width 30px
        height 30px
        .progress-btn
          position relative
          top 7px
          left 7px
          box-sizing border-box
          width 16px
          height 16px
          border 3px solid $color-text
          border-radius 50%
          background $color-theme
</style>
