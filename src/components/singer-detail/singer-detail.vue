<template>
  <transition name="slide">
    <div class="singer-detail">

    </div>
  </transition>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import {getSingerDetail} from 'api/singer.js'
import {ERR_OK} from 'api/config.js'
import {createSong} from 'common/js/song.js'
export default {
  data () {
    return {
      songs: [],
      singerParams: {}
    }
  },
  computed: {
    ...mapGetters([
      'singer'
    ])
  },
  created () {
    if (Object.keys(this.singer).length) {
      this.singerParams = this.singer
      localStorage.setItem('singerId', JSON.stringify(this.singer))
    } else {
      this.singerParams = JSON.parse(localStorage.getItem('singerId'))
      this.setSinger(this.singerParams)
    }
    this._getDetail()
  },
  methods: {
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    _getDetail () {
      // 如果在歌手的详情页刷新，获取不到this.singer.id
      // if (!this.singer.id) {
      //   this.$router.push('/singer')
      //   return
      // }
      getSingerDetail(this.singerParams.id)
        .then(res => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.data.list)
            console.log(this.songs)
          }
        })
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach(item => {
        let {musicData} = item
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable'
.singer-detail
  position fixed
  z-index 100
  top 0
  left 0
  right 0
  bottom 0
  background $color-background
.slide-enter-active, .slide-leave-active{
  transition all 0.3s
}
.slide-enter, .slide-leave-to{
  transform translate3d(100%, 0, 0)
}
</style>
