<template>
  <div class="progress-circle">
    <svg :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle class="progress-background" r="50" cx="50" cy="50" fill="transparent"/>
      <circle
        class="progress-bar"
        r="50"
        cx="50"
        cy="50"
        fill="transparent"
        :stroke-dasharray="dashArray"
        :stroke-dashoffset="dashOffset"/>
    </svg>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    radius: {
      type: Number,
      default: 100
    },
    percent: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      // 圆的周长
      dashArray: Math.PI * 50 * 2
    }
  },
  computed: {
    // 剩余未播放的部分 描边的偏移量 如果是0，就是全部包裹
    dashOffset () {
      return (1 - this.percent) * this.dashArray
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

  .progress-circle
    position: relative
    circle
      stroke-width: 8px
      transform-origin: center
      &.progress-background
        transform: scale(0.9)
        // stroke: $color-theme-d
        stroke: rgba(255,205,49,0.1)
      &.progress-bar
        transform: scale(0.9) rotate(-90deg)
        // stroke: $color-theme
        stroke: #cc1d1d
</style>
