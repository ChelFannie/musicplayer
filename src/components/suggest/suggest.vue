<template>
  <div class="suggest">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="(item, index) in result" :key="index">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text">{{getDisplayName(item)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import {search} from 'api/search.js'
import {createSong} from 'common/js/song.js'
import {ERR_OK} from 'api/config.js'

const perpage = 20
const TYPE_SINGER = 'singer'
export default {
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
      result: []
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
    // 查询搜索内容
    _search () {
      search(this.query, this.showSinger, this.page, perpage)
        .then(res => {
          if (res.code === ERR_OK) {
            this.result = this._getResult(res.data)
          }
        })
    },
    // 处理搜索结果
    _getResult (data) {
      let ret = []
      if (data.zhida && data.zhida.albummid) {
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
</style>
