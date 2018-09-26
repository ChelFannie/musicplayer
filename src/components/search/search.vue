<template>
 <div class="search">
   <div class="search-box-wrapper">
    <search-box></search-box>
   </div>
 </div>
</template>

<script>
import SearchBox from 'base/search-box/search-box'

export default {
  name: 'search',
  components: {
    SearchBox
  },
  data () {
    return {

    }
  },
  created () {
  },
  methods: {

  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .search
    .search-box-wrapper
      margin 20px
</style>
