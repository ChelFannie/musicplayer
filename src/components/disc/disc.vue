<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import {mapGetters, mapMutations} from 'vuex'
import {getSongList} from 'api/recommend'
import {ERR_OK} from 'api/config.js'
import {createSong} from 'common/js/song'

export default {
  components: {
    MusicList
  },
  data () {
    return {
      songs: []
    }
  },
  computed: {
    ...mapGetters([
      'disc'
    ]),
    title () {
      return this.disc.dissname
    },
    bgImage () {
      return this.disc.imgurl
    }
  },
  created () {
    if (Object.keys(this.disc).length) {
      localStorage.setItem('disc', JSON.stringify(this.disc))
    } else {
      this.setDisc(JSON.parse(localStorage.getItem('disc')))
    }
    this._getSongList()
  },
  methods: {
    // 获取歌单详情页数据
    _getSongList () {
      getSongList(this.disc.dissid).then(res => {
        if (res.code === ERR_OK) {
          // console.log(res.cdlist[0].songlist)
          this.songs = this._normalizeSongs(res.cdlist[0].songlist)
        }
      })
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach(musicData => {
        if (musicData.songid && musicData.albumid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    },
    ...mapMutations({
      setDisc: 'SET_DISC'
    })
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
