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
    enable () {
      this.scroll && this.scroll.enable()
    },
    disable () {
      this.scroll && this.scroll.disable()
    },
    refresh () {
      this.scroll && this.scroll.refresh()
    },
    scrollTo () {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    scrollToElement () {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    }
  }
}
</script>

<style>

</style>
