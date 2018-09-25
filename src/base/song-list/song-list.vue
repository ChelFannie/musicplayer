<template>
 <div class="song-list">
   <ul>
     <li
      class="item"
      v-for="(item, index) in songs"
      :key="index"
      @click="selectItem(item, index)">
        <div class="rank" v-show="rank">1111</div>
       <div class="content">
         <h2 class="name">{{item.name}}</h2>
         <p class="desc">{{getDesc(item)}}</p>
       </div>
     </li>
   </ul>
 </div>
</template>

<script>
export default {
  props: {
    songs: {
      type: Array,
      default: function () {
        return []
      }
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {

    }
  },
  created () {

  },
  methods: {
    // 得到歌曲详情信息
    getDesc (song) {
      return `${song.singer}·${song.album}`
    },
    selectItem (item, index) {
      this.$emit('select', item, index)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.song-list
  .item
    display flex
    align-items center
    box-sizing border-box
    height 64px
    font-size $font-size-medium
    .rank
      flex 0 0 25px
      width 25px
      height: 20px
      margin-right 30px
      text-align center
    .content
      flex 1
      line-height 20px
      overflow hidden
      .name
        no-wrap()
        color: $color-text
      .desc
        no-wrap()
        margin-top: 4px
        color: $color-text-d
</style>
