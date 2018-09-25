<template>
  <transition name="slide">
    <music-list
      :title="title"
      :bg-image="bgImage"
      :rank="rank"
      :songs="songs"></music-list>
  </transition>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import {mapGetters, mapMutations} from 'vuex'
import {getMusicList} from 'api/rank'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'

export default {
  components: {
    MusicList
  },
  data () {
    return {
      rank: true,
      songs: []
    }
  },
  computed: {
    ...mapGetters([
      'topList'
    ]),
    title () {
      return this.topList.topTitle
    },
    bgImage () {
      // return this.topList.picUrl
      if (this.songs.length) {
        return this.songs[0].image
      }
      return ''
    }
  },
  created () {
    if (Object.keys(this.topList).length) {
      localStorage.setItem('topList', JSON.stringify(this.topList))
    } else {
      this.setTopList(JSON.parse(localStorage.getItem('topList')))
    }
    this._getMusicList()
  },
  methods: {
    ...mapMutations({
      setTopList: 'SET_TOP_LIST'
    }),
    // 获取数据
    _getMusicList () {
      getMusicList(this.topList.id).then(res => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.songlist)
        }
      })
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach((item) => {
        const musicData = item.data
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
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
