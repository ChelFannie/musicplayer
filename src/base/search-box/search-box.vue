<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input
      v-model="query"
      type="text"
      class="box"
      :placeholder="placeholder">
    <i class="icon-dismiss" v-show="query" @click="clear"></i>
  </div>
</template>

<script>
import {debounce} from 'common/js/util.js'
export default {
  props: {
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手'
    }
  },
  data () {
    return {
      query: ''
    }
  },
  watch: {
  },
  created () {
    // this.$watch('query', (newValue) => {
    this.$watch('query', debounce((newValue) => {
      this.$emit('query', newValue)
    }, 200))
  },
  methods: {
    clear () {
      this.query = ''
    },
    setQuery (query) {
      this.query = query
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .search-box
    display flex
    align-items center
    box-sizing border-box
    width 100%
    padding 0 6px
    height 40px
    background $color-highlight-background
    border-radius 6px
    .icon-search
      font-size 24px
      color $color-background
    .box
      flex 1
      margin 0 5px
      background $color-highlight-background
      color $color-text
      font-size $font-size-medium
      outline none
      // 设置占位字符的样式
      &::placeholder
        color $color-text-d
    .icon-dismiss
      font-size 16px
      color $color-background
</style>
