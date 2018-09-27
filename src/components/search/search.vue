<template>
 <div class="search">
   <div class="search-box-wrapper">
    <search-box ref="searchBox" @query="onQueryChange"></search-box>
   </div>
   <div class="shortcut-wrapper" v-show="!query">
     <div class="shortcut">
       <div class="hot-key">
         <h1 class="title">热门搜索</h1>
         <ul>
           <li
            class="item"
            v-for="(item, index) in hotKey"
            :key="index"
            @click="addQuery(item.k)">{{item.k}}</li>
         </ul>
       </div>
     </div>
   </div>
   <div class="search-result" v-show="query" ref="searchResult">
     <suggest
      :query="query"
      @listScroll="blurInput"
      @select="saveSearch"
      ref="suggest"></suggest>
   </div>
   <router-view></router-view>
 </div>
</template>

<script>
import SearchBox from 'base/search-box/search-box'
import {getHotKey} from 'api/search.js'
import {ERR_OK} from 'api/config.js'
import Suggest from 'components/suggest/suggest'
import {playlistMixin} from 'common/js/mixins.js'

export default {
  name: 'search',
  mixins: [playlistMixin],
  components: {
    SearchBox,
    Suggest
  },
  data () {
    return {
      // 热门搜索词
      hotKey: [],
      // 查询内容
      query: ''
    }
  },
  created () {
    this._getHotKey()
  },
  methods: {
    // 获取数据
    _getHotKey () {
      getHotKey().then(res => {
        if (res.code === ERR_OK) {
          // console.log(res.data.hotkey)
          this.hotKey = res.data.hotkey.slice(0, 20)
        }
      })
    },
    // 点击热门搜索词,设置输入框内容
    addQuery (query) {
      this.$refs.searchBox.setQuery(query)
    },
    // 接受子组件值
    onQueryChange (query) {
      this.query = query
    },
    // 列表滚动之前，让输入框失去焦点
    blurInput () {
      this.$refs.searchBox.blur()
    },
    // 使用mixin对象，根据是否有小播放器，设置底部的bottom值
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '60px' : 0
      this.$refs.searchResult.style.bottom = bottom
      this.$refs.suggest.refresh()
    },
    saveSearch () {}
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .search
    .search-box-wrapper
      margin 20px
    .shortcut-wrapper
      position fixed
      top 178px
      bottom 0
      width 100%
      .shortcut
        height 100%
        overflow hidden
        .hot-key
          margin 0 20px 20px
          .title
            margin-bottom 20px
            font-size $font-size-medium
            color $color-text-l
          .item
              display inline-block
              padding 5px 10px
              margin: 0 20px 10px 0
              border-radius 6px
              background $color-highlight-background
              font-size $font-size-medium
              color $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>
