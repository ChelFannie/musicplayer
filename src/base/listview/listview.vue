<template>
  <scroll
    class="listview"
    :data="data"
    :listen-scroll="listenScroll"
    :probe-type="probeType"
    ref="listview"
    @scroll="scroll">
    <ul>
      <li v-for="(group, index) in data" :key="index" class="list-group" ref="listGrop">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li
            class="list-group-item"
            v-for="(item, index1) in group.items"
            :key="index1"
            @click="selectItem(item)">
            <!-- 使用图片懒加载技术 -->
            <img class="avatar" v-lazy="item.avatar" alt="">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div
      class="list-shortcut"
      @touchstart="onShortcutTouchStart($event)"
      @touchmove.stop.prevent="onShortcutTouchMove($event)">
      <ul >
        <li
        class="item"
        v-for="(item, index) in shortcutList"
        :key="index"
        :class="{'current': currentIndex === index}"
        :data-index="index">{{item}}</li>
      </ul>
    </div>
    <div class="list-fixed">
      <div class="fixed-title" ref="fixedTitle" v-show="fixedTitle">{{fixedTitle}}</div>
    </div>
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {getData} from 'common/js/dom.js'
// 标题栏的高度
const TITLE_HEIGHT = 30
// 右侧导航每个元素的高度
const ANCHOR_HEIGHT = 18
export default {
  components: {
    Scroll,
    Loading
  },
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
  computed: {
    // 得到右侧的导航条
    shortcutList () {
      return this.data.map(group => {
        return group.title.substr(0, 1)
      })
    },
    // 固定的标题栏
    fixedTitle () {
      // 最初时，data的数据为空，所以scrollY可能为0
      if (this.scrollY > 0) {
        return ''
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  watch: {
    data () {
      this.$nextTick(() => {
        this._calculateHeight()
      })
      // setTimeout(() => {
      //   this._calculateHeight()
      // }, 20)
    },
    // 实时监听滚动的Y轴的距离
    scrollY (newY) {
      // newY是个负数  listHeight数组中的数都是正数
      // console.log(newY, 'newY')
      const listHeight = this.listHeight
      // console.log(this.listHeight)
      // 当滚动到顶部，newY>0
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      // 在中间部分滚动
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i
          // 滚动区块的上限和滚动位置的滚动差 newY为负数，所以相加
          this.diff = height2 + newY
          // console.log(this.currentIndex)
          return
        }
      }
      // 当滚动到底部，且-newY大于最后一个元素的上限
      this.currentIndex = listHeight.length - 2
    },
    // 滚动区块的上限和滚动位置的滚动差
    diff (newVal) {
      let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixedTitle.style.transform = `translate3D(0, ${fixedTop}px, 0)`
    }
  },
  data () {
    return {
      // 滚动的位置
      scrollY: -1,
      // 滚动列表的当前索引值
      currentIndex: 0,
      // 滚动区块的上限和滚动位置的滚动差
      diff: -1
    }
  },
  created () {
    // 在data或者props定义的数据，vue会自动添加set和get属性，用于观察数据的变化，而这里不需要
    // 创建toch对象，记录起始位置和终点位置
    this.touch = {}
    this.listenScroll = true
    this.listHeight = []
    // probeType必须是3才能实时得到滚动效果
    this.probeType = 3
  },
  methods: {
    // 向父组件派发事件
    selectItem (item) {
      this.$emit('select', item)
    },
    // vue移动端的touchstart事件
    onShortcutTouchStart (e) {
      // this.$refs.listview.scrollToElement(this.$refs.listGrop[index], 0)
      // 获取元素的自定义属性的值
      let anchorIndex = getData(e.target, 'index')
      // this._scrollTo(index)
      this._scrollTo(anchorIndex)
      let firstTouch = e.touches[0]
      this.touch.y1 = firstTouch.pageY
      // 记录下滑动开始的anchorIndex
      this.touch.anchorIndex = anchorIndex
    },
    // vue移动端的touchmovu事件
    onShortcutTouchMove (e) {
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      // 在y轴的偏移量
      let delta1 = this.touch.y2 - this.touch.y1
      // 计算偏移了几个字母值，并去零取整
      let delta = delta1 / ANCHOR_HEIGHT | 0
      // 得到移动后手离开屏幕的字母的index
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta
      // this.$refs.listview.scrollToElement(this.$refs.listGrop[anchorIndex], 0)
      this._scrollTo(anchorIndex)
    },
    // 监听scroll组件，scroll组件会派发事件，得到对应滚动的位置
    scroll (position) {
      // console.log(position)
      this.scrollY = position.y
    },
    // 给父组件暴露一个方法
    refresh () {
      this.$refs.listview.refresh()
    },
    // 调用BScroll中的scrollToElement 第二个参数的函数是是否需要滚动动画，这里不需要
    _scrollTo (index) {
      // index如果null或者拖动到顶部或者顶部时，处理index的边界问题
      if (!index && index !== 0) {
        return
      }
      if (index <= 0) {
        index = 0
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }
      // 点击右侧导航，得到scrollY，再检测scrollY就可以让左侧列表到达相应位置
      this.$refs.listview.scrollToElement(this.$refs.listGrop[index], 0)
      // 当滚动列表时，只会派发scrollToElement事件，不会触发右侧的导航条的变化，而右侧导航条是根据scrollY变化的，所以列表滚动时，需要设置scrollY
      this.scrollY = -this.listHeight[index]
    },
    // 计算每个listGrop高度
    _calculateHeight () {
      // 每个分类列表的高度的数组 都为正数
      this.listHeight = []
      const list = this.$refs.listGrop
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        // 得到每个listGrop距离顶部的距离
        height += item.clientHeight
        this.listHeight.push(height)
      }
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
      &.current
        color: $color-theme
  .list-fixed
    position absolute
    top -1px
    left 0
    width 100%
    .fixed-title
      height 30px
      line-height 30px
      padding-left 20px
      font-size $font-size-small
      color $color-text-l
      background $color-highlight-background
  .loading-container
    position: absolute
    width: 100%
    top: 50%
    transform: translateY(-50%)
</style>
