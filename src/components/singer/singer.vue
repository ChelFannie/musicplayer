<template>
 <div class="singer">
  {{msg}}
 </div>
</template>

<script>
import {getSingerList} from 'api/singer.js'
import {ERR_OK} from 'api/config.js'
export default {
  name: 'singer',
  data () {
    return {
      msg: 'singer',
      singers: []
    }
  },
  created () {
    this._getSingerList()
  },
  methods: {
    _getSingerList () {
      getSingerList().then(res => {
        if (res.code === ERR_OK) {
          this.singers = res.data.list
        }
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.singer
  position fixed
  top 88px
  bottom 0
  width 100%
</style>
