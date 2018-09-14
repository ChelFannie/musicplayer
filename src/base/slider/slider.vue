<template>
 <div class="slider" ref="slider">
  <div class="slider-group" ref="sliderGroup">
    <slot></slot>
  </div>
  <div class="dots" v-if="showDot">
    <span class="dot" v-for="(item, index) in dots" :key="index" :class="{'active': currentPageIndex === index}"></span>
  </div>
 </div>
</template>

<script>
import BScroll from 'better-scroll'
import {addClass} from 'common/js/dom'
export default {
  name: 'slider',
  props: {
    // 是否循环
    loop: {
      type: Boolean,
      default: true
    },
    // 是否自动轮播
    autoPlay: {
      type: Boolean,
      default: true
    },
    // 轮播间隔
    interval: {
      type: Number,
      default: 1500
    },
    click: {
      type: Boolean,
      default: true
    },
    threshold: {
      type: Number,
      default: 0.3
    },
    speed: {
      type: Number,
      default: 400
    },
    showDot: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      // dots的个数
      dots: [],
      // 当前轮播的索引
      currentPageIndex: 0
    }
  },
  watch: {
    // 外部传入的loop值改变时，重新
    loop () {
      this.update()
    },
    autoPlay () {
      this.update()
    },
    speed () {
      this.update()
    },
    threshold () {
      this.update()
    }
  },
  created () {
  },
  mounted () {
    this.update()
    // // 获取DOM，最好是在setTimeout中或者nextTick的回调函数里
    // this.$nextTick(() => {
    //   // 计算slider的宽度
    //   this._setSliderWidth()
    //   this._initDots()
    //   // 初始化slider
    //   this._initSlider()
    //   if (this.autoPlay) {
    //     this._play()
    //   }
    // })
    window.addEventListener('resize', () => {
      // enabled判断slider是否处以启动状态
      if (!this.slider || !this.slider.enabled) {
        return
      }
      // // 如果视口改变，重新计算宽度
      // this._setSliderWidth(true)
      // // 如果视口改变，重新刷新页面
      // this.slider.refresh()
      clearTimeout(this.resizeTimer)
      this.resizeTimer = setTimeout(() => {
        // isInTransition 判断当前 scroll 是否处于滚动动画过程中
        if (this.slider.isInTransition) {
          this._onScrollEnd()
        } else {
          if (this.autoPlay) {
            this._play()
          }
        }
        this.refresh()
      }, 60)
    })
  },
  methods: {
    update () {
      if (this.slider) {
        // destroy 销毁 better-scroll，解绑事件
        this.slider.destroy()
      }
      this.$nextTick(() => {
        this.init()
      })
    },
    // 初始化
    init () {
      clearTimeout(this.timer)
      this.currentPageIndex = 0
      // 计算slider的宽度
      this._setSliderWidth()
      if (this.showDot) {
        this._initDots()
      }
      // 初始化slider
      this._initSlider()
      if (this.autoPlay) {
        // 自动轮播
        this._play()
      }
    },
    // 计算轮播组件的宽度
    _setSliderWidth (isResize) {
      // 获取列表中有多少个自动轮播的元素
      this.children = this.$refs.sliderGroup.children
      let sliderWidth = this.$refs.slider.clientWidth
      let width = 0
      // 计算轮播列表的总宽度
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i]
        addClass(child, 'slider-item')
        child.style.width = sliderWidth + 'px'
        width += sliderWidth
      }
      // 如果要自动轮播，则需要多加两个dom，保证循环切换
      // 只有在刚打开页面的时候，需要多算两个dom，如果是切换了视口宽度，则不需要
      if (this.loop && !isResize) {
        width += 2 * sliderWidth
      }
      // 给外层的父元素设置宽度
      this.$refs.sliderGroup.style.width = width + 'px'
    },
    // 初始化轮播组件
    _initSlider () {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          // 是否可以无缝循环轮播
          loop: this.loop,
          // 手指滑动时页面可以滚动到下一个的阈值
          threshold: this.threshold,
          // 轮播图切换的动画时间
          speed: this.speed
        },
        click: true
      })
      // 每次轮播完毕时，会派发scrollEnd事件
      this.slider.on('scrollEnd', this._onScrollEnd)
      // 鼠标/手指离开时触发
      this.slider.on('touchEnd', () => {
        if (this.autoPlay) {
          this._play()
        }
      })
      // 滚动开始之前触发
      this.slider.on('beforeScrollStart', () => {
        if (this.autoPlay) {
          clearTimeout(this.timer)
        }
      })
    },
    // 初始化dots
    _initDots () {
      this.dots = new Array(this.children.length)
    },
    // 自动播放
    _play () {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        // this.slider.goToPage(pageIndex, 0, 400) 老版本
        // 解决因为BScoll版本升级不能无缝滚动的bug
        this.slider.next()
      }, this.interval)
    },
    // 每次轮播完毕时，会派发scrollEnd事件
    _onScrollEnd () {
      let pageIndex = this.slider.getCurrentPage().pageX
      this.currentPageIndex = pageIndex
      // 自动轮播
      if (this.autoPlay) {
        // 每次轮播前需要先清除定时器
        // clearTimeout(this.timer)
        this._play()
      }
    },
    // 更改视口宽度，重新刷新页面
    refresh () {
      this._setSliderWidth(true)
      this.slider.refresh()
    },
    // 滚动到上一个页面
    prev () {
      this.slider.prev()
    },
    // 滚动到下一个页面
    next () {
      this.slider.next()
    }
  },
  // keep-alive 组件激活时调用
  activated () {
    // if (this.autoPlay) {
    //   this._play()
    // }
    if (!this.slider) {
      return
    }
    // 启用 better-scroll, 默认 开启
    this.slider.enable()
    let pageIndex = this.slider.getCurrentPage().pageX
    this.slider.goToPage(pageIndex, 0, 0)
    this.currentPageIndex = pageIndex
    if (this.autoPlay) {
      this._play()
    }
  },
  // keep-alive 组件停用时调用
  deactivated () {
    // 禁用 better-scroll
    this.slider.disable()
    clearTimeout(this.timer)
  },
  beforeDestroy () {
    // 禁用 better-scroll
    this.slider.disable()
    clearTimeout(this.timer)
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable'
.slider
  min-height: 1px
  .slider-group
    position: relative
    overflow: hidden
    white-space: nowrap
    .slider-item
      float: left
      box-sizing: border-box
      overflow: hidden
      text-align: center
      a
        display: block
        width: 100%
        overflow: hidden
        text-decoration: none
      img
        display: block
        width: 100%
  .dots
    position: absolute
    right: 0
    left: 0
    bottom: 12px
    text-align: center
    font-size: 0
    .dot
      display: inline-block
      margin: 0 4px
      width: 8px
      height: 8px
      border-radius: 50%
      background: $color-text-l
      &.active
        width: 20px
        border-radius: 5px
        background: $color-text-ll
</style>
