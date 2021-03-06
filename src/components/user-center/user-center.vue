<template>
  <transition name="slide">
    <div class="user-center">
      <div class="back" @click.stop="back">
        <i class="icon-back"></i>
      </div>
      <div class="switches-wrapper">
        <switches :switches="switches" :current-index="currentIndex" @switch="switchItem"></switches>
      </div>
      <div class="play-btn" @click="random">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <scroll
          :data="favoriteList"
          class="list-scroll"
          v-if="currentIndex===0"
          ref="favoriteList">
          <div class="list-inner">
            <song-list :songs="favoriteList" @select="selectSong"></song-list>
          </div>
        </scroll>
        <scroll
          ref="playHistory"
          v-if="currentIndex===1"
          class="list-scroll"
          :data="playHistory">
          <div class="list-inner">
            <song-list :songs="playHistory" @select="selectSong"></song-list>
          </div>
        </scroll>
      </div>
      <div class="no-result-wrapper" v-show="noResult">
        <no-result :title="noResultDesc"></no-result>
      </div>
    </div>
  </transition>
</template>

<script>
import Switches from 'base/switches/switches'
import SongList from 'base/song-list/song-list'
import {mapGetters, mapActions} from 'vuex'
import Scroll from 'base/scroll/scroll'
import Song from 'common/js/song'
import {playlistMixin} from 'common/js/mixins.js'
import NoResult from 'base/no-result/no-result'

export default {
  name: 'user-center',
  mixins: [playlistMixin],
  components: {
    Switches,
    SongList,
    Scroll,
    NoResult
  },
  data () {
    return {
      switches: [
        {name: '我喜欢的'},
        {name: '最近听的'}
      ],
      currentIndex: 0
    }
  },
  computed: {
    ...mapGetters([
      'favoriteList',
      'playHistory'
    ]),
    // 控制没有数据提示的显示与隐藏
    noResult () {
      if (this.currentIndex === 0) {
        return !this.favoriteList.length
      } else if (this.currentIndex === 1) {
        return !this.playHistory.length
      }
    },
    noResultDesc () {
      if (this.currentIndex === 0) {
        return '暂无收藏歌曲'
      } else {
        return '你还没有听过歌曲'
      }
    }
  },
  created () {

  },
  methods: {
    ...mapActions([
      'insertSong',
      'randomPlay'
    ]),
    back () {
      this.$router.back()
    },
    // 切换switch
    switchItem (index) {
      this.currentIndex = index
    },
    // 选中某首歌
    selectSong (item) {
      this.insertSong(new Song(item))
    },
    // 随机播放歌曲
    random () {
      let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory
      // 没有歌曲数据
      if (list.length === 0) {
        return
      }
      list = list.map(song => {
        return new Song(song)
      })
      this.randomPlay({list})
    },
    handlePlaylist (playlist) {
      const bottom = playlist.length ? '60px' : 0
      this.$refs.listWrapper.style.bottom = bottom
      this.$refs.favoriteList && this.$refs.favoriteList.refresh()
      this.$refs.playHistory && this.$refs.playHistory.refresh()
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .user-center
    position fixed
    top 0
    bottom 0
    z-index 100
    width 100%
    background $color-background
    &.slide-enter-active, &.slide-leave-active
      transition all 0.3s
    &.slide-enter, &.slide-leave-to
      transform translate3d(100%, 0, 0)
    .back
      position absolute
      top 0
      left 6px
      z-index 50
      .icon-back
        display block
        padding 10px
        font-size $font-size-large-x
        color $color-theme
    .switches-wrapper
      margin 10px 0 30px
    .play-btn
      box-sizing border-box
      width 135px
      padding 7px 0
      margin 0 auto
      text-align center
      border 1px solid $color-text-l
      color $color-text-l
      border-radius 100px
      .icon-play
        display inline-block
        vertical-align middle
        margin-right 6px
        font-size $font-size-medium-x
      .text
        display inline-block
        vertical-align middle
        font-size $font-size-small
    .list-wrapper
      position absolute
      top 110px
      bottom 0
      width 100%
      .list-scroll
        height 100%
        overflow hidden
        .list-inner
          padding 20px 30px
    .no-result-wrapper
      position absolute
      top 50%
      transform translateY(-50%)
      width 100%
</style>
