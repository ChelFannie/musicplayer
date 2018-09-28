<template>
  <div class="search-list">
    <ul>
      <li
        class="search-item"
        v-for="(item, index) in searches"
        :key="index"
        @click="selectItem(item)">
        <span class="text">{{item}}</span>
        <span class="icon" @click.stop="deleteOne(item)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'searchList',
  props: {
    searches: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {

    }
  },
  created () {

  },
  methods: {
    // 选中某一行
    selectItem (item) {
      this.$emit('select', item)
    },
    // 删除某一行
    deleteOne (item) {
      this.$emit('delete', item)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .search-list
    .search-item
      display flex
      align-items center
      height 40px
      overflow hidden
      font-size $font-size-medium
      .text
        flex 1
        color $color-text-l
      .icon
        extend-click()
        .icon-delete
          font-size $font-size-small
          color $color-text-d
</style>
