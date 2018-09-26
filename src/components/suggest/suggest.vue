<template>
  <div class="suggest">
    <ul class="suggest-list">
      <li class="suggest-item">
        <div class="icon">
          <i></i>
        </div>
        <div class="name">
          <p class="text"></p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import {search} from 'api/search.js'
import {ERR_OK} from 'api/config.js'

const perpage = 20
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
      page: 1
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
            console.log(res.data)
          }
        })
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
