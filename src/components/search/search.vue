<template>
 <div class="search">
   <div class="search-box-wrapper">
    <search-box ref="searchBox" @query="onQueryChange"></search-box>
   </div>

    <!-- 热门搜索词 -->
   <div class="shortcut-wrapper" v-show="!query" ref="shortcutWrapper">
     <scroll class="shortcut" :data="shortcut" ref="shortcut" :refreshDelay="refreshDelay">
       <div>
        <!-- 热门搜索词 -->
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

        <!-- 搜索历史 -->
        <div class="search-history" v-show="searchHistory.length">
          <h1 class="title">
            <span class="text">搜索历史</span>
            <span class="clear" @click="clearAllHistory">
              <i class="icon-clear"></i>
            </span>
          </h1>
          <search-list
            :searches="searchHistory"
            @select="addQuery"
            @delete="deleteOne"></search-list>
        </div>
      </div>
     </scroll>
   </div>

    <!-- 搜索内容 -->
   <div class="search-result" v-show="query" ref="searchResult">
     <suggest
      :query="query"
      @listScroll="blurInput"
      @select="saveSearch"
      ref="suggest"></suggest>
   </div>

   <confirm
    ref="confirm"
    text="是否清空"
    @confirm="confirmClearHistory"></confirm>
   <router-view></router-view>
 </div>
</template>

<script>
import SearchBox from 'base/search-box/search-box'
import {getHotKey} from 'api/search.js'
import {ERR_OK} from 'api/config.js'
import Suggest from 'components/suggest/suggest'
import {playlistMixin, searchMixin} from 'common/js/mixins.js'
import {mapActions} from 'vuex'
import SearchList from 'base/search-list/search-list'
import Scroll from 'base/scroll/scroll'
// import {deleteSearch} from 'common/js/cache.js'
import Confirm from 'base/confirm/confirm'

export default {
  name: 'search',
  mixins: [playlistMixin, searchMixin],
  components: {
    SearchBox,
    Suggest,
    SearchList,
    Scroll,
    Confirm
  },
  data () {
    return {
      // 热门搜索词
      hotKey: [],
      refreshDelay: 100
    }
  },
  watch: {
    // 当列表在清空输入框时，列表不会滚动，需要重新初始化scroll组件
    query (newQuery) {
      if (!newQuery) {
        setTimeout(() => {
          this.$refs.shortcut.refresh()
        }, 20)
      }
    }
  },
  computed: {
    // 给scroll组件添加data的数据时，因为历史搜索记录是改变的，需要动态计算出来
    shortcut () {
      return this.hotKey.concat(this.searchHistory)
    }
  },
  created () {
    this._getHotKey()
  },
  methods: {
    ...mapActions([
      'clearSearchHistory'
    ]),
    // 获取数据
    _getHotKey () {
      getHotKey().then(res => {
        if (res.code === ERR_OK) {
          // console.log(res.data.hotkey)
          this.hotKey = res.data.hotkey.slice(0, 10)
        }
      })
    },
    // 使用mixin对象，根据是否有小播放器，设置底部的bottom值
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '60px' : 0
      this.$refs.searchResult.style.bottom = bottom
      this.$refs.suggest.refresh()

      this.$refs.shortcutWrapper.style.bottom = bottom
      this.$refs.shortcut.refresh()
    },
    // 清空所有的历史搜索
    clearAllHistory () {
      this.$refs.confirm.show()
    },
    confirmClearHistory () {
      this.$refs.confirm.hide()
      this.clearSearchHistory()
    }
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
        .search-history
          margin 0 20px
          .title
            display flex
            align-items center
            height 40px
            font-size $font-size-medium
            color $color-text-l
            .text
              flex 1
            .clear
              extend-click()
              .icon-clear
                font-size $font-size-medium
                color $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>
