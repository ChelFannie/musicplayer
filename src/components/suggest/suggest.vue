<template>
  <scroll
    class="suggest"
    :data="result"
    :pullup="pullup"
    :beforeScroll="beforeScroll"
    @scrollToEnd="searchMore"
    @beforeScroll="listScroll"
    ref="suggest">
    <ul class="suggest-list">
      <li
        class="suggest-item"
        v-for="(item, index) in result"
        :key="index"
        @click="selectItem(item)">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text">{{getDisplayName(item)}}</p>
        </div>
      </li>
      <loading v-show="hasMore" title="努力加载中..."></loading>
    </ul>
    <div class="no-result-wrapper" v-show="!hasMore && !result.length">
      <no-result title="暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script>
import {search} from 'api/search.js'
import {createSong} from 'common/js/song.js'
import {ERR_OK} from 'api/config.js'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import Singer from 'common/js/singer.js'
import {mapMutations, mapActions} from 'vuex'
import NoResult from 'base/no-result/no-result'

// 搜索条数
const perpage = 20
const TYPE_SINGER = 'singer'
export default {
  name: 'suggest',
  components: {
    Scroll,
    Loading,
    NoResult
  },
  props: {
    // 搜索内容
    query: {
      type: String,
      default: ''
    },
    // 是否显示歌手内容
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      // 页数
      page: 1,
      // 搜索结果
      result: [],
      // 上拉刷新
      pullup: true,
      // 是否可以下拉刷新
      hasMore: false,
      beforeScroll: true
    }
  },
  watch: {
    // 当搜索内容有变化时，就发送请求
    query (newQuery) {
      if (newQuery) {
        this._search()
      }
    }
  },
  created () {

  },
  methods: {
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions([
      'insertSong'
    ]),
    // 查询搜索内容
    _search () {
      // 第一次搜索
      this.page = 1
      this.hasMore = true
      // 切换搜索关键词时,初始化到顶端
      this.$refs.suggest.scrollTo(0, 0)
      search(this.query, this.page, this.showSinger, perpage)
        .then(res => {
          if (res.code === ERR_OK) {
            this.result = this._getResult(res.data)
            // 判断是否有更多数据
            this._checkMore(res.data)
          }
        })
    },
    // 处理搜索结果
    _getResult (data) {
      let ret = []
      if (data.zhida && data.zhida.singermid && data.zhida.type === 2) {
        ret.push({...data.zhida, type: TYPE_SINGER})
      }
      if (data.song) {
        ret.push(...this._normalizeSongs(data.song.list))
      }
      return ret
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach((musicData) => {
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    },
    // 获取搜索列表icon的样式
    getIconCls (item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    // 获取搜索列表文本内容
    getDisplayName (item) {
      if (item.type === TYPE_SINGER) {
        return item.singername
      } else {
        return `${item.singer}-${item.name}`
      }
    },
    // 上拉刷新
    searchMore () {
      if (!this.hasMore) {
        return
      }
      this.page++
      search(this.query, this.page, this.showSinger, perpage)
        .then(res => {
          if (res.code === ERR_OK) {
            // 将结果追加到列表中
            this.result = [...this.result, ...this._getResult(res.data)]
            // 判断是否有更多数据
            this._checkMore(res.data)
          }
        })
    },
    // 判断是否有更多数据
    _checkMore (data) {
      const song = data.song
      if (!song.list.length || (song.curnum + (song.curpage - 1) * perpage) >= song.totalnum) {
        this.hasMore = false
      }
    },
    // 点击搜索列表
    selectItem (item) {
      // 如果是歌手，则跳转到歌手详情页，如果是歌曲，就追加到当前播放歌曲的后面
      if (item.type === TYPE_SINGER) {
        const singer = new Singer({
          id: item.singermid,
          name: item.singername
        })
        this.$router.push({path: `/search/${singer.id}`})
        this.setSinger(singer)
      } else {
        this.insertSong(item)
      }
    },
    // 列表滚动之前
    listScroll () {
      this.$emit('listScroll')
    },
    // 给父组件暴露一个方法
    refresh () {
      this.$refs.suggest.refresh()
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height 100%
    overflow hidden
    .suggest-list
      padding 0 30px
      .suggest-item
        display flex
        align-items center
        padding-bottom 20px
        .icon
          flex 0 0 30px
          width 30px
        .name
          flex 1
          font-size $font-size-medium
          color $color-text-d
          overflow hidden
          .text
            no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
