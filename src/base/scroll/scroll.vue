<template>
 <div ref="wrapper">
   <slot></slot>
 </div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
  name: 'scroll',
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    // 滚动的实时数据
    data: {
      type: Array,
      default: null
    },
    listenScroll: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {

    }
  },
  watch: {
    data () {
      // setTimeout(() => {
      //   this.refresh()
      // }, 20)
      this.$nextTick(() => {
        this.refresh()
      })
    }
  },
  created () {

  },
  mounted () {
    this.$nextTick(() => {
      this._initScroll()
    })
  },
  methods: {
    // 初始化
    _initScroll () {
      if (!this.$refs.wrapper) {
        return
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      })
      if (this.listenScroll) {
        let vm = this
        this.scroll.on('scroll', position => {
          vm.$emit('scroll', position)
        })
      }
    },
    // 启用 better-scroll, 默认 开启
    enable () {
      this.scroll && this.scroll.enable()
    },
    // 禁用 better-scroll
    disable () {
      this.scroll && this.scroll.disable()
    },
    // 重新计算 better-scroll，当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常
    refresh () {
      this.scroll && this.scroll.refresh()
    },
    // 滚动到指定的位置
    scrollTo () {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    // 滚动到指定的目标元素
    scrollToElement () {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    }
  }
}
</script>

<style>

</style>
