<template>
  <transition name="slide">
    <!-- 因为add-song是playlist的子组件，点击add-song可能冒泡到父组件，所以要使用@click.stop阻止冒泡 -->
    <div class="add-song" v-show="showFlag" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close">
          <i class="icon-close"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <search-box
          placeholder="搜索歌曲"
          @query="onQueryChange"
          ref="searchBox"></search-box>
      </div>
      <div class="shortcut" v-show="!query"></div>
      <div class="search-result" v-show="query">
        <suggest
          :query="query"
          :showSinger="showSinger"
          @listScroll="blurInput"
          @select="saveSearch"></suggest>
      </div>
    </div>
  </transition>
</template>

<script>
import SearchBox from 'base/search-box/search-box'
import {searchMixin} from 'common/js/mixins.js'
import Suggest from 'components/suggest/suggest'

export default {
  name: 'add-song',
  mixins: [searchMixin],
  components: {
    SearchBox,
    Suggest
  },
  data () {
    return {
      showFlag: false,
      showSinger: false
    }
  },
  created () {

  },
  methods: {
    show () {
      this.showFlag = true
    },
    hide () {
      this.showFlag = false
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .add-song
    position fixed
    top 0
    bottom 0
    width 100%
    z-index 200
    background $color-background
    &.slide-enter-active, &.slide-leave-active
      transition all 0.3s
    &.slide-enter, &.slide-leave-to
      transform translate3d(100%, 0, 0)
    .header
      position relative
      height 44px
      text-align center
      .title
        line-height 44px
        font-size $font-size-large
        color $color-text
      .close
        position absolute
        top 0
        right 8px
        .icon-close
          display block
          padding 12px
          font-size 20px
          color $color-theme
    .search-box-wrapper
      margin 20px
    // .shortcut
</style>
